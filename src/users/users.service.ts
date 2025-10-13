import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from "bcryptjs";
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) { }
  hashPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash
  }
  async create(name: string, email: string, password: string, age: number, phone: string, address: string) {
    const passwordSafe = this.hashPassword(password);
    const user = await this.userModel.create({ name, email, password: passwordSafe, age, phone, address })
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    try {
      return await this.userModel.findById({ _id: id });
    } catch (error) {
      return {
        error: error.message,
        message: "User not found"
      }
    }

  }

  async findOneByEmail(email: string) {
    try {
      return await this.userModel.findOne({ email })
    } catch (error) {
      return null
    }
  }

  async isValidPassword(password: string, hash: string) {

    return bcrypt.compareSync(password, hash);

  }

  async update(updateUserDto: UpdateUserDto) {
    try {
      return await this.userModel.updateOne(
        { _id: updateUserDto._id },
        {
          name: updateUserDto.name,
          email: updateUserDto.email,
          age: updateUserDto.age,
          phone: updateUserDto.phone,
          address: updateUserDto.address
        })

    } catch (error) {
      return {
        errorCode: "401",
        message: error.message
      }
    }

  }

  remove(id: string) {
    try {
      return this.userModel.softDelete({ _id: id });
    } catch (error) {
      return {
        errorCode: "401",
        message: error.message
      }
    }

  }

  findUserByToken = async (refreshToken: string) => {
    try {
      const user = await this.userModel.findOne({ refresh_token: refreshToken }).exec();
      return user
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
