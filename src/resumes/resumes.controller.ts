import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage } from 'src/auth/decorators/public.decorator';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage("Create Resume Success!")
  create(@Body() createResumeDto: CreateResumeDto, @User() user: IUser) {
    return this.resumesService.create(createResumeDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage("Fetch all resumes with paginate")
  findAll(
    @Query("current") page: string,
    @Query("pageSize") limit: string,
    @Query() queryString: string
  ) {
    return this.resumesService.findAll(+page, +limit, queryString);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage("Fetch resume by id")
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage("Change status resume by id")
  update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto,
    @User() user: IUser) {
    return this.resumesService.update(id, updateResumeDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage("delete resume by id")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }

  @Post('by-user')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage("Get Resume Success!")
  getCV(@User() user: IUser) {
    return this.resumesService.getCV(user);
  }
}
