import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, PermissionDocument } from 'src/permissions/schemas/permission.schema';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './sample';


@Injectable()
export class DatabasesService implements OnModuleInit {
    constructor(
        @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
        @InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>,
        @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
        private configService: ConfigService,
        private userService: UsersService
    ) { }
    async onModuleInit() {
        const isInit = this.configService.get<string>('SHOULD_INIT');
        if (Boolean(isInit)) {
            const countUser = await this.userModel.count({});
            const countRole = await this.roleModel.count({});
            const countPermission = await this.permissionModel.count({});
            if (countPermission === 0) {
                await this.permissionModel.insertMany(INIT_PERMISSIONS);
            }

            if (countRole === 0) {
                const permissions = await this.permissionModel.find({})
                    .select("_id");
                await this.roleModel.insertMany([
                    {
                        name: ADMIN_ROLE,
                        description: "Admin is full permissions",
                        isActive: true,
                        permissions: permissions
                    },
                    {
                        name: USER_ROLE,
                        description: "USER use application",
                        isActive: true,
                        permissions: permissions
                    }
                ]);
            }

            if (countUser === 0) {
                const adminRole: any = await this.roleModel.find({ name: ADMIN_ROLE })
                const userRole: any = await this.roleModel.find({ name: USER_ROLE });
                await this.userModel.insertMany([
                    {
                        name: "I'm Admin",
                        email: "admin@gmail.com",
                        password: this.userService.hashPassword(this.configService.get<string>("INIT_PASSWORD")),
                        age: 20,
                        gender: "MALE",
                        address: "VietNam",
                        role: adminRole?._id
                    },
                    {
                        name: "I'm Kaito",
                        email: "huydt094@gmail.com",
                        password: this.userService.hashPassword(this.configService.get<string>("INIT_PASSWORD")),
                        age: 20,
                        gender: "MALE",
                        address: "VietNam",
                        role: adminRole?._id
                    },
                    {
                        name: "I'm Normal User",
                        email: "user@gmail.com",
                        password: this.userService.hashPassword(this.configService.get<string>("INIT_PASSWORD")),
                        age: 20,
                        gender: "MALE",
                        address: "VietNam",
                        role: userRole?._id
                    }
                ])
            }
        }
    }
}
