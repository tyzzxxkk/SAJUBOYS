import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { JwtPayload, UserPayload } from '../../common/interfaces/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ||
        'your-very-secure-secret-key-here-change-in-production',
    });
  }

  async validate(payload: JwtPayload): Promise<UserPayload | null> {
    // 토큰에 포함된 사용자 식별자를 바탕으로 인증 대상을 확인한다
    return this.authService.validateUser(payload);
  }
}
