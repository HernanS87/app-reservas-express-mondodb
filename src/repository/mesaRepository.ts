import { HydratedDocument, Types } from "mongoose";
import { Mesa, MesaModelType } from "../model/entity/mesa";

export class MesaRepository {
  // ------------------------- CRUD BÁSICO ----------------------------------

  getAll(): Promise<HydratedDocument<MesaModelType>[]> {
    return Mesa.find().exec();
  }

  getById(id: Types.ObjectId): Promise<HydratedDocument<MesaModelType> | null> {
    return Mesa.findById(id).exec();
  }

  save(mesaDto: MesaModelType): Promise<HydratedDocument<MesaModelType>> {
    const newMesa = new Mesa(mesaDto);
    return newMesa.save();
  }

  delete(id: string): Promise<HydratedDocument<MesaModelType> | null> {
    return Mesa.findByIdAndDelete(id).exec();
  }

  update(id: string, updateData: Partial<MesaModelType>): Promise<HydratedDocument<MesaModelType> | null> {
    return Mesa.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  // ------------------------- OTROS ----------------------------------

  getMesasDisponibles(mesasNoDisponiblesId: Types.ObjectId[] = []): Promise<HydratedDocument<MesaModelType>[]> {
    return Mesa.find({
      _id: { $nin: mesasNoDisponiblesId },
    })
      .sort({ capacidad: 1 })
      .exec();
  }

  getMesaDisponiblePorCapacidad(
    capacidad: number,
    mesasNoDisponiblesId: Types.ObjectId[] = []
  ): Promise<HydratedDocument<MesaModelType> | null> {
    return Mesa.findOne({
      capacidad,
      _id: { $nin: mesasNoDisponiblesId }, // Excluir mesas con estos IDs
    }).exec();
  }

  // Busca la mesa más grande y cercana al valor requerido
  getMesaDisponiblePorCapacidadMayorMasCercana(
    capacidad: number,
    mesasNoDisponiblesId: Types.ObjectId[] = []
  ): Promise<HydratedDocument<MesaModelType> | null> {
    return Mesa.findOne({
      capacidad: { $gte: capacidad, $lte: capacidad + 2 },
      _id: { $nin: mesasNoDisponiblesId }, // Excluir mesas con estos IDs
    })
      .sort({ capacidad: 1 })
      .exec();
  }
}

// ------------ ¿Por qué usamos HydratedDocument? -------------
// Utilizamos `HydratedDocument<MesaModelType>` como tipo de retorno para representar instancias completas de documentos Mongoose.
// `HydratedDocument` es un tipo proporcionado por Mongoose que extiende `MesaModelType` y añade propiedades y métodos
// específicos de Mongoose, como `save`, `populate`, y `_id`, permitiendo que los documentos tengan funcionalidades
// adicionales para la manipulación de datos en la base de datos. Esto es útil cuando necesitamos acceder a estos
// métodos en capas superiores, manteniendo la estructura y los datos definidos en `MesaModelType`.

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
