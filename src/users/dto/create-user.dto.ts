import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsObject, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';

class Company {
    @IsNotEmpty()
    _id: Types.ObjectId;

    @IsString()
    @IsNotEmpty()
    name: string;
}

class User {
    @IsNotEmpty()
    _id: Types.ObjectId;

    @IsString()
    @IsNotEmpty()
    email: string;
}

export class RegisterUserDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    age: number;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @MinLength(6, { message: "password must be greater than 6 characters!" })
    @MaxLength(12, { message: "password must be less than 12 characters!" })
    @IsNotEmpty()
    password: string;


    gender: string;
    address: string;
    phone: string;
    isDeleted: boolean;
    deletedAt: Date;

}

export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    age: number;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @MinLength(6, { message: "password must be greater than 6 characters!" })
    @MaxLength(12, { message: "password must be less than 12 characters!" })
    @IsNotEmpty()
    password: string;


    role: string;
    gender: string;
    address: string;
    phone: string;
    isDeleted: boolean;
    deletedAt: Date;

    @IsObject()
    @ValidateNested()
    @Type(() => User)
    createdBy: {
        _id: Types.ObjectId,
        email: string
    };

    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company

    @IsObject()
    @ValidateNested()
    @Type(() => User)
    updatedBy: {
        _id: Types.ObjectId,
        email: string
    };

    @IsObject()
    @ValidateNested()
    @Type(() => User)
    deletedBy: {
        _id: Types.ObjectId,
        email: string
    };
}