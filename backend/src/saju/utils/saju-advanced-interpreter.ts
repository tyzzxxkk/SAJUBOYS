import { FIVE_ELEMENTS } from './constants';

interface YearlyFortune {
  overall: string;
  love: string;
  wealth: string;
  health: string;
  advice: string;
}

interface FourPillars {
  year: { heaven: string; earth: string };
  month: { heaven: string; earth: string };
  day: { heaven: string; earth: string };
  time?: { heaven: string; earth: string };
}

interface Elements {
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

type Sipseong = '비겁' | '식상' | '재성' | '관성' | '인성';
type ElementRelation = 'supportive' | 'conflicting' | 'neutral';

export class SajuAdvancedInterpreter {
  private static readonly HEAVENLY_STEMS = [
    '경',
    '신',
    '임',
    '계',
    '갑',
    '을',
    '병',
    '정',
    '무',
    '기',
  ];

  private static readonly EARTHLY_BRANCHES = [
    '신',
    '유',
    '술',
    '해',
    '자',
    '축',
    '인',
    '묘',
    '진',
    '사',
    '오',
    '미',
  ];

  private static readonly LOVE_STARS = ['자', '오', '묘', '유'];

  private static readonly SIPSEONG_FORTUNES: Record<Sipseong, string> = {
    비겁: '올해는 형제, 친구, 동료와의 인연이 강한 해입니다. 협력과 경쟁이 동시에 일어날 수 있으며, 독립심과 자립심이 강해집니다. 재물 관리에 주의가 필요하며, 과도한 지출을 자제하세요.',
    식상: '올해는 표현력과 창의력이 빛나는 해입니다. 새로운 아이디어가 샘솟고 자유로운 활동이 많아집니다. 학업, 창작, 사업 확장에 유리하나, 말조심과 감정 조절이 필요합니다.',
    재성: '올해는 재물운이 좋은 해입니다. 수입 증가의 기회가 있으며, 투자나 사업에서 성과를 거둘 수 있습니다. 다만 과욕을 부리지 말고, 아버지나 배우자 건강에도 신경 쓰세요.',
    관성: '올해는 명예와 지위가 상승하는 해입니다. 승진, 합격, 인정받을 기회가 많습니다. 책임감이 커지고 리더십을 발휘할 수 있으나, 스트레스와 압박감도 증가하니 건강 관리가 중요합니다.',
    인성: '올해는 학습과 성장에 좋은 해입니다. 스승이나 어른의 도움을 받을 수 있고, 지혜와 지식을 쌓기에 적합합니다. 안정적이고 평온한 시기이나, 지나친 의존은 피하세요.',
  };

  private static readonly HEALTH_ADVICE: Record<string, string> = {
    목: '간과 눈 건강에 유의하세요. 스트레스 관리가 중요합니다.',
    화: '심장과 혈액순환에 신경 쓰세요. 과로를 피하고 충분한 휴식을 취하세요.',
    토: '소화기 건강을 챙기세요. 규칙적인 식사와 적절한 운동이 필요합니다.',
    금: '호흡기 건강에 주의하세요. 환기를 자주 하고 미세먼지를 조심하세요.',
    수: '신장과 방광 건강에 유의하세요. 충분한 수분 섭취가 중요합니다.',
  };

  // 연도·오행·음양 정보를 조합해 올해의 주요 운세를 생성한다
  static async generateTimelyFortune(
    fourPillars: FourPillars,
    currentYear: number,
    elements?: Elements,
    yinYang?: YinYang,
    gender?: string,
  ): Promise<YearlyFortune> {
    const dayMaster = fourPillars.day.heaven;
    const thisYearStem = this.getYearStem(currentYear);
    const thisYearBranch = this.getYearBranch(currentYear);

    const advice = await this.getPersonalizedAdvice(
      dayMaster,
      thisYearStem,
      thisYearBranch,
      elements,
      yinYang,
      fourPillars,
      currentYear,
      gender,
    );

    return {
      overall: this.getYearlyOverallFortune(dayMaster, thisYearStem),
      love: this.getLoveFortune(dayMaster, thisYearBranch),
      wealth: this.getWealthFortune(dayMaster, thisYearStem),
      health: this.getHealthFortune(dayMaster, elements),
      advice,
    };
  }

  static getYearStem(year: number): string {
    return this.HEAVENLY_STEMS[year % 10];
  }

  static getYearBranch(year: number): string {
    return this.EARTHLY_BRANCHES[year % 12];
  }

  // 일간과 연간의 관계에 따라 전체적인 흐름을 설명한다
  static getYearlyOverallFortune(dayMaster: string, yearStem: string): string {
    const relationship = this.getElementRelationship(dayMaster, yearStem);
    const sipseong = this.getSipseong(dayMaster, yearStem);

    let fortune =
      this.SIPSEONG_FORTUNES[sipseong] ||
      '올해는 전반적으로 균형잡힌 해입니다. 무리하지 않고 꾸준히 노력하면 좋은 결과를 얻을 수 있습니다.';

    if (relationship === 'conflicting') {
      fortune +=
        ' 다만 올해는 도전적인 요소가 있어 신중한 판단과 인내심이 필요합니다.';
    } else if (relationship === 'supportive') {
      fortune += ' 흐름이 순조로워 계획한 일들이 잘 풀릴 것입니다.';
    }

    return fortune;
  }

