import { LICHUN_BY_YEAR } from './lichun-dates';

interface Pillar {
  heaven: string;
  earth: string;
}

interface DaeunPillar {
  age: number;
  pillar: Pillar;
}

interface SolarTermInfo {
  month: number;
  day: number;
  name: string;
}

export class SajuCalculator {
  private static readonly HEAVENLY_STEMS = [
    '갑',
    '을',
    '병',
    '정',
    '무',
    '기',
    '경',
    '신',
    '임',
    '계',
  ];

  private static readonly EARTHLY_BRANCHES = [
    '자',
    '축',
    '인',
    '묘',
    '진',
    '사',
    '오',
    '미',
    '신',
    '유',
    '술',
    '해',
  ];

  private static readonly MONTH_BRANCHES = [
    '인',
    '묘',
    '진',
    '사',
    '오',
    '미',
    '신',
    '유',
    '술',
    '해',
    '자',
    '축',
  ];

  private static readonly TIME_BRANCHES = [
    '자',
    '축',
    '인',
    '묘',
    '진',
    '사',
    '오',
    '미',
    '신',
    '유',
    '술',
    '해',
  ];

  private static readonly MONTH_HEAVEN_START: Record<string, number> = {
    갑: 2,
    을: 4,
    병: 0,
    정: 2,
    무: 4,
    기: 2,
    경: 4,
    신: 0,
    임: 2,
    계: 4,
  };

  private static readonly SOLAR_TERMS: SolarTermInfo[] = [
    { month: 1, day: 5, name: '소한' },
    { month: 1, day: 20, name: '대한' },
    { month: 2, day: 4, name: '입춘' },
    { month: 2, day: 19, name: '우수' },
    { month: 3, day: 5, name: '경칩' },
    { month: 3, day: 20, name: '춘분' },
    { month: 4, day: 5, name: '청명' },
    { month: 4, day: 20, name: '곡우' },
    { month: 5, day: 5, name: '입하' },
    { month: 5, day: 21, name: '소만' },
    { month: 6, day: 6, name: '망종' },
    { month: 6, day: 21, name: '하지' },
    { month: 7, day: 7, name: '소서' },
    { month: 7, day: 23, name: '대서' },
    { month: 8, day: 8, name: '입추' },
    { month: 8, day: 23, name: '처서' },
    { month: 9, day: 8, name: '백로' },
    { month: 9, day: 23, name: '추분' },
    { month: 10, day: 8, name: '한로' },
    { month: 10, day: 23, name: '상강' },
    { month: 11, day: 7, name: '입동' },
    { month: 11, day: 22, name: '소설' },
    { month: 12, day: 7, name: '대설' },
    { month: 12, day: 22, name: '동지' },
  ];

  private static readonly SOLAR_MONTH_START = [
    { month: 2, day: 4 },
    { month: 3, day: 5 },
    { month: 4, day: 5 },
    { month: 5, day: 5 },
    { month: 6, day: 6 },
    { month: 7, day: 7 },
    { month: 8, day: 8 },
    { month: 9, day: 8 },
    { month: 10, day: 8 },
    { month: 11, day: 7 },
    { month: 12, day: 7 },
    { month: 13, day: 5 },
  ];

  private static readonly BASE_YEAR = 1984;
  private static readonly BASE_DATE = new Date(1900, 0, 1);
  private static readonly DEFAULT_LICHUN = { month: 2, day: 4 };
  private static readonly DAEUN_START_AGE = 10;
  private static readonly DAEUN_CYCLE = 10;
  private static readonly DAEUN_COUNT = 8;

  // 기준 연도로부터 오차를 계산해 해당 연도의 갑자(천간·지지)를 도출한다
  static getSixtyGapja(year: number): Pillar {
    const diff = year - this.BASE_YEAR;
    const heavenIndex = ((diff % 10) + 10) % 10;
    const earthIndex = ((diff % 12) + 12) % 12;

    return {
      heaven: this.HEAVENLY_STEMS[heavenIndex],
      earth: this.EARTHLY_BRANCHES[earthIndex],
    };
  }

  // 입춘 이전 출생은 전년도 명식으로 간주해 사주년을 보정한다
  static getSajuYear(birthDate: Date): number {
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();

    const lichunDate = LICHUN_BY_YEAR[year];
    const [lichunMonth, lichunDay] = lichunDate
      ? lichunDate.split('-').map(Number)
      : [this.DEFAULT_LICHUN.month, this.DEFAULT_LICHUN.day];

    return month < lichunMonth || (month === lichunMonth && day < lichunDay)
      ? year - 1
      : year;
  }

