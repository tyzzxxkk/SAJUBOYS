import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SajuResult, SajuResultDocument } from './schemas/saju-result.schema';
import { CalculateSajuDto } from './dto/saju.dto';
import { SajuCalculator } from './utils/saju-calculator';
import { SajuInterpreter } from './utils/saju-interpreter';
import { SajuAdvancedInterpreter } from './utils/saju-advanced-interpreter';
import { FIVE_ELEMENTS } from './utils/constants';
import type { CityCoordinate } from './korea-coordinates';

interface Pillar {
  heaven: string;
  earth: string;
}

interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  time: Pillar | null;
}

interface Elements extends Record<string, number> {
  목: number;
  화: number;
  토: number;
  금: number;
  수: number;
}

interface YinYang {
  yin: number;
  yang: number;
}

export interface AddressResult {
  address: string;
  roadAddress: string;
  placeName: string;
  x: string;
  y: string;
}

@Injectable()
export class SajuService {
  constructor(
    @InjectModel(SajuResult.name)
    private sajuResultModel: Model<SajuResultDocument>,
  ) {}

  async calculateSaju(userId: string | null, dto: CalculateSajuDto) {
    const { gender, birthDate, birthTime, isTimeUnknown } = dto;

    // 입력 생년월일·시간을 Date 객체로 변환해 명식을 계산할 기준 시각으로 사용한다
    const [birthYear, birthMonth, birthDay] = birthDate.split('-').map(Number);
    const [birthHour, birthMinute] = birthTime.split(':').map(Number);
    const birthDateTime = new Date(
      birthYear,
      birthMonth - 1,
      birthDay,
      birthHour,
      birthMinute,
      0,
    );

    const sajuYear = SajuCalculator.getSajuYear(birthDateTime);
    const yearPillar = SajuCalculator.getSixtyGapja(sajuYear);
    const solarMonth = SajuCalculator.getSolarMonth(birthDateTime);
    const monthPillar = SajuCalculator.getMonthPillar(
      yearPillar.heaven,
      solarMonth,
    );
    const dayPillar = SajuCalculator.getDayPillar(birthDateTime);
    const timePillar = isTimeUnknown
      ? null
      : SajuCalculator.getTimePillar(
          dayPillar.heaven,
          birthDateTime.getHours(),
        );

    // 계산된 기둥을 한 구조체에 담아 이후 해석 로직에서 일관되게 사용한다
    const fourPillars: FourPillars = {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      time: timePillar,
    };

    // 오행·음양·대운 등 해석에 필요한 보조 지표들을 미리 산출한다
    const elements = this.analyzeElements(fourPillars);
    const yinYang = this.analyzeYinYang(fourPillars);
    const daeun = SajuCalculator.calculateDaeun(gender, monthPillar);
    const currentYear = new Date().getFullYear();
    const saeun = SajuCalculator.calculateSaeun(currentYear);
    const solarTerm = SajuCalculator.getSolarTerm(birthDateTime);

    const interpretation = await this.generateInterpretation(
      gender,
      fourPillars,
      elements,
      yinYang,
      birthDateTime.getFullYear(),
      currentYear,
    );

    const sajuResult = new this.sajuResultModel({
      userId: userId ? new Types.ObjectId(userId) : null,
      ...dto,
      fourPillars,
      interpretation,
      daeun,
      saeun,
      solarTerm,
      elements,
      yinYang,
      isTimeUnknown,
    });

    await sajuResult.save();
    return sajuResult;
  }

  private analyzeElements(fourPillars: FourPillars): Elements {
    const elements: Elements = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

    // 각 기둥의 천간·지지를 대응 오행으로 변환해 빈도를 누적한다
    [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.time]
      .filter((p): p is Pillar => p !== null)
      .forEach(({ heaven, earth }) => {
        elements[FIVE_ELEMENTS.getElementFromStem(heaven) as keyof Elements]++;
        elements[FIVE_ELEMENTS.getElementFromBranch(earth) as keyof Elements]++;
      });

    return elements;
  }

  private analyzeYinYang(fourPillars: FourPillars): YinYang {
    const YANG_HEAVENLY = new Set(['갑', '병', '무', '경', '임']);
    const YANG_EARTHLY = new Set(['자', '인', '진', '오', '신', '술']);

    let yin = 0;
    let yang = 0;

    // 천간·지지 각각을 음과 양으로 분류해 균형 정도를 계산한다
    [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.time]
      .filter((p): p is Pillar => p !== null)
      .forEach(({ heaven, earth }) => {
        yang += YANG_HEAVENLY.has(heaven) ? 1 : 0;
        yin += YANG_HEAVENLY.has(heaven) ? 0 : 1;
        yang += YANG_EARTHLY.has(earth) ? 1 : 0;
        yin += YANG_EARTHLY.has(earth) ? 0 : 1;
      });

    return { yin, yang };
  }

