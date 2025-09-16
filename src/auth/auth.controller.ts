import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service'; // <-- importe o serviço

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {} // <-- use o tipo AuthService

  @Post('register')
  register(@Body() b: any) {
    return this.auth.register(b.email, b.password);
  }

  @Post('login')
  login(@Body() b: any) {
    return this.auth.login(b.email, b.password);
  }
}
