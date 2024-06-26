import { regularExps } from "../../../config";

export class LoginUserDTO {

    constructor(
        public readonly email: string,
        public readonly password: string
    ){}

    static create (object: {[key:string]: any}) : [string?, LoginUserDTO?]{

        const {email, password} = object;
        if(!email) return ['Missing email']
        if(!regularExps.email.test(email)) return ['Email is not valid']
        if(!password) return ['Missing password']
        if(password.length < 6) return ['Password to short']

        return [undefined, new LoginUserDTO(email, password)]

    }
}