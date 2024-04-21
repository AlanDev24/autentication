import { ProductModel } from "../../data";
import { CreateProductDTO, CustomError, PaginationDTO } from "../../domain";

export class ProductService {
  constructor() {}

  async createProduct(createProductDTO: CreateProductDTO) {
    const productExist = await ProductModel.findOne({
      name: createProductDTO.name,
    });

    if (productExist) throw CustomError.badrequest("Product already exists");

    try {
      const product = new ProductModel({
        ...createProductDTO,
      });

      await product.save();

      return product;
    } catch (error) {
      throw CustomError.internalservererror(`${ error }`);
    }
  }

  async getProducts(paginationDTO: PaginationDTO) {
    const { page, limit } = paginationDTO;

    try {
      const [total, products] = await Promise.all([
        ProductModel.countDocuments(),
        ProductModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('user', 'id role')
          .populate('category')
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/products?page=${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0 ? `/api/products?page=${page - 1}&limit=${limit}` : null,

        products: products,
      };
    } catch (error) {
      throw CustomError.internalservererror(`${ error }`);
    }
  }
}
