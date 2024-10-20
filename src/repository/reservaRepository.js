import { Reserva } from "../model/reserva.js";

export class ReservaRepository {
  getAll() {
    return Reserva.find();
    // return Reserva.find().populate("mesa"); // Esto reemplaza el ObjectId por el objeto completo de la colección "Mesa"
  }

  getById(id) {
    return Reserva.findById(id);
  }

  save(reserva) {
    return reserva.save();
  }

  delete(id) {
    return Reserva.findByIdAndDelete(id);
  }

  update() {}
}

// todos estos métodos de mongoose devuelven promesas, por eso uso el return para que el service se encargue de manejarla como prefiera
