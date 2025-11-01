import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import styled from 'styled-components';

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 2rem 0;
`;

const ChartCard = styled.div`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const ChartTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
  letter-spacing: 0.5px;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 300px;
`;

const COLORS = {
  목: '#2ecc71',
  화: '#e74c3c',
  토: '#f39c12',
  금: '#95a5a6',
  수: '#3498db',
};

const YIN_YANG_COLORS = ['#ef4444', '#3b82f6'];

export function SajuCharts({ elements, yinYang }) {
  // 오행 카운트를 리차트에서 요구하는 데이터 구조로 정규화한다
  const elementsData = elements
    ? Object.entries(elements).map(([key, value]) => ({
        name: key,
        value,
        fill: COLORS[key],
      }))
    : [];

  const yinYangData = yinYang
    ? [
        { name: '양(陽)', value: yinYang.yang || 0 },
        { name: '음(陰)', value: yinYang.yin || 0 },
      ]
    : [];

  const maxElement = elements ? Math.max(...Object.values(elements)) : 0;
  const radarData = elements
    ? Object.entries(elements).map(([key, value]) => ({
        subject: key,
        value,
        fullMark: maxElement > 0 ? maxElement : 5,
      }))
    : [];

  // 다크 테마에 맞춘 커스텀 툴팁 스타일 정의
  const customTooltipStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    padding: '10px',
    color: 'white',
  };

  const renderCustomLabelWithStyle = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, name, value } = props;

    if (value === 0) return null;

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="14"
      >
        {`${name} (${value})`}
      </text>
    );
  };

  return (
    <ChartsContainer>
      <ChartCard>
        <ChartTitle>오행 분포도</ChartTitle>
        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={elementsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabelWithStyle}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {elementsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={customTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </ChartCard>

      <ChartCard>
        <ChartTitle>음양 균형도</ChartTitle>
        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={yinYangData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabelWithStyle}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {yinYangData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={YIN_YANG_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip contentStyle={customTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </ChartCard>

      <ChartCard>
        <ChartTitle>오행 균형 분석</ChartTitle>
        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255, 255, 255, 0.3)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'white' }} />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 'dataMax']}
                tick={{ fill: 'white' }}
              />
              <Radar
                name="오행"
                dataKey="value"
                stroke="#6200ff"
                fill="#6200ff"
                fillOpacity={0.6}
              />
              <Tooltip contentStyle={customTooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </ChartCard>

      <ChartCard>
        <ChartTitle>오행 세부 분석</ChartTitle>
        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={elementsData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.2)"
              />
              <XAxis
                dataKey="name"
                tick={{ fill: 'white' }}
                stroke="rgba(255, 255, 255, 0.3)"
              />
              <YAxis
                tick={{ fill: 'white' }}
                stroke="rgba(255, 255, 255, 0.3)"
              />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {elementsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </ChartCard>
    </ChartsContainer>
  );
}

export default SajuCharts;
