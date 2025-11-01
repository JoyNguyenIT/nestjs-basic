import { IsNotEmpty, IsString } from "class-validator";

export class CreatePermissionDto {
    @IsNotEmpty()
    @IsString({ message: "name is a string" })
    name: string;

    @IsNotEmpty()
    @IsString({ message: "apiPath is a string" })
    apiPath: string;

    @IsNotEmpty()
    @IsString({ message: "method is a string" })
    method: string;

    @IsNotEmpty()
    @IsString({ message: "module is a string" })
    module: string;

}