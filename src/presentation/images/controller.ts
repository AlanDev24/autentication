import { Request, Response } from "express";
import fs, { existsSync } from 'fs';
import path from "path";


export class ImageController {
    constructor(){}

    getImage = (req: Request, res: Response) =>{    
        const { type = '', img = '' } = req.params;
        const imagePath = path.resolve(__dirname, `../../../uploads/${type}/${img}`);

        if( !existsSync(imagePath) ){
            res.status(404).send('Not found');
        }

        res.sendFile( imagePath )
    }
}