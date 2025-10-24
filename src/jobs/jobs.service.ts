import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>) { }

  async create(createJobDto: CreateJobDto, user: IUser) {
    const job = await this.jobModel.create({
      ...createJobDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return { job };
  }

  async findAll(currentPage: number, limit: number, queryString: string) {
    const { filter, sort } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    const skip = (currentPage - 1) * limit;
    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit)
    const res = await this.jobModel
      .find(filter)
      .sort(sort as any)
      .skip(skip)
      .limit(limit)
      .exec()
    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        totalPages,
        totalItems
      },
      result: res
    }
  }

  findOne(_id: string) {
    return this.jobModel.findById({ _id });
  }

  async update(_id: string, updateJobDto: UpdateJobDto) {

    return await this.jobModel.updateOne({ _id },
      {
        ...updateJobDto
      }
    );
  }

  async remove(_id: string, user: IUser) {
    const checkJob = await this.jobModel.findById({ _id })
    if (checkJob?.isDeleted) {
      return "Deleted 0 job"
    }
    else {
      await this.jobModel.updateOne({ _id }, {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })
      return this.jobModel.softDelete({ _id })
    }

  }
}
