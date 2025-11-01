import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import { ResponseMessage } from 'src/auth/decorators/public.decorator';
import { IUser } from 'src/users/users.interface';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage("Create a role")
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.create(createRoleDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage("Get role with paginate")
  findAll(
    @Query("current") page: string,
    @Query("pageSize") limit: string,
    @Query() queryString: string
  ) {
    return this.rolesService.findAll(+page, +limit, queryString);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage("get a role by id")
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage("update a role by id")
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @User() user: IUser) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage("Delete a role by id")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.rolesService.remove(id, user);
  }
}
