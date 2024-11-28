import { IAuthTokenPayload } from "../src/main/model/interface/authInterface";

declare global {
  namespace Express {
    interface Request {
      user?: IAuthTokenPayload;
    }
  }
}
