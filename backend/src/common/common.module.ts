import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      // 설정 객체를 전역으로 노출해 다른 모듈에서 반복 설정을 피한다
      load: [configuration],
      isGlobal: true,
    }),
  ],
  exports: [ConfigModule],
})
export class CommonModule {}
