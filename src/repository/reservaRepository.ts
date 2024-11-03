import { HydratedDocument } from "mongoose";
import { Reserva, ReservaType } from "../model/reserva";

export class ReservaRepository  {
  
  getAll(): Promise<HydratedDocument<ReservaType>[]> {
    return Reserva.find().exec();
    // return Reserva.find().populate("mesa"); // Esto reemplaza el ObjectId por el objeto completo de la colección "Mesa"
  }

  getById(id: string): Promise<HydratedDocument<ReservaType> | null> {
    return Reserva.findById(id).exec(); 
  }

  save(reservaDto: ReservaType): Promise<HydratedDocument<ReservaType>> {
    const newReserva = new Reserva(reservaDto);
    return newReserva.save();
  }

  delete(id: string): Promise<HydratedDocument<ReservaType> | null> {
    return Reserva.findByIdAndDelete(id).exec();
  }

  update(id: string, updateData: Partial<ReservaType>): Promise<HydratedDocument<ReservaType> | null> {
    return Reserva.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }
  
}


// ------------ ¿Por qué usamos HydratedDocument? -------------
// Utilizamos `HydratedDocument<ReservaType>` como tipo de retorno para representar instancias completas de documentos Mongoose.
// `HydratedDocument` es un tipo proporcionado por Mongoose que extiende `ReservaType` y añade propiedades y métodos
// específicos de Mongoose, como `save`, `populate`, y `_id`, permitiendo que los documentos tengan funcionalidades
// adicionales para la manipulación de datos en la base de datos. Esto es útil cuando necesitamos acceder a estos
// métodos en capas superiores, manteniendo la estructura y los datos definidos en `ReservaType`.


// ------------ ¿Por qué usamos exec()? -------------
// En Mongoose, métodos como find y update devuelven un Query, que no es una promesa directa.
// Para convertir el Query en una promesa que soporte async/await o .then(), usamos .exec().
