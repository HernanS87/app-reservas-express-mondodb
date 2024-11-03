
import { Types, HydratedDocument, UpdateWriteOpResult } from 'mongoose';
import { Mesa, MesaType } from "../model/mesa";

export class MesaRepository {
  // ------------------------- CRUD BÁSICO ----------------------------------

  getAll(): Promise<HydratedDocument<MesaType>[]> {
    return Mesa.find().exec();
  }

  getById(id: string): Promise<HydratedDocument<MesaType> | null> {
    return Mesa.findById(id).exec();
  }

  save(mesaDto: MesaType): Promise<HydratedDocument<MesaType>> {
    const newMesa = new Mesa(mesaDto);
    return newMesa.save();
  }

  delete(id: string): Promise<HydratedDocument<MesaType> | null> {
    return Mesa.findByIdAndDelete(id).exec();
  }

  update(id: string, updateData: Partial<MesaType>): Promise<HydratedDocument<MesaType> | null> {
    return Mesa.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  // ------------------------- OTROS ----------------------------------

  getMesasDisponibles(): Promise<HydratedDocument<MesaType>[]> {
    return Mesa.find({ estado: "DISPONIBLE" }).sort({ capacidad: 1 }).exec();
  }

  getMesaDisponiblePorCapacidad(capacidad: number): Promise<HydratedDocument<MesaType> | null>  {
    return Mesa.findOne({ capacidad, estado: "DISPONIBLE" }).exec();
  }

  // Busca la mesa más grande y cercana al valor requerido
  getMesaDisponiblePorCapacidadMayorMasCercana(capacidad: number): Promise<HydratedDocument<MesaType> | null>  {
    return Mesa.findOne({
      capacidad: { $gte: capacidad, $lte: capacidad + 2 },
      estado: "DISPONIBLE",
    }).sort({ capacidad: 1 }).exec();
  }

  cambiarEstadoMesa(mesaIds: Types.ObjectId[], estado: string): Promise<UpdateWriteOpResult> {
    return Mesa.updateMany(
      { _id: { $in: mesaIds } }, // Filtrar mesas por ID
      { $set: { estado } } // Cambiar el estado
    ).exec();
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


// ------------ ¿Por qué usamos Promise<UpdateWriteOpResult>? -------------
// Utilizamos `Promise<UpdateWriteOpResult>` para obtener detalles como `matchedCount` y 
// `modifiedCount`, que indican la cantidad de documentos encontrados y modificados, respectivamente. 
// Esto permite que las capas superiores (como el servicio o controlador) validen si la operación 
// realmente afectó algún documento, lo que puede ser útil para verificar que las mesas fueron 
// encontradas y actualizadas correctamente. Si no es necesario, este tipo de retorno podría 
// simplificarse a `void`.