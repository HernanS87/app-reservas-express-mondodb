import { MesaRepository } from "../repository/mesaRepository";
import { MesaModelType } from "../model/entity/mesa";
import { HydratedDocument, Types } from "mongoose";
import { ReservaModelType } from "../model/entity/reserva";
import { IMesasOcupadasPorTurnoYHorario } from "../model/interface/calendarioInterface";
import { getTipoTurno, TipoTurno } from "../enum/tipoTurnoEnum";
import { HorasCena } from "../enum/horasCenaEnum";
import { HorasAlmuerzo } from "../enum/horasAlmuerzoEnum";
import { sumarORestarMinutos } from "../util/dateUtil";

const mesaRepository = new MesaRepository();

export class MesaService {
  async getAll(): Promise<HydratedDocument<MesaModelType>[]> {
    return await mesaRepository.getAll();
  }

  async getById(id: string): Promise<HydratedDocument<MesaModelType> | null> {
    return await mesaRepository.getById(id);
  }

  async save(mesa: MesaModelType): Promise<HydratedDocument<MesaModelType>> {
    return await mesaRepository.save(mesa);
  }

  async delete(id: string): Promise<HydratedDocument<MesaModelType> | null> {
    return await mesaRepository.delete(id);
  }

  async update() {}

  buscarMesasOcupadasPorTurnoYHorarioEnListaReservas(
    turno: string,
    reservasDelDia: HydratedDocument<ReservaModelType>[]
  ): IMesasOcupadasPorTurnoYHorario[] {
    const mesasOcupadasPorHorario: IMesasOcupadasPorTurnoYHorario[] = [];

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

  public async buscarMesasDisponiblesPorCantPersonas(
    cantidadPersonas: number,
    mesasNoDisponiblesId: Types.ObjectId[]
  ): Promise<Types.ObjectId[]> {
    // 1. Buscar si hay una mesa con capacidad exacta
    const mesaExacta = await mesaRepository.getMesaDisponiblePorCapacidad(
      cantidadPersonas,
      mesasNoDisponiblesId
    );

    if (mesaExacta) {
      return [mesaExacta._id];
    }

    // 2. Busca la mesa más grande y cercana a la cantidad de personas
    const mesaGrandeCercana =
      await mesaRepository.getMesaDisponiblePorCapacidadMayorMasCercana(
        cantidadPersonas,
        mesasNoDisponiblesId
      );

    if (mesaGrandeCercana) {
      return [mesaGrandeCercana._id];
    }

    const { personasRestantes, mesasAsignadas } =
      await this.buscarMesasConMenorCapacidad(
        cantidadPersonas,
        mesasNoDisponiblesId
      );

    // Si aún quedan personas y no se pueden acomodar, tirar error
    if (personasRestantes > 0) {
      throw new Error("No hay suficientes mesas disponibles para esta reserva"); //TODO chequear si es conveniente majerlo asi o simplemente devolver un array vacío
    }

    return mesasAsignadas;
  }

  private async buscarMesasConMenorCapacidad(
    cantidadPersonas: number,
    mesasNoDisponiblesId: Types.ObjectId[] = []
  ): Promise<{ personasRestantes: number; mesasAsignadas: Types.ObjectId[] }> {
    const mesasDisponibles = await mesaRepository.getMesasDisponibles(
      mesasNoDisponiblesId
    );

    // 3. Buscar la mesa más pequeña cercana (capacidad < cantidadPersonas, pero la más grande posible)
    const mesaPequeñaCercana = mesasDisponibles
      .filter((mesa) => mesa.capacidad < cantidadPersonas)
      .sort((a, b) => b.capacidad - a.capacidad)[0]; // Ordenar descendente y tomar la más grande

    const mesasAsignadas = [];
    let personasRestantes = cantidadPersonas;

    // Si encontramos una mesa pequeña cercana, la asignamos
    if (mesaPequeñaCercana) {
      mesasAsignadas.push(mesaPequeñaCercana._id);
      // Eliminar la mesa asignada de las disponibles
      mesasDisponibles.splice(mesasDisponibles.indexOf(mesaPequeñaCercana), 1);
      personasRestantes -= mesaPequeñaCercana.capacidad;
    }

    const mesasDisponiblesMenorCantPers = mesasDisponibles.filter(
      (mesa) => mesa.capacidad <= cantidadPersonas
    );
    // 4. Si aún quedan personas, combinar mesas más pequeñas disponibles
    if (personasRestantes > 0) {
      for (const mesa of mesasDisponiblesMenorCantPers) {
        if (personasRestantes <= 0) break;

        if (mesa.capacidad >= personasRestantes) {
          mesasAsignadas.push(mesa._id);
          personasRestantes = 0;
          break; // Asignamos una mesa que cubre todas las personas restantes
        }

        if (mesa.capacidad < personasRestantes) {
          mesasAsignadas.push(mesa._id);
          personasRestantes -= mesa.capacidad;
        }
      }
    }
    return { personasRestantes, mesasAsignadas };
  }

  async isAlgunaMesaDisponibleParaCualquierHorarioReserva(
    personas: number,
    mesasOcupadasPorHorario: IMesasOcupadasPorTurnoYHorario[]
  ): Promise<boolean> {
    for (const elem of mesasOcupadasPorHorario) {
      const mesasOcupadasId = [...new Set(elem.mesasOcupadasId)]; // Eliminamos repetidos
      try {
        const mesasDisponibles =
          await this.buscarMesasDisponiblesPorCantPersonas(
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
