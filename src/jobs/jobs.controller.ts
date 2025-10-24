import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { IUser } from 'src/users/users.interface';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import { Public, ResponseMessage } from 'src/auth/decorators/public.decorator';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @UseGuards(JwtAuthGuard)
  @ResponseMessage("Create new job!")
  @Post()
  create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    return this.jobsService.create(createJobDto, user);
  }

  @Public()
  @ResponseMessage("Get all job with pagination!")
  @Get()
  findAll(
    @Query("current") page: string,
    @Query("pageSize") limit: string,
    @Query() queryString: string
  ) {
    return this.jobsService.findAll(+page, +limit, queryString);
  }

  @Public()
  @ResponseMessage("Get a job by id!")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ResponseMessage("Update job!")
  @Put(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(id, updateJobDto);
  }

  @UseGuards(JwtAuthGuard)
  @ResponseMessage("Delete job!")
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.jobsService.remove(id, user);
  }
}