  private static readonly SIPSEONG_RELATIONS: Record<
    string,
    Record<string, Sipseong>
  > = {
    목: { 화: '식상', 토: '재성', 금: '관성', 수: '인성' },
    화: { 토: '식상', 금: '재성', 수: '관성', 목: '인성' },
    토: { 금: '식상', 수: '재성', 목: '관성', 화: '인성' },
    금: { 수: '식상', 목: '재성', 화: '관성', 토: '인성' },
    수: { 목: '식상', 화: '재성', 토: '관성', 금: '인성' },
  };

  static getSipseong(dayMaster: string, targetStem: string): Sipseong {
    const dayElement = FIVE_ELEMENTS.getElementFromStem(dayMaster);
    const targetElement = FIVE_ELEMENTS.getElementFromStem(targetStem);

    if (dayElement === targetElement) return '비겁';
    return this.SIPSEONG_RELATIONS[dayElement]?.[targetElement] || '비겁';
  }

  // 연지의 도화살 여부를 바탕으로 연애운을 도출한다
  static getLoveFortune(_dayMaster: string, yearBranch: string): string {
    let fortune = '💕 연애운: ';

    if (this.LOVE_STARS.includes(yearBranch)) {
      fortune +=
        '매력이 높아지는 시기입니다. 새로운 만남의 기회가 많고, 이성에게 좋은 인상을 줄 수 있습니다. 사교 활동이 활발해지며 인기가 상승합니다. ';
    }

    if (fortune === '💕 연애운: ') {
      fortune +=
        '안정적인 관계 유지에 좋은 시기입니다. 진지한 대화와 이해를 통해 관계가 깊어집니다. 성급하게 서두르기보다는 꾸준히 마음을 나누세요.';
    }

    return fortune.trim();
  }

  private static readonly WEALTH_MESSAGES: Record<string, string> = {
    재성: '재물을 얻을 기회가 많은 해입니다. 투자나 사업에서 성과를 거둘 수 있으며, 부동산이나 금융 상품에 관심을 가져보세요. 다만 과욕은 금물이며, 신중한 판단이 필요합니다.',
    비겁: '재물 관리에 주의가 필요한 해입니다. 불필요한 지출을 줄이고, 타인에게 돈을 빌려주는 것을 자제하세요. 형제나 동업자와의 금전 문제에 신중해야 합니다.',
    식상: '노력한 만큼 수입이 생기는 해입니다. 창의적인 아이디어나 재능을 활용하면 재물을 얻을 수 있습니다. 부업이나 새로운 수입원을 개척하기에 좋습니다.',
    관성: '직장에서의 승진이나 안정적인 급여가 기대되는 해입니다. 정직하고 성실한 태도로 일하면 정당한 보상을 받을 수 있습니다.',
  };

  // 시비성(십성) 해석을 활용해 재물운 메시지를 선택한다
  static getWealthFortune(dayMaster: string, yearStem: string): string {
    const sipseong = this.getSipseong(dayMaster, yearStem);
    return (
      '💰 재물운: ' +
      (this.WEALTH_MESSAGES[sipseong] ||
        '안정적인 재정 관리가 필요한 해입니다. 꾸준한 저축과 계획적인 소비를 권장합니다. 큰 투자보다는 안전한 자산 관리에 집중하세요.')
    );
  }

  // 부족한 오행을 찾아 해당 장부의 건강 수칙을 제시한다
  static getHealthFortune(_dayMaster: string, elements?: Elements): string {
    if (!elements) {
      return '🏥 건강운: 규칙적인 생활과 적절한 휴식이 필요합니다.';
    }

    const minElement = Object.entries(elements).reduce(
      (min, [elem, count]) =>
        (count as number) < min.count
          ? { element: elem, count: count as number }
          : min,
      { element: '', count: 10 },
    );

    return `🏥 건강운: ${this.HEALTH_ADVICE[minElement.element] || '전반적인 건강 관리가 필요합니다.'}`;
  }

