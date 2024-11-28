import { UserRepository } from "../repository/userRepository";
import { UserModelType } from "../model/entity/user";
import { HydratedDocument, Types } from "mongoose";

const userRepository = new UserRepository();

export class UserService {
  async findByEmailOrUserName(user: UserModelType): Promise<HydratedDocument<UserModelType> | null> {
    return await userRepository.findByEmailOrUserName(user);
  }

  async findByEmail(email: string): Promise<HydratedDocument<UserModelType> | null> {
    return await userRepository.findByEmail(email);
  }

  async findById(id: Types.ObjectId): Promise<HydratedDocument<UserModelType> | null> {
    return userRepository.findById(id);
  }

  async save(user: UserModelType): Promise<HydratedDocument<UserModelType>> {
    return await userRepository.save(user);
  }
}