  private async generateInterpretation(
    gender: string,
    fourPillars: FourPillars,
    elements: Elements,
    yinYang: YinYang,
    _birthYear: number,
    currentYear: number,
  ) {
    const dayHeavenly = fourPillars.day.heaven;
    const yearEarth = fourPillars.year.earth;

    // 일간으로 기본 성격 틀을 찾고, 강·약점을 함께 서술한다
    const personalityInfo =
      SajuInterpreter.PERSONALITY_BY_DAY_STEM[dayHeavenly];
    const personality = personalityInfo
      ? `${personalityInfo.basic}\n강점: ${personalityInfo.strength}\n약점: ${personalityInfo.weakness}`
      : '균형잡힌 성격으로 다양한 상황에 잘 적응합니다.';

    const elementBalance = SajuInterpreter.interpretFiveElements(elements);
    const yinYangBalance = this.interpretYinYangBalance(yinYang);

    // 연도별 변화를 반영한 고급 해석을 생성한다
    const timelyFortune = await SajuAdvancedInterpreter.generateTimelyFortune(
      { ...fourPillars, time: fourPillars.time ?? undefined },
      currentYear,
      elements,
      yinYang,
      gender,
    );

    const career = SajuInterpreter.interpretCareer(dayHeavenly, elements);
    const relationship = SajuInterpreter.interpretRelationship(
      gender,
      dayHeavenly,
    );
    const wealth = SajuInterpreter.interpretWealth(dayHeavenly, yearEarth);
    const health = SajuInterpreter.interpretHealth(elements);
    const socialRelationship =
      SajuInterpreter.interpretSocialRelationship(dayHeavenly);

    return {
      personality: `${personality}\n\n${yinYangBalance}`,
      career,
      relationship: `${relationship}\n\n${timelyFortune.love}`,
      wealth: `${wealth}\n\n${timelyFortune.wealth}`,
      health: `${health.trim()}\n\n${timelyFortune.health}`,
      fortune: timelyFortune.overall,
      socialRelationship,
      elementBalance,
      yinYangBalance,
      advancedAnalysis: {
        timelyFortune,
      },
    };
  }

  async getSavedResults(userId: string) {
    // 최신 결과가 먼저 오도록 정렬해 사용자가 최근 기록을 빠르게 확인하게 한다
    return this.sajuResultModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getSajuById(userId: string, sajuId: string) {
    // 사용자 소유의 단일 결과만 조회해 다른 사람의 데이터를 차단한다
    return this.sajuResultModel
      .findOne({
        _id: new Types.ObjectId(sajuId),
        userId: new Types.ObjectId(userId),
      })
      .exec();
  }

  // 음양 비율에 따른 해석 문구를 생성해 사용자에게 전달한다
  private interpretYinYangBalance(yinYang: YinYang): string {
    const total = yinYang.yin + yinYang.yang;
    const yinRatio = (yinYang.yin / total) * 100;
    const yangRatio = (yinYang.yang / total) * 100;
    const yinStr = yinRatio.toFixed(0);
    const yangStr = yangRatio.toFixed(0);
    const ratioStr = `(음 ${yinStr}% : 양 ${yangStr}%)`;

    if (Math.abs(yinRatio - yangRatio) < 10) {
      return `음양이 균형을 이루고 있습니다 ${ratioStr}. 조화로운 성격으로 다양한 상황에 유연하게 대처할 수 있습니다.`;
    }

    if (yangRatio > yinRatio) {
      return `양기가 강한 사주입니다 ${ratioStr}. 적극적이고 활동적이며, 리더십이 강합니다. 때로는 휴식과 내면의 평화를 찾는 것이 필요합니다.`;
    }

    return `음기가 강한 사주입니다 ${ratioStr}. 신중하고 사려 깊으며, 내면의 힘이 강합니다. 때로는 적극적인 행동과 표현이 필요합니다.`;
  }

  async saveResult(userId: string, sajuId: string) {
    const result = await this.sajuResultModel.findOne({
      _id: new Types.ObjectId(sajuId),
    });

    if (!result) throw new NotFoundException('결과를 찾을 수 없습니다.');
    if (result.userId && result.userId.toString() !== userId) {
      throw new ForbiddenException('다른 사용자의 결과입니다.');
    }

    result.userId = new Types.ObjectId(userId);
    result.updatedAt = new Date();
    return result.save();
  }

  async deleteResult(userId: string, sajuId: string) {
    // 삭제 대상이 본인 소유인지 조건으로 한 번 더 확인한다
    const { deletedCount } = await this.sajuResultModel.deleteOne({
      _id: new Types.ObjectId(sajuId),
      userId: new Types.ObjectId(userId),
    });

    if (!deletedCount) {
      throw new NotFoundException('삭제할 결과를 찾을 수 없습니다.');
    }
  }

  async searchAddress(query: string): Promise<AddressResult[]> {
    const { KOREA_COORDINATES } = (await import('./korea-coordinates.js')) as {
      KOREA_COORDINATES: CityCoordinate[];
    };

    if (!query?.trim()) return [];

    const searchQuery = query.toLowerCase().replace(/\s+/g, '');
    const uniqueResults = new Map<string, AddressResult>();

    // 도시·구 이름을 공백 제거 상태로 비교해 사소한 입력 오타에도 대응한다
    KOREA_COORDINATES.forEach((coord) => {
      const cityDistrict = `${coord.city}${coord.district}`
        .toLowerCase()
        .replace(/\s+/g, '');
      const districtOnly = coord.district.toLowerCase().replace(/\s+/g, '');

      if (
        cityDistrict.includes(searchQuery) ||
        districtOnly.includes(searchQuery)
      ) {
        const key = `${coord.city} ${coord.district}`;
        if (!uniqueResults.has(key)) {
          const fullAddress = key;
          uniqueResults.set(key, {
            placeName:
              coord.district === '세종시' ? '세종특별자치시' : fullAddress,
            address: fullAddress,
            roadAddress: fullAddress,
            x: coord.longitude.toString(),
            y: coord.latitude.toString(),
          });
        }
      }
    });

    return Array.from(uniqueResults.values()).slice(0, 30);
  }
}
