
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({ timestamps: true })
export class Company {
    @Prop()
    name: string;

    @Prop()
    address: string;

    @Prop()
    description: string

    @Prop()
    logo: string

    @Prop({ type: Types.ObjectId, ref: User.name })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name })
    updatedBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name })
    deletedBy: Types.ObjectId;

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;

}

export const CompanySchema = SchemaFactory.createForClass(Company);