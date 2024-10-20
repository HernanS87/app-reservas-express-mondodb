import { Mesa } from "../model/mesa.js";

export class MesaRepository {
  // ------------------------- CRUD BÁSICO ----------------------------------

  static getAll() {
    return Mesa.find();
  }

  static getById(id) {
    return Mesa.findById(id);
  }

  static save(mesa) {
    return mesa.save();
  }

  static delete(id) {
    return Mesa.findByIdAndDelete(id);
  }

  static update() {}

  // ------------------------- OTROS ----------------------------------

  static getMesasDisponibles() {
    return Mesa.find({ estado: "DISPONIBLE" }).sort({ capacidad: 1 });
  }

  static getMesaDisponiblePorCapacidad(capacidad) {
    return Mesa.findOne({ capacidad: capacidad, estado: "DISPONIBLE" });
  }

  //Busca la mesa más grande y cercana al valor requerido
  static getMesaDisponiblePorCapacidadMayorMasCercana(capacidad) {
    return Mesa.findOne({
      capacidad: { $gte: capacidad, $lte: capacidad + 2 },
      estado: "DISPONIBLE",
    }).sort({ capacidad: 1 });
  }

  static setEstadoOcupada(mesaIds) {
    return Mesa.updateMany(
      { _id: { $in: mesaIds } }, // Filtrar mesas por ID
      { $set: { estado: "OCUPADA" } } // Cambiar el estado
    );
  }
}

// todos estos métodos de mongoose devuelven promesas, por eso uso el return para que el service se encargue de manejarla como prefiera
