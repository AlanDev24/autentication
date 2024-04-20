import { CategoryModel } from "../../data";
import {
  CreateCategoryDTO,
  CustomError,
  PaginationDTO,
  UserEntuty,
} from "../../domain";

export class CategoryService {
  constructor() {}

  async createCategory(createCategoryDto: CreateCategoryDTO, user: UserEntuty) {
    const categotyExist = await CategoryModel.findOne({
      name: createCategoryDto.name,
    });

    if (categotyExist) return CustomError.badrequest("Category already exists");

    try {
      const category = new CategoryModel({
        ...createCategoryDto,
        user: user.id,
      });

      await category.save();

      return {
        id: category.id,
        name: category.name,
        available: category.available,
      };
    } catch (error) {
      throw CustomError.internalservererror(`Internal server error`);
    }
  }

  async getCategories(paginationDTO: PaginationDTO) {
    const { page, limit } = paginationDTO;

    try {


    const [ total , categories ] = await Promise.all([
        CategoryModel.countDocuments(),
        CategoryModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
    ])

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/categories?page=${ (page + 1)}&limit=${ limit }`,
        prev: (page -1 > 0) ?`/api/categories?page=${ (page - 1)}&limit=${ limit }`: null,

        categories: categories.map((category) => ({
          id: category.id,
          name: category.name,
          available: category.available,
        })),
      };
    } catch (error) {
      throw CustomError.internalservererror(`Internal server error`);
    }
  }
}
