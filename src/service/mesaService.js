import { MesaRepository } from "../repository/mesaRepository.js";

export class MesaService {
  static async getAll() {
    return await MesaRepository.getAll();
  }

  static async getById(id) {
    return await MesaRepository.getById(id);
  }

  static async save(mesa) {
    return await MesaRepository.save(mesa);
  }

  static async delete(id) {
    return await MesaRepository.delete(id);
  }

  static async update() {}
}
