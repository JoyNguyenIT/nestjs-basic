import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import { ResponseMessage } from 'src/auth/decorators/public.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { IUser } from 'src/users/users.interface';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage("Create a Permission")
  create(@Body() createPermissionDto: CreatePermissionDto, @User() user: IUser) {
    return this.permissionsService.create(createPermissionDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Get list permissions with paginate success!')
  findAll(
    @Query("current") page: string,
    @Query("pageSize") limit: string,
    @Query() queryString: string
  ) {
    return this.permissionsService.findAll(+page, +limit, queryString);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Get permissions by id success!')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage("Put update a Permission")
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto, @User() user: IUser) {
    return this.permissionsService.update(id, updatePermissionDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage("Delete a permission")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.permissionsService.remove(id, user);
  }
}
