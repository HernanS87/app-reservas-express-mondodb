import { Mesa } from "../model/mesa.js";

export class MesaRepository {
  // ------------------------- CRUD BÁSICO ----------------------------------

  getAll() {
    return Mesa.find();
  }

  getById(id) {
    return Mesa.findById(id);
  }

  save(mesa) {
    return mesa.save();
  }

  delete(id) {
    return Mesa.findByIdAndDelete(id);
  }

  update() {}

  // ------------------------- OTROS ----------------------------------

  getMesasDisponibles() {
    return Mesa.find({ estado: "DISPONIBLE" }).sort({ capacidad: 1 });
  }

  getMesaDisponiblePorCapacidad(capacidad) {
    return Mesa.findOne({ capacidad: capacidad, estado: "DISPONIBLE" });
  }

  //Busca la mesa más grande y cercana al valor requerido
  getMesaDisponiblePorCapacidadMayorMasCercana(capacidad) {
    return Mesa.findOne({
      capacidad: { $gte: capacidad, $lte: capacidad + 2 },
      estado: "DISPONIBLE",
    }).sort({ capacidad: 1 });
  }

  setEstadoOcupada(mesaIds) {
    return Mesa.updateMany(
      { _id: { $in: mesaIds } }, // Filtrar mesas por ID
      { $set: { estado: "OCUPADA" } } // Cambiar el estado
    );
  }
}

// todos estos métodos de mongoose devuelven promesas, por eso uso el return para que el service se encargue de manejarla como prefiera
