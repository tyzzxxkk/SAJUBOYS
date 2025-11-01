import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 신규 회원정보를 받아 계정 생성 후 결과를 반환한다
  @Post('signup')
  async signup(@Body(ValidationPipe) dto: SignupDto) {
    return {
      success: true,
      message: '회원가입이 완료되었습니다',
      data: await this.authService.signup(dto),
    };
  }

  // 발급된 JWT는 이후 요청에서 인증 헤더로 사용된다
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body(ValidationPipe) dto: LoginDto) {
    return {
      success: true,
      message: '로그인이 완료되었습니다',
      data: await this.authService.login(dto),
    };
  }
}
