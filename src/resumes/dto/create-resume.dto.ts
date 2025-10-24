import { Type } from "class-transformer";
import { IsArray, IsEmail, IsMongoId, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Types } from "mongoose";

export class UpdatedByDto {
    @IsMongoId({ message: '_id must be a valid MongoId' })
    _id: string;

    @IsString()
    @IsNotEmpty()
    email: string;
}

export class HistoryDto {
    @IsString()
    @IsNotEmpty({ message: 'Status is required' })
    status: string;

    @Type(() => Date)
    updatedAt?: Date; // optional vì backend có thể tự gán new Date()

    @ValidateNested()
    @Type(() => UpdatedByDto)
    updatedBy: UpdatedByDto;
}

export class CreateResumeDto {
    @IsNotEmpty()
    @IsString({ message: "url is a string" })
    url: string;

    @IsNotEmpty()
    @IsString({ message: "status is a string" })
    status: string;

    @IsNotEmpty()
    @IsMongoId()
    companyId: Types.ObjectId;

    @IsNotEmpty()
    @IsMongoId()
    jobId: Types.ObjectId;


}