  // Gemini API를 호출해 맞춤형 행동 가이드를 생성한다
  static async getPersonalizedAdvice(
    dayMaster: string,
    yearStem: string,
    yearBranch: string,
    elements?: Elements,
    yinYang?: YinYang,
    fourPillars?: FourPillars,
    currentYear?: number,
    gender?: string,
  ): Promise<string> {
    if (!fourPillars || !currentYear || !gender || !elements || !yinYang) {
      return '맞춤형 행동 가이드를 생성할 수 없습니다. 나중에 다시 시도해주세요.';
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY || '';
      const dayElement = FIVE_ELEMENTS.getElementFromStem(dayMaster);
      const yearElement = FIVE_ELEMENTS.getElementFromStem(yearStem);
      const relationship = this.getElementRelationship(dayMaster, yearStem);
      const relationText =
        relationship === 'supportive'
          ? '상생'
          : relationship === 'conflicting'
            ? '상극'
            : '중립';

      const prompt = `당신은 한국의 전문 사주 명리학자입니다. 다음 사주 정보를 바탕으로 ${currentYear}년 올해의 구체적인 행동 가이드를 JSON 형식으로 작성해주세요.

**사주 정보:**
- 성별: ${gender}
- 일간(日干): ${dayMaster} (${dayElement})
- 년주(年柱): ${fourPillars.year.heaven}${fourPillars.year.earth}
- 월주(月柱): ${fourPillars.month.heaven}${fourPillars.month.earth}
- 일주(日柱): ${fourPillars.day.heaven}${fourPillars.day.earth}
- 시주(時柱): ${fourPillars.time ? fourPillars.time.heaven + fourPillars.time.earth : '미상'}
- 오행 분포: 목=${elements.목}, 화=${elements.화}, 토=${elements.토}, 금=${elements.금}, 수=${elements.수}
- 음양 분포: 음=${yinYang.yin}, 양=${yinYang.yang}
- ${currentYear}년 천간: ${yearStem} (${yearElement})
- ${currentYear}년 지지: ${yearBranch}
- 오행 관계: ${relationText}

**중요: 반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요:**

{
  "keywords": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"],
  "shouldDo": ["해야 할 일 1", "해야 할 일 2", "해야 할 일 3"],
  "shouldAvoid": ["피해야 할 일 1", "피해야 할 일 2", "피해야 할 일 3"]
}

**주의사항:**
- keywords는 정확히 5개만 작성하세요.
- keywords는 띄어쓰기 없이 작성하세요.
- shouldDo는 정확히 3개만 작성하세요.
- shouldAvoid는 정확히 3개만 작성하세요.
- 각 항목은 구체적이고 실천 가능한 내용으로 작성하세요.`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API 오류:', errorText);
        throw new Error(`Gemini API Error: ${response.status}`);
      }

      const data = (await response.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
        }>;
      };
      const text =
        data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data);

      const jsonText = this.extractJSON(text);
      const aiResult = JSON.parse(jsonText) as {
        keywords?: string[];
        shouldDo?: string[];
        shouldAvoid?: string[];
      };

      return this.formatAdvice(aiResult);
    } catch (error) {
      console.error('AI 조언 생성 실패:', error);
      return '맞춤형 행동 가이드를 생성할 수 없습니다. 나중에 다시 시도해주세요.';
    }
  }

  // AI 응답에서 JSON 블록만 발췌해 파싱 가능하도록 정제한다
  private static extractJSON(text: string): string {
    let jsonText = text.trim();

    if (jsonText.includes('```json')) {
      const match = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
      if (match) jsonText = match[1].trim();
    } else if (jsonText.includes('```')) {
      const match = jsonText.match(/```\s*([\s\S]*?)\s*```/);
      if (match) jsonText = match[1].trim();
    }

    if (!jsonText.startsWith('{')) {
      const jsonMatch = jsonText.match(
        /\{[\s\S]*"keywords"[\s\S]*"shouldDo"[\s\S]*"shouldAvoid"[\s\S]*\}/,
      );
      if (jsonMatch) jsonText = jsonMatch[0];
    }

    return jsonText;
  }

  // 키워드와 체크리스트를 가독성 있는 문장으로 변환한다
  private static formatAdvice(aiResult: {
    keywords?: string[];
    shouldDo?: string[];
    shouldAvoid?: string[];
  }): string {
    let advice = '🔑 핵심 키워드:\n';
    advice += (aiResult.keywords || [])
      .slice(0, 5)
      .map((item) => `#${item}`)
      .join(' ');

    advice += '\n\n✅ 해야 할 일:\n';
    advice += (aiResult.shouldDo || [])
      .slice(0, 3)
      .map((item, i) => `${i + 1}. ${item}`)
      .join('\n');

    advice += '\n\n⚠️ 피해야 할 일:\n';
    advice += (aiResult.shouldAvoid || [])
      .slice(0, 3)
      .map((item, i) => `${i + 1}. ${item}`)
      .join('\n');

    return advice;
  }

  private static readonly ELEMENT_SUPPORTIVE: Record<string, string> = {
    목: '화',
    화: '토',
    토: '금',
    금: '수',
    수: '목',
  };

  private static readonly ELEMENT_CONFLICTING: Record<string, string> = {
    목: '토',
    화: '금',
    토: '수',
    금: '목',
    수: '화',
  };

  // 두 천간 간의 상생/상극 관계를 판단해 시비성을 결정한다
  private static getElementRelationship(
    stem1: string,
    stem2: string,
  ): ElementRelation {
    const element1 = FIVE_ELEMENTS.getElementFromStem(stem1);
    const element2 = FIVE_ELEMENTS.getElementFromStem(stem2);

    if (
      this.ELEMENT_SUPPORTIVE[element1] === element2 ||
      this.ELEMENT_SUPPORTIVE[element2] === element1
    ) {
      return 'supportive';
    }

    if (
      this.ELEMENT_CONFLICTING[element1] === element2 ||
      this.ELEMENT_CONFLICTING[element2] === element1
    ) {
      return 'conflicting';
    }

    return 'neutral';
  }
}
