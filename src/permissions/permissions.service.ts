import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { error } from 'console';
import aqp from 'api-query-params';
import { use } from 'passport';

@Injectable()
export class PermissionsService {
  constructor(@InjectModel(Permission.name) private PermissionModel: SoftDeleteModel<PermissionDocument>) { }
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const isExist = await this.PermissionModel.findOne({
      apiPath: createPermissionDto.apiPath,
      method: createPermissionDto.method
    })
    if (isExist) {
      throw new BadRequestException({ message: "Permission is existed!" })
    }
    else {
      const res = await this.PermissionModel.create({
        ...createPermissionDto,
        createdBy: {
          _id: user._id,
          email: user.email
        }
      })
      return {
        _id: res?._id,
        createAt: res?.createdAt
      };
    }

  }

  async findAll(currentPage: number, limit: number, queryString: string) {
    const { filter, sort } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    const skip = (currentPage - 1) * limit;
    const totalItems = (await this.PermissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit)
    const res = await this.PermissionModel
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
  findOne(id: string) {
    return this.PermissionModel.findOne({
      _id: id
    });
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {


    return this.PermissionModel.updateOne({
      _id: id
    },
      {
        ...updatePermissionDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      });


  }

  async remove(id: string, user: IUser) {
    const updateData = await this.PermissionModel.updateOne({
      _id: id
    },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    if (!updateData) {
      throw new BadRequestException({ message: "Failed when delete permission, wrong id" })
    }
    return this.PermissionModel.softDelete({ _id: id });
  }
}
