import { MesaRepository } from "../repository/mesaRepository.js";
import { ReservaRepository } from "../repository/reservaRepository.js";

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
    const mesaIds = newReserva.mesa;

    await mesaRepository.setEstadoOcupada(mesaIds);

    return newReserva;
  }

  async delete(id) {
    return await reservaRepository.delete(id);
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
      return [mesaGrandeCercana._id]; // Si encontramos una mesa grande cercana, la asignamos y terminamos
    }

    // Obtener todas las mesas disponibles
    const mesasDisponibles = await mesaRepository.getMesasDisponibles();

    // 3. Buscar la mesa más pequeña cercana (capacidad < cantidadPersonas, pero la más grande posible)
    const mesaPequeñaCercana = mesasDisponibles
      .filter((mesa) => mesa.capacidad < cantidadPersonas)
      .sort((a, b) => b.capacidad - a.capacidad)[0]; // Ordenar descendente y tomar la más grande

    let mesasAsignadas = [];
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
      for (let mesa of mesasDisponiblesMenorCantPers) {
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

    // Si aún quedan personas y no se pueden acomodar, lanzar error
    if (personasRestantes > 0) {
      throw new Error("No hay suficientes mesas disponibles para esta reserva");
    }

    return mesasAsignadas;
  }
}
