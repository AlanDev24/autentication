import { CustomError } from "../errors/custom.error";

export class UserEntuty {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public emailValidated: boolean,
    public password: string,
    public role: string,
    public img?: string
  ) {}

  static fromObject(obj: { [key: string]: any }) {
    const { id, _id, name, email, emailValidated, password, role, img } = obj;

    if (!_id && id) {
      throw CustomError.badrequest("missing id");
    }
    if (!name) {
      throw CustomError.badrequest("missing name");
    }
    if (!email) {
      throw CustomError.badrequest("missing email");
    }
    if (emailValidated === undefined ) {
      throw CustomError.badrequest("missing emailValidated");
    }
    if (!role ) {
      throw CustomError.badrequest("missing role");
    }

    return new UserEntuty(_id || id, name, email, emailValidated, password, role, img)
  }
}
