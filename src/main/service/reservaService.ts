import { HydratedDocument, Types } from "mongoose";
import { ReservaModelType } from "../model/entity/reserva";
import { ReservaRepository } from "../repository/reservaRepository";
import { MesaService } from "./mesaService";
import { RespAltaReservaDto } from "../model/interface/reservaInterface";
import { TipoError } from "../enum/tipoErrorEnum";
import { IMensajeError, MensajeErrorDto } from "../model/interface/mensajeErrorInterface";
import { UserService } from "./userService";
import { EmailService } from "./emailService";

const reservaRepository = new ReservaRepository();
const mesaService = new MesaService();
const userService = new UserService();
const emailService = new EmailService();

export class ReservaService {
  // ------------------------- CRUD ----------------------------------

  async getAll(): Promise<HydratedDocument<ReservaModelType>[]> {
    return await reservaRepository.getAll();
  }

  async getById(id: Types.ObjectId): Promise<HydratedDocument<ReservaModelType> | null> {
    return await reservaRepository.getById(id);
  }

  async save(reserva: ReservaModelType): Promise<RespAltaReservaDto> {
    const respuesta = new RespAltaReservaDto();
    const mensajesError: IMensajeError[] = [];
    try {
      const user = await userService.findById(reserva.user);

      if (!user) {
        throw new Error("Usuario no identificado");
      }

      const mesas = await this.obtenerMesasDisponiblesPorFechaTurnoHorarioYCantPersonas(
        reserva.fecha,
        reserva.turno,
        reserva.hora,
        reserva.cantidadPersonas
      );

      if (mesas.length == 0) {
        mensajesError.push(new MensajeErrorDto(TipoError.ERROR, "No hay suficientes mesas disponibles para esta reserva"));
        respuesta.mensajes = mensajesError;
        return respuesta;
      }

      reserva.user = user._id;
      reserva.mesa = mesas;
      reserva.estado = "CONFIRMADA";
      const newReserva = await reservaRepository.save(reserva);

      respuesta.id = newReserva._id;

      emailService.enviarCorreoConfirmacion(newReserva, user);

      return respuesta;
    } catch (error: any) {
      console.error("❌ Error interno al procesar la reserva:", error.message);
      throw error; // Propaga al controlador
    }
  }

  async delete(id: Types.ObjectId): Promise<HydratedDocument<ReservaModelType> | null> {
    const reservaDeleted = await reservaRepository.delete(id);

    // if (reservaDeleted) {
    //   console.log("RESERVA ELIMINADA", reservaDeleted);
    //   await mesaRepository.cambiarEstadoMesa(reservaDeleted.mesa, "DISPONIBLE");
    // }

    return reservaDeleted;
  }

  async update() {}

  // ------------------------- OTROS ----------------------------------

  async getReservasByPeriodoAndTurno(fechaInicio: Date, fechaFin: Date, turno: string): Promise<HydratedDocument<ReservaModelType>[]> {
    return reservaRepository.getReservasByPeriodoAndTurno(fechaInicio, fechaFin, turno);
  }

  async getReservasByFechaAndTurno(fecha: Date, turno: string): Promise<HydratedDocument<ReservaModelType>[]> {
    return reservaRepository.getReservasByFechaAndTurno(fecha, turno);
  }

  private async obtenerMesasDisponiblesPorFechaTurnoHorarioYCantPersonas(
    fecha: Date,
    turno: string,
    horario: string,
    personas: number
  ): Promise<Types.ObjectId[]> {
    const reservasXFechaYTurno = await this.getReservasByFechaAndTurno(fecha, turno);

    const horariosMesasOcupadasId = mesaService.buscarMesasOcupadasPorTurnoYHorarioEnListaReservas(turno, reservasXFechaYTurno);

    const mesasNoDisponiblesIdPorHorarioSeleccionado = horariosMesasOcupadasId.find((elem) => elem.hora === horario)?.mesasOcupadasId || [];

    return await mesaService.buscarMesasDisponiblesPorCantPersonasParaReserva(personas, mesasNoDisponiblesIdPorHorarioSeleccionado);
  }
}
