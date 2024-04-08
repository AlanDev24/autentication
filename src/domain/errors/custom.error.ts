

export class CustomError extends Error {

    private constructor(
        public readonly statusCode: number,
        public readonly message: string
    ){
        super(message);
    }

    static badrequest(message: string){
        return new CustomError(400, message);
    }
    static unauthorizzed(message: string){
        return new CustomError(401, message);
    }
    static forbiden(message: string){
        return new CustomError(403, message);
    }
    static notfound(message: string){
        return new CustomError(404, message);
    }
    static internalservererror(message: string){
        return new CustomError(500, message);
    }


}