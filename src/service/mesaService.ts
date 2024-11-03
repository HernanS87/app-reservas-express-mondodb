import { MesaRepository } from "../repository/mesaRepository";
import { MesaType } from '../model/mesa';
import { HydratedDocument } from "mongoose";

const mesaRepository = new MesaRepository();

export class MesaService {
  async getAll(): Promise<HydratedDocument<MesaType>[]> {
    return await mesaRepository.getAll();
  }

  async getById(id: string): Promise<HydratedDocument<MesaType> | null> {
    return await mesaRepository.getById(id);
  }

  async save(mesa: MesaType): Promise<HydratedDocument<MesaType>> {
    return await mesaRepository.save(mesa);
  }

  async delete(id: string): Promise<HydratedDocument<MesaType> | null> {
    return await mesaRepository.delete(id);
  }

  async update() {}
}