  // 연간에 따라 월간 시작점이 달라지는 규칙을 적용해 월주를 계산한다
  static getMonthPillar(yearHeavenly: string, month: number): Pillar {
    const startIndex = this.MONTH_HEAVEN_START[yearHeavenly];
    const heavenIndex = (startIndex + month - 1) % 10;

    return {
      heaven: this.HEAVENLY_STEMS[heavenIndex],
      earth: this.MONTH_BRANCHES[month - 1],
    };
  }

  // 기준 일자와의 차이를 이용해 일간·일지를 구한다
  static getDayPillar(date: Date): Pillar {
    const diffTime = Math.abs(date.getTime() - this.BASE_DATE.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return {
      heaven: this.HEAVENLY_STEMS[diffDays % 10],
      earth: this.EARTHLY_BRANCHES[(diffDays + 4) % 12],
    };
  }

  private static getTimeIndex(hour: number): number {
    if (hour >= 23 || hour < 1) return 0;
    if (hour < 3) return 1;
    if (hour < 5) return 2;
    if (hour < 7) return 3;
    if (hour < 9) return 4;
    if (hour < 11) return 5;
    if (hour < 13) return 6;
    if (hour < 15) return 7;
    if (hour < 17) return 8;
    if (hour < 19) return 9;
    if (hour < 21) return 10;
    return 11;
  }

  // 일간과 시각을 조합해 시주의 천간·지지를 선택한다
  static getTimePillar(dayHeavenly: string, hour: number): Pillar {
    const timeIndex = this.getTimeIndex(hour);
    const dayHeavenIndex = this.HEAVENLY_STEMS.indexOf(dayHeavenly);
    const timeHeavenIndex = (dayHeavenIndex * 2 + timeIndex) % 10;

    return {
      heaven: this.HEAVENLY_STEMS[timeHeavenIndex],
      earth: this.TIME_BRANCHES[timeIndex],
    };
  }

  // 성별과 연주를 기반으로 대운 흐름(10년 주기)을 산출한다
  static calculateDaeun(gender: string, yearPillar: Pillar): DaeunPillar[] {
    const yearHeavenIndex = this.HEAVENLY_STEMS.indexOf(yearPillar.heaven);
    const isYang = yearHeavenIndex % 2 === 0;
    const isForward =
      (gender === '남' && isYang) || (gender === '여' && !isYang);

    const monthHeavenIndex = this.HEAVENLY_STEMS.indexOf(yearPillar.heaven);
    const monthEarthIndex = this.EARTHLY_BRANCHES.indexOf(yearPillar.earth);

    const daeunList: DaeunPillar[] = [];

    for (let i = 0; i < this.DAEUN_COUNT; i++) {
      const age = this.DAEUN_START_AGE + i * this.DAEUN_CYCLE;

      const heavenIdx = isForward
        ? (monthHeavenIndex + i + 1) % 10
        : (monthHeavenIndex - i - 1 + 10) % 10;

      const earthIdx = isForward
        ? (monthEarthIndex + i + 1) % 12
        : (monthEarthIndex - i - 1 + 12) % 12;

      daeunList.push({
        age,
        pillar: {
          heaven: this.HEAVENLY_STEMS[heavenIdx],
          earth: this.EARTHLY_BRANCHES[earthIdx],
        },
      });
    }

    return daeunList;
  }

  // 해당 연도의 갑자를 그대로 사용해 세운을 결정한다
  static calculateSaeun(currentYear: number): Pillar {
    return this.getSixtyGapja(currentYear);
  }

  // 날짜가 속한 절기를 역순 탐색으로 찾아 반환한다
  static getSolarTerm(date: Date): string {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    for (let i = this.SOLAR_TERMS.length - 1; i >= 0; i--) {
      const term = this.SOLAR_TERMS[i];
      if (month > term.month || (month === term.month && day >= term.day)) {
        return term.name;
      }
    }

    return this.SOLAR_TERMS[this.SOLAR_TERMS.length - 1].name;
  }

  // 절기 경계를 기준으로 음력 월(절기월)을 판별한다
  static getSolarMonth(date: Date): number {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    for (let i = 0; i < this.SOLAR_MONTH_START.length - 1; i++) {
      const start = this.SOLAR_MONTH_START[i];
      const end = this.SOLAR_MONTH_START[i + 1];

      if (month < start.month || (month === start.month && day < start.day)) {
        return i === 0 ? 12 : i;
      }

      if (
        month === start.month &&
        day >= start.day &&
        (month < end.month || (month === end.month && day < end.day))
      ) {
        return i + 1;
      }
    }

    return 12;
  }
}
