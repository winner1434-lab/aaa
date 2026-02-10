import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { authenticator } from 'otplib';
import { DataService } from '../common/data.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly data: DataService,
    private readonly jwt: JwtService,
  ) {}

  login(username: string, password: string, totp: string) {
    const user = this.data.users.find((u) => u.username === username);
    if (!user || !compareSync(password, user.passwordHash)) {
      throw new UnauthorizedException('帳號或密碼錯誤');
    }
    if (!user.totpSecret || !authenticator.verify({ token: totp, secret: user.totpSecret })) {
      throw new UnauthorizedException('TOTP 驗證失敗');
    }

    return {
      accessToken: this.jwt.sign(
        { sub: user.id, role: user.role, propertyIds: user.propertyIds },
        { expiresIn: '24h' },
      ),
    };
  }

  resetTotp(userId: number) {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) {
      throw new UnauthorizedException('找不到使用者');
    }
    user.totpSecret = authenticator.generateSecret();
    return { userId, secret: user.totpSecret };
  }
}
