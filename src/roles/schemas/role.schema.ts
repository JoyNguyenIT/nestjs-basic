
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schema';
import { User } from 'src/users/schemas/user.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    isActive: boolean;

    @Prop({ type: [Types.ObjectId], ref: Permission.name })
    permissions: Permission;

    @Prop()
    isDeleted: boolean;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    deletedAt: Date;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    createdBy: Types.ObjectId | User;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    updatedBy: Types.ObjectId | User;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    deletedBy: Types.ObjectId | User;



}

export const RoleSchema = SchemaFactory.createForClass(Role);

