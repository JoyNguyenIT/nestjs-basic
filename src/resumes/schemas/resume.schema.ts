
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Company } from 'src/companies/schemas/companies.schema';
import { Job } from 'src/jobs/schemas/jobs.schema';
import { User } from 'src/users/schemas/user.schema';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema({ timestamps: true })
export class Resume {
    @Prop()
    email: string;

    @Prop({ type: Types.ObjectId, ref: User.name })
    userId: Types.ObjectId;

    @Prop()
    url: string;

    @Prop()
    status: string;

    @Prop({ type: Types.ObjectId, ref: Company.name })
    companyId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Job.name })
    job: Types.ObjectId;

    @Prop({ type: Types.Array })
    history: {
        status: string;
        updatedAt: Date;
        updatedBy: {
            _id: Types.ObjectId;
            email: string;
        };
    }[];

    @Prop()
    isDeleted: boolean;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    deletedAt: Date;

    @Prop({ type: Types.ObjectId, ref: User.name })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name })
    updatedBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name })
    deletedBy: Types.ObjectId;



}

export const ResumeSchema = SchemaFactory.createForClass(Resume);

