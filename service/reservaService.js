import { ReservaRepository } from "../repository/reservaRepository.js";

export class ReservaService {
  static async getAll() {
    return await ReservaRepository.getAll();
  }

  static async getById(id) {
    return await ReservaRepository.getById(id);
  }

  static async save(reserva) {
    return await ReservaRepository.save(reserva);
  }

  static async delete(id) {
    return await ReservaRepository.delete(id);
  }

  static async update() {}
}
