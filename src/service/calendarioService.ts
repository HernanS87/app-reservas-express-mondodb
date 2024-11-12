import { HydratedDocument } from "mongoose";
import { HorasCena } from "../enum/horasCenaEnum";
import { TipoDisponibilidad } from "../enum/tipoDisponibilidadEnum";
import { ReservaModelType } from "../model/entity/reserva";
import {
  IDisponibilidadDia,
  IMesasOcupadasPorHorario,
} from "../model/interface/calendarioInterface";
import {
  endOfDay,
  obtenerDiaSemanaEnum,
  startOfDay,
  sumarORestarMinutos,
} from "../util/dateUtil";
import { ReservaService } from "./reservaService";
import { getTipoTurno, TipoTurno } from "../enum/tipoTurnoEnum";
import { HorasAlmuerzo } from "../enum/horasAlmuerzoEnum";
import { DiaSemana } from "../enum/diaSemanaEnum";

const reservaService = new ReservaService();

export class CalendarioService {

  async getDisponibilidadDias(
    turno: string,
    personas: number
  ): Promise<IDisponibilidadDia[]> {
    const PERIODO_DIAS = 60;

    const fechaInicioPeriodo = startOfDay(new Date());
    fechaInicioPeriodo.setDate(fechaInicioPeriodo.getDate() + 1);
    const fechaFinPeriodo = endOfDay(fechaInicioPeriodo);
    fechaFinPeriodo.setDate(fechaFinPeriodo.getDate() + PERIODO_DIAS);

    const reservasPeriodo: HydratedDocument<ReservaModelType>[] =
      await reservaService.getReservasByPeriodoAndTurno(
        fechaInicioPeriodo,
        fechaFinPeriodo,
        turno
      );

    const disponibilidadDias: IDisponibilidadDia[] = [];

    for (let i = 0; i < PERIODO_DIAS; i++) {
      const dia = startOfDay(fechaInicioPeriodo);
      dia.setDate(dia.getDate() + i);

      //TODO mas adelante deberiamos implementar la logica para validar dias feriados

      // Si el dia es Domingo seteamos el dia no disponible porque está cerrado
      if (obtenerDiaSemanaEnum(dia) === DiaSemana.DOMINGO) {
        disponibilidadDias.push({
          fecha: dia,
          disponible: false,
          tipo: TipoDisponibilidad.NO_DISPONIBLE_CERRADO,
        });
        continue;
      }

      const reservasDelDia = reservasPeriodo.filter(
        (reserva) => startOfDay(reserva.fecha).getDate() == dia.getDate()
      );

      // Si no hay reservas para este dia lo seteamos como disponible
      // Aunque podriamos buscar si hay mesa para la cantidad seleccionada sólo por el motivo que algunas podrian estar dadas de baja. Pero eso lo haremos mas adelante
      if (reservasDelDia.length === 0) {
        disponibilidadDias.push({
          fecha: dia,
          disponible: true,
          tipo: TipoDisponibilidad.DISPONIBLE,
        });
        continue;
      }

      // Si hay reservas. Entonces buscamos las mesas ocupadas por horario
      const mesasOcupadasPorHorario: IMesasOcupadasPorHorario[] =
        this.calcularMesasOcupadasPorHorario(turno, reservasDelDia);

      let isAlgunaMesaDisponible =
        await this.isAlgunaMesaDisponibleParaCualquierHorarioReserva(
          personas,
          mesasOcupadasPorHorario
        );

      disponibilidadDias.push({
        fecha: dia,
        disponible: isAlgunaMesaDisponible,
        tipo: isAlgunaMesaDisponible
          ? TipoDisponibilidad.DISPONIBLE
          : TipoDisponibilidad.NO_DISPONIBLE,
      });
    }

    return disponibilidadDias;
  }

  private calcularMesasOcupadasPorHorario(
    turno: string,
    reservasDelDia: HydratedDocument<ReservaModelType>[]
  ) {
    const mesasOcupadasPorHorario: IMesasOcupadasPorHorario[] = [];

    const horasPorTurno =
      getTipoTurno(turno) == TipoTurno.CENA ? HorasCena : HorasAlmuerzo;

    Object.values(horasPorTurno).forEach((hora) => {
      mesasOcupadasPorHorario.push({
        hora,
        mesasOcupadasId: [],
      });
    });

    reservasDelDia.forEach((reserva) => {
      const inicioPeriodoIndisponibilidadMesasPorReserva = sumarORestarMinutos(
        reserva.hora,
        90,
        "restar"
      );
      const finPeriodoIndisponibilidadMesasPorReserva = sumarORestarMinutos(
        reserva.hora,
        90,
        "sumar"
      );

      mesasOcupadasPorHorario.forEach((elem) => {
        if (
          elem.hora === reserva.hora ||
          (elem.hora < reserva.hora &&
            elem.hora > inicioPeriodoIndisponibilidadMesasPorReserva) ||
          (elem.hora > reserva.hora &&
            elem.hora < finPeriodoIndisponibilidadMesasPorReserva)
        ) {
          elem.mesasOcupadasId.push(...reserva.mesa);
        }
      });
    });
    return mesasOcupadasPorHorario;
  }

  private async isAlgunaMesaDisponibleParaCualquierHorarioReserva(
    personas: number,
    mesasOcupadasPorHorario: IMesasOcupadasPorHorario[]
  ): Promise<boolean> {
    for (const elem of mesasOcupadasPorHorario) {
      const mesasOcupadasId = [...new Set(elem.mesasOcupadasId)]; // Eliminamos repetidos
      try {
        const mesasDisponibles = await reservaService.asignarMesas(
          personas,
          mesasOcupadasId
        );
        if (mesasDisponibles.length > 0) {
          return true;
        }
      } catch (error) {
        // No hay mesas disponibles para este horario
      }
    }
    return false;
  }
}
