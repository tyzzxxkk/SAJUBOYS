import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { SignupDto, LoginDto } from './dto/auth.dto';
import { JwtPayload, UserPayload } from '../common/interfaces/jwt.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const { name, email, password } = dto;

    // 동일 이메일 가입 여부를 미리 확인해 중복 회원을 방지한다
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('이미 가입된 이메일입니다');
    }

    // 비밀번호는 해시로 저장해 탈취 상황에서도 원문 노출을 방지한다
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ name, email, password: hashedPassword });
    await user.save();

    return this.toSafeUser(user);
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    // 입력한 이메일을 기준으로 저장된 사용자를 조회한다
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 이메일입니다');
    }

    // 저장된 해시와 비교해 비밀번호가 일치하는지 검증한다
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다');
    }

    const payload = { sub: user._id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: this.toSafeUser(user),
      accessToken,
    };
  }

  async validateUser(payload: JwtPayload): Promise<UserPayload | null> {
    // JWT 페이로드 기준으로 사용자 기본 정보를 복원해 요청 컨텍스트에 주입한다
    const user = await this.userModel.findById(payload.sub).select('-password');

    if (user) {
      return {
        _id: user.id as string,
        email: user.email,
        name: user.name,
      };
    }

    return null;
  }

  private toSafeUser(user: UserDocument) {
    // 응답 본문에서는 비밀번호 해시를 제외한 사용자 정보만 노출한다
    const { password: _removed, ...userWithoutPassword } = user.toObject();
    void _removed;
    return userWithoutPassword;
  }
}
