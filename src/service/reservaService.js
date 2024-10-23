import { MesaRepository } from "../repository/mesaRepository.js";
import { ReservaRepository } from "../repository/reservaRepository.js";
import { enviarCorreoConfirmacion } from "./emailService.js";

const reservaRepository = new ReservaRepository();
const mesaRepository = new MesaRepository();

export class ReservaService {
  // ------------------------- CRUD ----------------------------------

  async getAll() {
    return await reservaRepository.getAll();
  }

  async getById(id) {
    return await reservaRepository.getById(id);
  }

  async save(reserva) {
    reserva.mesa = await this.asignarMesas(reserva.cantidadPersonas);

    const newReserva = await reservaRepository.save(reserva);

    // Cambiar el estado de las mesas a 'Ocupado'
    await mesaRepository.cambiarEstadoMesa(newReserva.mesa, "OCUPADA");

    enviarCorreoConfirmacion(newReserva); // Eliminamos el await para que no tengamos que esperar a que se haga el envio para responderle al usuario

    return newReserva;
  }

  async delete(id) {
    const reservaDeleted = await reservaRepository.delete(id);

    if (reservaDeleted) {
      console.log("RESERVA ELIMINADA", reservaDeleted);
      await mesaRepository.cambiarEstadoMesa(reservaDeleted.mesa, "DISPONIBLE");
    }

    return reservaDeleted;
  }

  async update() {}

  // ------------------------- OTROS ----------------------------------

  async asignarMesas(cantidadPersonas) {
    // 1. Buscar si hay una mesa con capacidad exacta
    const mesaExacta = await mesaRepository.getMesaDisponiblePorCapacidad(
      cantidadPersonas
    );

    if (mesaExacta) {
      return [mesaExacta._id];
    }

    // 2. Busca la mesa más grande y cercana a la cantidad de personas
    const mesaGrandeCercana =
      await mesaRepository.getMesaDisponiblePorCapacidadMayorMasCercana(
        cantidadPersonas
      );

    if (mesaGrandeCercana) {
      return [mesaGrandeCercana._id];
    }

    const { personasRestantes, mesasAsignadas } =
      await this.asignarMesasConMenorCapacidad(cantidadPersonas);

    // Si aún quedan personas y no se pueden acomodar, tirar error
    if (personasRestantes > 0) {
      throw new Error("No hay suficientes mesas disponibles para esta reserva");
    }

    return mesasAsignadas;
  }

  async asignarMesasConMenorCapacidad(cantidadPersonas) {
    const mesasDisponibles = await mesaRepository.getMesasDisponibles();

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
