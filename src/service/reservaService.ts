import { HydratedDocument, Types } from "mongoose";
import { Reserva, ReservaModelType } from "../model/entity/reserva";
import { MesaRepository } from "../repository/mesaRepository";
import { ReservaRepository } from "../repository/reservaRepository";
// import { enviarCorreoConfirmacion } from "./emailService";

const reservaRepository = new ReservaRepository();
const mesaRepository = new MesaRepository();

export class ReservaService {
  // ------------------------- CRUD ----------------------------------

  async getAll(): Promise<HydratedDocument<ReservaModelType>[]> {
    return await reservaRepository.getAll();
  }

  async getById(
    id: string
  ): Promise<HydratedDocument<ReservaModelType> | null> {
    return await reservaRepository.getById(id);
  }

  async save(
    reserva: ReservaModelType
  ): Promise<HydratedDocument<ReservaModelType>> {
    // por ahora el de reserva va a buscar mesa independientemente el turno.
    //Pero mas adelante hay que validar para que busque reservas para ese dia, turno y hora y asi obtener las mesas q no estan disponibles
    reserva.mesa = await this.asignarMesas(reserva.cantidadPersonas);
    reserva.estado = "CONFIRMADA";
    const nr = new Reserva(reserva);
    const newReserva = await reservaRepository.save(nr);

    //enviarCorreoConfirmacion(newReserva); // Eliminamos el await para que no tengamos que esperar a que se haga el envio para responderle al usuario

    return newReserva;
  }

  async delete(id: string): Promise<HydratedDocument<ReservaModelType> | null> {
    const reservaDeleted = await reservaRepository.delete(id);

    // if (reservaDeleted) {
    //   console.log("RESERVA ELIMINADA", reservaDeleted);
    //   await mesaRepository.cambiarEstadoMesa(reservaDeleted.mesa, "DISPONIBLE");
    // }

    return reservaDeleted;
  }

  async update() {}

  // ------------------------- OTROS ----------------------------------

  async getReservasByPeriodoAndTurno(
    fechaInicio: Date,
    fechaFin: Date,
    turno: string
  ): Promise<HydratedDocument<ReservaModelType>[]> {
    return reservaRepository.getReservasByPeriodoAndTurno(
      fechaInicio,
      fechaFin,
      turno
    );
  }

  public async asignarMesas(
    cantidadPersonas: number,
    mesasNoDisponiblesId: Types.ObjectId[] = []
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
      await this.asignarMesasConMenorCapacidad(
        cantidadPersonas,
        mesasNoDisponiblesId
      );

    // Si aún quedan personas y no se pueden acomodar, tirar error
    if (personasRestantes > 0) {
      throw new Error("No hay suficientes mesas disponibles para esta reserva"); //TODO chequear si es conveniente majerlo asi o simplemente devolver un array vacío
    }

    return mesasAsignadas;
  }

  private async asignarMesasConMenorCapacidad(
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
}
