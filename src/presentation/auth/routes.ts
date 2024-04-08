import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService, EmailService } from '../services';
import { envs } from '../../config/envs';





export class AuthRoutes {


  static get routes(): Router {

    const router = Router();

    const emailService = new EmailService(envs.MAILER_SERVICE, envs.MAILER_EMAIL, envs.MAILER_SECRET_KEY);

    const authService = new AuthService(emailService);

    const controller = new AuthController(authService);
    
    // Definir las rutas
    router.post('/login', controller.loginrUser);
    router.post('/register', controller.registerUser);

    router.get('/validate-email/:token', controller.validateEmail);

    return router;
  }


}
