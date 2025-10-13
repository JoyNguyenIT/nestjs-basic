
import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { LocalAuthGuard } from './auth/passport/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService
  ) { }

}
