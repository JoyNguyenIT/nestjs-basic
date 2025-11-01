import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { error } from 'console';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import path from 'path';

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) private resumeModel: SoftDeleteModel<ResumeDocument>) { }
  async create(createResumeDto: CreateResumeDto, user: IUser) {
    const res = await this.resumeModel.create({
      ...createResumeDto,
      email: user.email,
      userId: user._id,
      status: "PENDING",
      history: [{
        status: "PENDING",
        updatedAt: new Date(),
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }],
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    if (res) {
      return {
        _id: res._id,
        createdAt: res.createdAt
      };
    }
    else {
      throw new BadRequestException({ message: error })
    }

  }

  async findAll(currentPage: number, limit: number, queryString: string) {
    const { filter, sort } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    const skip = (currentPage - 1) * limit;
    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit)
    const res = await this.resumeModel
      .find(filter)
      .sort(sort as any)
      .skip(skip)
      .limit(limit)
      .populate([
        { path: "job", select: "_id name" },
        { path: "companyId", select: "_id name logo" }
      ]
      )
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

  async findOne(id: string) {
    return await this.resumeModel.findById({ _id: id });
  }

  async update(id: string, updateResumeDto: UpdateResumeDto, user: IUser) {
    return await this.resumeModel.updateOne({
      _id: id
    },
      {
        status: updateResumeDto.status,
        updatedBy: {
          _id: user._id,
          email: user.email
        },
        $push: {
          history: {
            status: updateResumeDto.status,
            updatedAt: new Date(),
            updatedBy: {
              _id: user._id,
              email: user.email
            }
          }
        }
      }
    );
  }

  async remove(id: string, user: IUser) {

    await this.resumeModel.updateOne({
      _id: id
    },
      {
        $set: {
          deletedBy: {
            _id: user._id,
            email: user.email
          }
        }
      }
    )
    return await this.resumeModel.softDelete({ _id: id });
  }

  async getCV(user: IUser) {
    if (!user || !user._id) {
      throw new Error('Invalid user information');
    }

    return this.resumeModel.find({ userId: user._id })
      .populate([
        { path: "companyId", select: { name: 1 } },
        { path: "job", select: { name: 1 } }
      ])
      .exec();
  }
}
