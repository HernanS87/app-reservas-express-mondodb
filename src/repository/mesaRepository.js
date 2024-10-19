import { Mesa } from "../model/mesa.js";

export class MesaRepository {
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
}

// todos estos métodos de mongoose devuelven promesas, por eso uso el return para que el service se encargue de manejarla como prefiera
