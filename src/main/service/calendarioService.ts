import { HydratedDocument } from "mongoose";
import { TipoDisponibilidad } from "../enum/tipoDisponibilidadEnum";
import { ReservaModelType } from "../model/entity/reserva";
import {
  IDisponibilidadDia,
  IDisponibilidadDiaHorarios,
  IHorarioMesasOcupadasId,
  IHorarios,
  IRequestDisponibilidadDias,
  IRequestDisponibilidadHorariosXFecha,
} from "../model/interface/calendarioInterface";
import { endOfDay, obtenerDiaAnterior, obtenerDiaSemanaEnum, obtenerDiaSiguiente, startOfDay } from "../util/dateUtil";
import { ReservaService } from "./reservaService";
import { DiaSemana } from "../enum/diaSemanaEnum";
import { MesaService } from "./mesaService";

const reservaService = new ReservaService();
const mesaService = new MesaService();

export class CalendarioService {
  async getDisponibilidadDias(params: IRequestDisponibilidadDias): Promise<IDisponibilidadDia[]> {
    const { turno, personas } = params;

    const PERIODO_DIAS = 60;

    const fechaInicioPeriodo = startOfDay(new Date());
    fechaInicioPeriodo.setDate(fechaInicioPeriodo.getDate() + 1);
    const fechaFinPeriodo = endOfDay(fechaInicioPeriodo);
    fechaFinPeriodo.setDate(fechaFinPeriodo.getDate() + PERIODO_DIAS);

    const reservasPeriodo: HydratedDocument<ReservaModelType>[] = await reservaService.getReservasByPeriodoAndTurno(
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

      const reservasDelDia = reservasPeriodo.filter((reserva) => startOfDay(reserva.fecha).getDate() == dia.getDate());

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
      const horariosMesasOcupadasId: IHorarioMesasOcupadasId[] = mesaService.buscarMesasOcupadasPorTurnoYHorarioEnListaReservas(
        turno,
        reservasDelDia
      );

      let isAlgunaMesaDisponible = await mesaService.isAlgunaMesaDisponibleParaCualquierHorarioReserva(personas, horariosMesasOcupadasId);

      disponibilidadDias.push({
        fecha: dia,
        disponible: isAlgunaMesaDisponible,
        tipo: isAlgunaMesaDisponible ? TipoDisponibilidad.DISPONIBLE : TipoDisponibilidad.NO_DISPONIBLE,
      });
    }

    return disponibilidadDias;
  }

  async getDisponibilidadHorariosFechaDiaAnteriorYPosterior(
    params: IRequestDisponibilidadHorariosXFecha
  ): Promise<IDisponibilidadDiaHorarios[]> {
    const { turno, personas, fecha: fechaTurno } = params;
    // Obtener fechas
    const diaAnterior = obtenerDiaAnterior(fechaTurno);
    const diaSiguiente = obtenerDiaSiguiente(fechaTurno);

    // Ejecutar cálculos en paralelo
    const [disponibilidadDiaAnterior, disponibilidadFechaTurno, disponibilidadDiaSiguiente] = await Promise.all([
      this.obtenerDisponibilidadDia(turno, personas, diaAnterior),
      this.obtenerDisponibilidadDia(turno, personas, fechaTurno),
      this.obtenerDisponibilidadDia(turno, personas, diaSiguiente),
    ]);

    // Retornar el array de respuestas
    return [disponibilidadDiaAnterior, disponibilidadFechaTurno, disponibilidadDiaSiguiente];
  }

  private async obtenerDisponibilidadDia(turno: string, personas: number, fecha: Date): Promise<IDisponibilidadDiaHorarios> {
    const horariosFecha: IHorarios[] = [];

    if (obtenerDiaSemanaEnum(fecha) === DiaSemana.DOMINGO) {
      return {
        fecha,
        disponible: false,
        tipo: TipoDisponibilidad.NO_DISPONIBLE_CERRADO,
        horarios: horariosFecha,
      };
    }

    const reservasXFechaYTurno = await reservaService.getReservasByFechaAndTurno(fecha, turno);

    const horariosMesasOcupadasId: IHorarioMesasOcupadasId[] = mesaService.buscarMesasOcupadasPorTurnoYHorarioEnListaReservas(
      turno,
      reservasXFechaYTurno
    );

    await Promise.all(
      horariosMesasOcupadasId.map(async (horario) => {
        const mesasDisponibles = await mesaService.buscarMesasDisponiblesPorCantPersonasParaReserva(personas, horario.mesasOcupadasId);
        horariosFecha.push({
          hora: horario.hora,
          disponible: mesasDisponibles.length > 0,
        });
      })
    );

    horariosFecha.sort((a, b) => a.hora.localeCompare(b.hora));

    const isAlgunHorarioDisponible = horariosFecha.some((horario) => horario.disponible);

    return {
      fecha,
      disponible: isAlgunHorarioDisponible,
      tipo: isAlgunHorarioDisponible ? TipoDisponibilidad.DISPONIBLE : TipoDisponibilidad.NO_DISPONIBLE,
      horarios: horariosFecha,
    };
  }
}
