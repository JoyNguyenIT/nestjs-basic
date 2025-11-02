
import { IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateRoleDto {

    @IsNotEmpty()
    @IsString({ message: "name is a string" })
    name: string;

    @IsNotEmpty()
    @IsString({ message: "description is a string" })
    description: string;

    @IsNotEmpty()
    @IsBoolean({ message: "isActive is a boolean" })
    isActive: boolean;

    @IsNotEmpty()
    @IsMongoId({ each: true, message: "each permission is a mongoId" })
    @IsArray({ message: "Permissions is an array" })
    permissions: Types.ObjectId[]

}