import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './schemas/jobs.schema';

@Module({

  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService, MongooseModule],
  imports: [
    MongooseModule.forFeature([
      { name: Job.name, schema: JobSchema },
    ]),
  ],
})
export class JobsModule { }
