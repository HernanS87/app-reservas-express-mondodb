import { HydratedDocument, Types } from "mongoose";
import { Reserva, ReservaModelType } from "../model/entity/reserva";
import { ReservaRepository } from "../repository/reservaRepository";
import { MesaService } from "./mesaService";
// import { enviarCorreoConfirmacion } from "./emailService";

const reservaRepository = new ReservaRepository();
const mesaService = new MesaService();

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
    reserva.mesa =
      await this.obtenerMesasDisponiblesPorFechaTurnoHorarioYCantPersonas(
        reserva.fecha,
        reserva.turno,
        reserva.hora,
        reserva.cantidadPersonas
      );
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

  async getReservasByFechaAndTurno(
    fecha: Date,
    turno: string
  ): Promise<HydratedDocument<ReservaModelType>[]> {
    return reservaRepository.getReservasByFechaAndTurno(fecha, turno);
  }

  private async obtenerMesasDisponiblesPorFechaTurnoHorarioYCantPersonas(
    fecha: Date,
    turno: string,
    horario: string,
    personas: number
  ): Promise<Types.ObjectId[]> {
    const reservasXFechaYTurno = await this.getReservasByFechaAndTurno(
      fecha,
      turno
    );

    const mesasOcupadasPorHorariosTurno =
      mesaService.buscarMesasOcupadasPorTurnoYHorarioEnListaReservas(
        turno,
        reservasXFechaYTurno
      );

    const mesasNoDisponiblesIdPorHorarioSeleccionado =
      mesasOcupadasPorHorariosTurno.find((elem) => elem.hora === horario)
        ?.mesasOcupadasId || [];

    return await mesaService.buscarMesasDisponiblesPorCantPersonas(
      personas,
      mesasNoDisponiblesIdPorHorarioSeleccionado
    );
  }
}
