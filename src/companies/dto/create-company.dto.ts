import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    address: string

    @IsNotEmpty()
    logo: string

}