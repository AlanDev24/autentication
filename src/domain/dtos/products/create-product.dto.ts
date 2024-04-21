import { Validators } from "../../../config";

export class CreateProductDTO {
  private constructor(
    public readonly name: string,
    public readonly available: boolean,
    public readonly price: number,
    public readonly user: string,
    public readonly category: string
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateProductDTO?] {
    const { name, available, price, user, category } = object;

    if (!name) return ["Missing name"];
    if (!user) return ["Missing user"];
    if (!Validators.isMongoID(user)) return [" Invalid User ID"];
    if (!category) return ["Missing category"];
    if (!Validators.isMongoID(category)) return [" Invalid category ID"];

    return [
      undefined,
      new CreateProductDTO(name, !!available, price, user, category),
    ];
  }
}
