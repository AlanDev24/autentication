import { Request, Response } from "express"
import { CreateCategoryDTO, CustomError, PaginationDTO } from "../../domain"
import { CategoryService } from '../services/category.service';


export class CategoryController {

    constructor(
        private readonly categoryService: CategoryService
    ){}

    private handleError = (error: unknown, res: Response)=>{
        if( error instanceof CustomError ){
               return res.status(error.statusCode).json({error: error.message})
        }

        return res.status(500).json({error: 'Internal Server Error'})
    }

    createCategory = async (req: Request, res: Response)=>{
        const [error, createCategoryDTO] =  CreateCategoryDTO.create( req.body )

        if( error ) return res.status(400).json({ error })
        this.categoryService.createCategory( createCategoryDTO!, req.body.user )
            .then( category=> res.status(200).json( category ))
            .catch(error => this.handleError( error, res))
    }

    getCategories = async (req: Request, res: Response)=>{

        const { page = 1, limit = 10 } = req.query;
        
        const [ error, paginationDTO] = PaginationDTO.create( +page, +limit );
        if (error) return res.status(404).json({ error });
        
        this.categoryService.getCategories( paginationDTO! )
            .then( categories => res.json( categories))
            .catch(error => this.handleError( error, res))
    }
}

