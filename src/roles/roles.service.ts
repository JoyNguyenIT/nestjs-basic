import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { emit } from 'process';
import aqp from 'api-query-params';
import { find } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private RoleModel: SoftDeleteModel<RoleDocument>,
    private configService: ConfigService,
  ) { }

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const isExist = await this.RoleModel.findOne({ name: createRoleDto.name })
    if (isExist) {
      throw new BadRequestException({ message: "Role name existed" })
    }
    else {
      const res = await this.RoleModel.create({
        ...createRoleDto,
        createdBy: {
          _id: user._id,
          email: user.email
        }
      })
      return {
        _id: res._id,
        createdAt: res.createdAt
      }
    }
  }

  async findAll(currentPage: number, limit: number, queryString: string) {
    const { filter, sort } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    const skip = (currentPage - 1) * limit;
    const totalItems = (await this.RoleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit)
    const res = await this.RoleModel
      .find(filter)
      .sort(sort as any)
      .skip(skip)
      .limit(limit)
      .populate({ path: "permissions", select: { _id: 1, apiPath: 1, name: 1, method: 1 } })
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
    return await this.RoleModel.findOne({ _id: id })
      .populate({ path: "permissions", select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 } });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    // const isExist = await this.RoleModel.findOne({
    //   name: updateRoleDto.name
    // })
    // if (isExist) {
    //   throw new BadRequestException({ message: "Role name existed" })
    // }
    return this.RoleModel.updateOne({
      _id: id
    }, {
      ...updateRoleDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  async remove(id: string, user: IUser) {
    const adminId = this.configService.get<string>('ROLE_ADMIN_ID');
    if (id === adminId) {
      throw new BadRequestException("Can't delete role ADMIN");
    }
    const updateStep = await this.RoleModel.updateOne({
      _id: id
    },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })
    if (updateStep)
      return this.RoleModel.softDelete({ _id: id });
  }
}
