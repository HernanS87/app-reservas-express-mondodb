import { MesaRepository } from "../repository/mesaRepository.js";

const mesaRepository = new MesaRepository();

export class MesaService {
  async getAll() {
    return await mesaRepository.getAll();
  }

  async getById(id) {
    return await mesaRepository.getById(id);
  }

  async save(mesa) {
    return await mesaRepository.save(mesa);
  }

  async delete(id) {
    return await mesaRepository.delete(id);
  }

  async update() {}
}
