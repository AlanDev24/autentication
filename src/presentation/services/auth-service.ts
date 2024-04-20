
import { UserModel } from "../../data";
import { CustomError, LoginUserDTO, RegisterUserDTO } from "../../domain";
import { UserEntuty } from '../../domain/entities/user.entity';
import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { EmailService } from "./email.service";



export class AuthService {


    constructor(
        private readonly emailService: EmailService
    ){}


    public async registerUser (registerUserDto: RegisterUserDTO) {

        const existUser = await UserModel.findOne({email: registerUserDto.email});
        if(existUser) throw CustomError.badrequest('Email alredy exist');

        try {
            const user = new UserModel(registerUserDto);
            
            //! encriptar la contraseña
            user.password = bcryptAdapter.hash(registerUserDto.password)
            await user.save();
            //! JWT para mantener la autenticacion del usuario

            //! Email de confirmacion
            await this.sendEmailValidationLink( user.email );
            const {password, ...userEntity} = UserEntuty.fromObject(user);

            const token = await JwtAdapter.generateToken({id: user.id})
             if(!token) throw CustomError.internalservererror('Error while creating JWWT')

            return {
                user: userEntity,
                token: token
            };
        } catch (error) {
            throw CustomError.internalservererror(`${error}`)

        }


    }

    public async loginUser (loginUserDto: LoginUserDTO) {

        const user = await UserModel.findOne({email: loginUserDto.email});
        if(!user) throw CustomError.notfound('User not found');

        //? findone para verificar si existe
        try {
        
        //?  isMatch  bcrypt.compare
        const isValid = bcryptAdapter.compare(loginUserDto.password  , user.password  );

        //? regresar usuario
        const {password, ...userEntity} = UserEntuty.fromObject(user)

        const token = await JwtAdapter.generateToken({id: user.id})
        if(!token) throw CustomError.internalservererror('Error while creating JWWT')
        
        if(isValid){
            return {
                user: userEntity,
                token: token
            }
        } else {
            throw CustomError.unauthorizzed('Not valid information')
        }
        } catch (error) {
            throw CustomError.internalservererror(`${error}`)
        }
    }

    private sendEmailValidationLink = async ( email: string) => {
        const token = await JwtAdapter.generateToken( {email })
        if( !token ) throw CustomError.internalservererror('Error generating token');

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

        const html = `
        <h1>Validate your email</h1>
        <p>Click on the following link to validate your email</p>
        <a href="${link}">Validate your email</a>
        `;

        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html
        }

        const isSent = await this.emailService.sendEmail(options);
        if( !isSent ) throw CustomError.internalservererror('Error sending email');

        return true;
    }

    public validateEmail = async (token: string)=>{
        const payload = await JwtAdapter.validateToken(token);
        if( !payload ) throw CustomError.unauthorizzed('Invalid token');

        const { email } = payload as { email:string }

        if( !email ) throw CustomError.internalservererror('Email not in token');

        const user = await UserModel.findOne({ email });

        if( !user ) throw CustomError.internalservererror('Emal not found');

        user.emailValidated = true;

        user.save();
    }
}