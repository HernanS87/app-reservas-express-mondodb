import { Types } from "mongoose";

export interface IPayloadTokenLogin {
  id: Types.ObjectId;
  loginToken: string;
}
