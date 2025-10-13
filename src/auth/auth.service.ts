import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser, IUserCreate } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import * as bcrypt from "bcryptjs";
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as ms from 'ms';



@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>

    ) { }

    hashPassword = (password: string) => {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        return hash
    }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(username);
        if (user) {
            const isValid = await this.usersService.isValidPassword(pass, user.password)
            if (isValid) return user
            else throw new UnauthorizedException("Username/Password is not valid!")
        }
        else throw new UnauthorizedException("Username/Password is not valid!")
    }

    createRefreshToken = (payload) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRE")
        })
        return refresh_token
    }

    updateRefreshToken = async (refresh_token: string, id: string) => {
        await this.userModel.updateOne({ _id: id }, {
            refresh_token
        })
    }

    processNewToken = async (refresh_token: string, res: Response) => {
        try {
            await this.jwtService.verify(refresh_token, {
                secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET')
            })
            const user = await this.usersService.findUserByToken(refresh_token);
            if (user) {
                const { _id, email, name, role } = user
                const payload = {
                    sub: "Token login",
                    iss: "from sever",
                    _id, email, name, role
                };
                const refresh_token = this.createRefreshToken(payload)
                await this.updateRefreshToken(refresh_token, _id.toString());

                //set refresh_token cookies
                res.clearCookie("refresh_token")
                res.cookie('refresh_token', refresh_token, {
                    httpOnly: true,          // 🔒 không cho JS truy cập (chống XSS)
                    secure: false,           // ✅ để false khi dev, true nếu deploy HTTPS
                    sameSite: 'strict',      // 🔒 ngăn CSRF cơ bản
                    maxAge: +ms(this.configService.get('JWT_REFRESH_EXPIRE')),
                })
                await this.userModel.updateOne({ _id }, {
                    refresh_token
                })
                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        _id, name, email, role
                    }
                };
            }

        } catch (error) {
            throw new BadRequestException(error)
        }
    }

    async login(user: IUser, res: Response) {
        const { _id, email, name, role } = user
        const payload = {
            sub: "Token login",
            iss: "from sever",
            _id, email, name, role
        };
        const refresh_token = this.createRefreshToken(payload)
        await this.updateRefreshToken(refresh_token, _id);
        //set refresh_token cookies
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,          // 🔒 không cho JS truy cập (chống XSS)
            secure: false,           // ✅ để false khi dev, true nếu deploy HTTPS
            sameSite: 'strict',      // 🔒 ngăn CSRF cơ bản
            maxAge: +ms(this.configService.get('JWT_REFRESH_EXPIRE')),
        })
        await this.userModel.updateOne({ _id }, {
            refresh_token
        })
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id, name, email, role
            }
        };
    }

    logout = async (user: IUser, res: Response) => {
        try {
            const { _id } = user
            //set refresh_token cookies
            res.clearCookie("refresh_token")
            await this.userModel.updateOne({ _id }, {
                refresh_token: null
            })
            return "OK";
        } catch (error) {
            throw new BadRequestException(error)
        }
    }

    async register(user: RegisterUserDto) {
        const { email, password } = user;
        const isExistEmail = await this.userModel.findOne({ email });
        if (isExistEmail) {
            throw new BadRequestException(`Email :${email} was used. Please enter different email.`)
        }
        const hashedPassword = this.hashPassword(password)
        const res = await this.userModel.create({
            ...user,
            password: hashedPassword,
            role: "USER"
        })
        return {

            _id: res?._id,
            createdAt: res?.createdAt

        };
    }

    async create(user: IUserCreate, admin: IUser) {
        //validate
        const isExistEmail = await this.userModel.findOne({
            email: user.email
        })
        if (isExistEmail) {
            throw new UnauthorizedException("Email is exist")
        }
        else {
            const res = await this.userModel.create({
                ...user,
                createdBy: {
                    _id: admin._id,
                    email: admin.email
                }
            })
            return {
                result: {
                    _id: res._id,
                    createdAt: res.createdAt
                }
            };
        }
    }

    async update(user: IUser, admin: IUser) {
        //validate
        // const isExistEmail = await this.userModel.findOne({
        //     email: user.email
        // })
        // if (isExistEmail) {
        //     throw new UnauthorizedException("Email is exist")
        // }
        const res = await this.userModel.updateOne({
            _id: user._id
        }, {
            ...user,
            updatedBy: {
                _id: admin._id,
                email: admin.email
            }
        })
        return {
            result: {
                res
            },

        };
    }

    async delete(_id: string, admin: IUser) {
        const res = await this.userModel.updateOne(
            { _id: _id },
            {
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy: {
                    _id: admin._id,
                    email: admin.email,
                },
            },
            { timestamps: false }
        );

        return {
            result: {
                res
            },

        };
    }
}
