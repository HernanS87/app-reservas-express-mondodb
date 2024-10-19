import { Reserva } from "../model/reserva.js";

export class ReservaRepository {
  static getAll() {
    return Reserva.find();
    // return Reserva.find().populate("mesa"); // Esto reemplaza el ObjectId por el objeto completo de la colección "Mesa"
  }

  static getById(id) {
    return Reserva.findById(id);
  }

  static save(reserva) {
    return reserva.save();
  }

  static delete(id) {
    return Reserva.findByIdAndDelete(id);
  }

  static update() {}
}

// todos estos métodos de mongoose devuelven promesas, por eso uso el return para que el service se encargue de manejarla como prefiera
