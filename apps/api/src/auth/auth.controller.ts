import { Body, Controller, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.username, dto.password, dto.totp);
  }

  @Post('totp/reset/:userId')
  @UseGuards(JwtGuard)
  reset(@Param('userId', ParseIntPipe) userId: number) {
    return this.authService.resetTotp(userId);
  }
}
