
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type JobDocument = HydratedDocument<Job>;

@Schema({ timestamps: true })
export class Job {
    @Prop()
    name: string;

    @Prop()
    skills: string[];

    @Prop()
    location: string;

    @Prop()
    salary: number;

    @Prop()
    quantity: number;

    @Prop()
    level: string;

    @Prop()
    description: string;

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;

    @Prop({ type: Types.ObjectId, ref: User.name })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name })
    updatedBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name })
    deletedBy: Types.ObjectId;

    @Prop({ type: Object })
    company: {
        _id: Types.ObjectId,
        name: string,
        job: string
    };

    @Prop()
    logo?: string

    startDate: Date;
    endDate: Date;
    @Prop()
    isActive: boolean

}

export const JobSchema = SchemaFactory.createForClass(Job);

