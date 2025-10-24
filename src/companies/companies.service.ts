import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/companies.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>) { }

  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    const { name, address, description, logo } = createCompanyDto
    const company = await this.companyModel.create({
      name, address, description, logo,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      result: company
    }
  }

  async findAll(currentPage: number, limit: number, queryString: string) {
    const { filter, sort } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    const skip = (currentPage - 1) * limit;
    const totalItems = (await this.companyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit)
    const res = await this.companyModel
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
    return this.companyModel.findById({ _id: id });
  }

  async update(updateCompanyDto: UpdateCompanyDto, user: IUser) {
    const { name, address, description, _id } = updateCompanyDto
    return await this.companyModel.updateOne(
      { _id },
      {
        name,
        address,
        description,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      })

  }

  async remove(id: string, user: IUser) {
    try {
      await this.companyModel.updateOne(
        { _id: id },
        {
          deleted: true,
          deletedAt: new Date(),
          deletedBy: {
            _id: user._id,
            email: user.email,
          },
        },
        { timestamps: false }
      );

      return "Deleted Company success!";
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong, deleted company failed");
    }
  }
}
