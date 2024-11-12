import { MesaRepository } from "../repository/mesaRepository";
import { MesaModelType } from '../model/entity/mesa';
import { HydratedDocument } from "mongoose";

const mesaRepository = new MesaRepository();

export class MesaService {
  async getAll(): Promise<HydratedDocument<MesaModelType>[]> {
    return await mesaRepository.getAll();
  }

  async getById(id: string): Promise<HydratedDocument<MesaModelType> | null> {
    return await mesaRepository.getById(id);
  }

  async save(mesa: MesaModelType): Promise<HydratedDocument<MesaModelType>> {
    return await mesaRepository.save(mesa);
  }

  async delete(id: string): Promise<HydratedDocument<MesaModelType> | null> {
    return await mesaRepository.delete(id);
  }

  async update() {}
}
