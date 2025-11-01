import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  UseGuards,
  Request,
  ValidationPipe,
  Param,
  Query,
} from '@nestjs/common';
import { SajuService } from './saju.service';
import { CalculateSajuDto } from './dto/saju.dto';
import { SearchAddressDto } from './dto/search-address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../common/interfaces/request.interface';

@Controller('saju')
export class SajuController {
  constructor(private sajuService: SajuService) {}

  // 검색어 일부만으로도 주소 후보를 빠르게 제안한다
  @Get('search-address')
  async searchAddress(@Query() dto: SearchAddressDto) {
    return {
      success: true,
      data: await this.sajuService.searchAddress(dto.query),
    };
  }

  @Post('calculate')
  async calculateSaju(
    @Request() req: AuthenticatedRequest,
    @Body(ValidationPipe) dto: CalculateSajuDto,
  ) {
    const userId = req.user?._id || null;
    // 로그인 사용자는 결과를 즉시 저장할 수 있도록 ID를 전달한다
    return {
      success: true,
      message: '사주 계산이 완료되었습니다',
      data: await this.sajuService.calculateSaju(userId, dto),
    };
  }

  // 인증된 사용자는 자신이 저장한 결과 목록만 조회할 수 있다
  @Get('saved')
  @UseGuards(JwtAuthGuard)
  async getSavedResults(@Request() req: AuthenticatedRequest) {
    return {
      success: true,
      message: '저장된 사주 결과를 가져왔습니다',
      data: await this.sajuService.getSavedResults(req.user._id),
    };
  }

  @Post(':id/save')
  @UseGuards(JwtAuthGuard)
  async saveResult(
    @Request() req: AuthenticatedRequest,
    @Param('id') sajuId: string,
  ) {
    return {
      success: true,
      message: '사주 결과가 저장되었습니다',
      data: await this.sajuService.saveResult(req.user._id, sajuId),
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getSajuById(
    @Request() req: AuthenticatedRequest,
    @Param('id') sajuId: string,
  ) {
    return {
      success: true,
      message: '사주 결과를 가져왔습니다',
      data: await this.sajuService.getSajuById(req.user._id, sajuId),
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteResult(
    @Request() req: AuthenticatedRequest,
    @Param('id') sajuId: string,
  ) {
    // 소유자 식별자 비교는 서비스 레이어에서 한 번 더 검증한다
    await this.sajuService.deleteResult(req.user._id, sajuId);
    return {
      success: true,
      message: '사주 결과가 삭제되었습니다',
    };
  }
}
