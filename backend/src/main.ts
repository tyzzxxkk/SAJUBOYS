import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 프론트 도메인에서 오는 쿠키·헤더를 허용해 SPA 통신을 지원한다
  app.enableCors(configService.get('cors'));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  // 모든 엔드포인트는 /api prefix 아래에서 일관되게 노출된다
  app.setGlobalPrefix('api');

  const port = configService.get<number>('port') || 3001;
  await app.listen(port);
}
void bootstrap();
