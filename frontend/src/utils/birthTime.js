const BIRTH_TIME_SLOTS = [
  { range: "23-01", time: "00:00", label: "자시 (23:00 - 01:00)" },
  { range: "01-03", time: "02:00", label: "축시 (01:00 - 03:00)" },
  { range: "03-05", time: "04:00", label: "인시 (03:00 - 05:00)" },
  { range: "05-07", time: "06:00", label: "묘시 (05:00 - 07:00)" },
  { range: "07-09", time: "08:00", label: "진시 (07:00 - 09:00)" },
  { range: "09-11", time: "10:00", label: "사시 (09:00 - 11:00)" },
  { range: "11-13", time: "12:00", label: "오시 (11:00 - 13:00)" },
  { range: "13-15", time: "14:00", label: "미시 (13:00 - 15:00)" },
  { range: "15-17", time: "16:00", label: "신시 (15:00 - 17:00)" },
  { range: "17-19", time: "18:00", label: "유시 (17:00 - 19:00)" },
  { range: "19-21", time: "20:00", label: "술시 (19:00 - 21:00)" },
  { range: "21-23", time: "22:00", label: "해시 (21:00 - 23:00)" },
];

export const BIRTH_TIME_OPTIONS = [
  { value: "", label: "시간을 선택해주세요" },
  { value: "unknown", label: "시간 모름" },
  ...BIRTH_TIME_SLOTS.map(({ range, label }) => ({
    value: range,
    label,
  })),
];

export const TIME_RANGE_TO_24H = BIRTH_TIME_SLOTS.reduce((acc, slot) => {
  acc[slot.range] = slot.time;
  return acc;
}, {});

export const TIME_24H_TO_LABEL = BIRTH_TIME_SLOTS.reduce((acc, slot) => {
  acc[slot.time] = slot.label;
  return acc;
}, {});

// 선택된 시간대 값을 API 요청에 필요한 값과 플래그로 변환한다.
// '시간 모름' 옵션은 백엔드에서 별도로 처리할 수 있도록 구분한다.
export const resolveBirthTimeForApi = (selectedRange) => {
  if (!selectedRange) {
    return { time: "", isTimeUnknown: false };
  }

  if (selectedRange === "unknown") {
    return { time: "00:00", isTimeUnknown: true };
  }

  return {
    time: TIME_RANGE_TO_24H[selectedRange] || "00:00",
    isTimeUnknown: false,
  };
};

// 저장된 HH:MM 값을 사용자 친화적인 한글 문구로 변환한다.
export const formatBirthTimeDisplay = (time, isTimeUnknown) => {
  if (isTimeUnknown) return "시간 모름";
  if (!time) return "시간 모름";
  return TIME_24H_TO_LABEL[time] || time;
};
