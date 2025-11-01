
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { Role } from 'src/roles/schemas/role.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop()
    name: string;

    @Prop()
    age: number;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    phone: string;

    @Prop()
    gender: string;

    @Prop({ type: Types.ObjectId, ref: Role.name })
    role: Types.ObjectId

    @Prop()
    refresh_token: string;

    @Prop()
    address: string;

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;

    @Prop({ type: Object })
    createdBy: {
        _id: Types.ObjectId,
        email: string
    };

    @Prop({ type: Object })
    company: {
        _id: Types.ObjectId,
        name: string
    };

    @Prop({ type: Object })
    updatedBy: {
        _id: Types.ObjectId,
        email: string
    };

    @Prop({ type: Object })
    deletedBy: {
        _id: Types.ObjectId,
        email: string
    };

    createdAt: Date

}

export const UserSchema = SchemaFactory.createForClass(User);

