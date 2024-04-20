import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntuty } from "../../domain";



export class AuthMiddleware {

    static async validateJWT(req: Request, res: Response, next:NextFunction){

        const authorization = req.header('Authorization');
        if( !authorization ) return res.status(401).json({ error: 'no token provided' });
        if( !authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'invalid bearer token' });

        const token = authorization.split(' ').at(1) || '';

        try {

            const payload = await JwtAdapter.validateToken<{ id: string}>(token);
            if( !payload ) return res.status(401).json({ error: 'Invalid token' });

            const user = await UserModel.findById( payload.id );
            if( !user ) return res.status(401).json({ error: 'invalid token - user' });

            // TODO validate if user is active

            req.body.user = UserEntuty.fromObject( user );
            next();
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'internal server error' });
        }
    }
}