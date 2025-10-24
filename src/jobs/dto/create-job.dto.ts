import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsObject, IsString, ValidateNested } from "class-validator";
import { Types } from "mongoose";

class Company {
    @IsNotEmpty()
    _id: Types.ObjectId;

    @IsString()
    @IsNotEmpty()
    name: string;
}

export class CreateJobDto {
    @IsNotEmpty()
    @IsString({ message: "name is a string" })
    name: string;

    @IsArray({ message: "Skills is a array" })
    @ArrayNotEmpty()
    @IsString({ each: true, message: "Skills is a string" })
    skills: string[];






    location: string;
    salary: number;
    quantity: number;
    level: string;
    description: string;
    isActive: boolean;
    isDeleted: boolean;
    deletedAt: Date;

    startDate: Date
    endDate: Date
    logo: string
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company



}
