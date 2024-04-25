import { Router } from "express";
import { ImageController } from "./controller";

export class ImagesRoutes {
    static get routes(): Router{

        const controller = new ImageController();
        const router = Router();

        router.get('/:type/:img', controller.getImage)

        return router;
    }
}