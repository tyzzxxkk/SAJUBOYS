import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useSaju } from "../context/SajuContext";
import { useAuth } from "../context/AuthContext";
import AddressSearch from "../components/AddressSearch";
import DateInput from "../components/DateInput";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  BIRTH_TIME_OPTIONS,
  resolveBirthTimeForApi,
} from "../utils/birthTime";

const float1 = keyframes`
  0%, 100% {
    transform: translateX(0) translateY(0);
  }
  25% {
    transform: translateX(-300px) translateY(100px);
  }
  50% {
    transform: translateX(-150px) translateY(-100px);
  }
  75% {
    transform: translateX(-250px) translateY(50px);
  }
`;

const float2 = keyframes`
  0%, 100% {
    transform: translateX(0) translateY(0);
  }
  25% {
    transform: translateX(250px) translateY(-80px);
  }
  50% {
    transform: translateX(300px) translateY(100px);
  }
  75% {
    transform: translateX(150px) translateY(-50px);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: black;
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 0;
  margin: 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  z-index: 1;
  width: 100%;
  max-width: 100%;
  height: 100%;
  padding: 2vh 1rem;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;

  @media (min-width: 769px) {
    padding: 3vh 2rem;
  }

  @media (min-width: 1025px) {
    padding: 4vh 2rem;
  }
`;

const GradientCircle1 = styled.div`
  position: fixed;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0) 0%,
    rgba(135, 60, 255, 0.3) 50%,
    #0e0025 100%
  );
  top: -200px;
  right: -100px;
  animation: ${float1} 15s ease-in-out infinite;
  filter: blur(40px);
  pointer-events: none;

  @media (min-width: 768px) {
    width: 800px;
    height: 800px;
    top: -300px;
    right: -200px;
  }
`;

const GradientCircle2 = styled.div`
  position: fixed;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0) 0%,
    rgba(135, 60, 255, 0.3) 50%,
    #0e0025 100%
  );
  bottom: -150px;
  left: 100px;
  animation: ${float2} 18s ease-in-out infinite;
  filter: blur(40px);
  pointer-events: none;

  @media (min-width: 768px) {
    width: 800px;
    height: 800px;
    bottom: -200px;
    left: 300px;
  }
`;

const Title = styled.h1`
  background: linear-gradient(135deg, #cec2ff, #dab6ff, #f9cbfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 3rem;
  font-weight: 900;
  margin: 1rem;
  font-family: "Cinzel Decorative", cursive;
  letter-spacing: 1.5px;
  position: relative;
  line-height: 1.2;

  @media (min-width: 769px) {
    font-size: 3.2rem;
    letter-spacing: 2px;
  }

  @media (min-width: 1025px) {
    font-size: 3.6rem;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
  margin-bottom: 1.2rem;
  width: 100%;
  max-width: 800px;
  box-sizing: border-box;

  @media (min-width: 769px) {
    width: 90%;
    margin-bottom: 1.5rem;
  }
`;

const Input = styled.input`
  color: white;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 0;
  width: 100%;
  padding: 0.9rem 1.5rem;
  box-sizing: border-box;
  transition: all 0.3s ease;
  height: 3.2rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(180, 140, 230, 0.6);
    box-shadow: 0 0 25px rgba(150, 100, 200, 0.4);
  }

  @media (min-width: 769px) {
    height: 3.5rem;
    padding: 1rem 1.8rem;
    font-size: 0.95rem;
  }
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
  margin-bottom: 0.4rem;
  font-weight: 500;
  letter-spacing: 0.5px;

  @media (min-width: 769px) {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
`;

const Button = styled.button`
  background: rgba(190, 144, 255, 0.3);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(200, 160, 255, 0.5);
  border-radius: 100px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin: 0;
  margin-top: 0.5rem;
  padding: 1rem 2.5rem;
  min-width: 180px;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 6px 25px rgba(150, 100, 200, 0.2);

  &:hover {
    background: rgba(190, 150, 250, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(150, 100, 200, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 6px 25px rgba(150, 100, 200, 0.2);
  }

  @media (min-width: 769px) {
    width: 90%;
    font-size: 1.05rem;
    padding: 1.1rem 3rem;
    margin-top: 0.8rem;
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  gap: 0;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  width: 100%;
  height: 3.2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-sizing: border-box;
  padding: 4px;

  @media (min-width: 769px) {
    height: 3.5rem;
  }
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 0 1.5rem;
  background: ${(props) =>
    props.$active ? "rgba(200, 160, 255, 0.35)" : "transparent"};
  color: ${(props) => (props.$active ? "white" : "rgba(255, 255, 255, 0.5)")};
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${(props) => (props.$active ? "500" : "400")};
  box-shadow: ${(props) =>
    props.$active ? "0 4px 20px rgba(150, 100, 200, 0.4)" : "none"};
  height: 100%;

  &:hover {
    background: ${(props) =>
      props.$active
        ? "rgba(200, 160, 255, 0.45)"
        : "rgba(255, 255, 255, 0.05)"};
    color: ${(props) => (props.$active ? "white" : "rgba(255, 255, 255, 0.7)")};
  }

  @media (min-width: 769px) {
    font-size: 0.95rem;
  }
`;

const DateToggleWrapper = styled.div`
  display: flex;
  gap: 0;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  width: 180px;
  height: 3.2rem;
  box-sizing: border-box;
  padding: 4px;

  @media (min-width: 769px) {
    height: 3.5rem;
  }
`;

const DateToggleButton = styled.button`
  flex: 1;
  padding: 0 0.8rem;
  background: ${(props) =>
    props.$active ? "rgba(200, 160, 255, 0.35)" : "transparent"};
  color: ${(props) => (props.$active ? "white" : "rgba(255, 255, 255, 0.5)")};
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${(props) => (props.$active ? "500" : "400")};
  box-shadow: ${(props) =>
    props.$active ? "0 4px 20px rgba(150, 100, 200, 0.4)" : "none"};
  height: 100%;

  &:hover {
    background: ${(props) =>
      props.$active
        ? "rgba(200, 160, 255, 0.45)"
        : "rgba(255, 255, 255, 0.05)"};
    color: ${(props) => (props.$active ? "white" : "rgba(255, 255, 255, 0.7)")};
  }

  @media (min-width: 769px) {
    font-size: 0.95rem;
  }
`;

const DateInputRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  width: 100%;
`;

const DateInputWrapper = styled.div`
  flex: 1;
`;

const TimeSelect = styled.select`
  color: white;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  font-size: 0.9rem;
  cursor: pointer;
  width: 240px;
  padding: 0 1.5rem;
  height: 3.2rem;
  box-sizing: border-box;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3e%3cpolyline points="6 9 12 15 18 9"%3e%3c/polyline%3e%3c/svg%3e');
  background-repeat: no-repeat;
  background-position: right 1.2rem center;
  background-size: 18px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.12);
    border-color: rgba(180, 140, 230, 0.6);
    box-shadow: 0 0 25px rgba(150, 100, 200, 0.4);
  }

  option {
    background-color: #1a1a1a;
    color: white;
  }

  @media (min-width: 769px) {
    height: 3.5rem;
    font-size: 0.95rem;
  }
`;

function SajuInput() {
  const navigate = useNavigate();
  const { calculateSaju, loading, setLoading } = useSaju();
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [gender, setGender] = useState("male");
  const [calendarType, setCalendarType] = useState("solar");
  const [birthDate, setBirthDate] = useState(null);
  const [birthTime, setBirthTime] = useState("");
  const [city, setCity] = useState("");
  const [resultData, setResultData] = useState(null);

  const handleSajuAnalysis = async () => {
    // 필수 입력값 검증
    if (!name || !name.trim()) {
      alert("이름을 입력해주세요");
      return;
    }

    if (!birthDate) {
      alert("생년월일을 선택해주세요");
      return;
    }

    if (!birthTime) {
      alert("태어난 시간을 선택해주세요");
      return;
    }

    if (!city || !city.trim()) {
      alert("태어난 도시를 입력해주세요");
      return;
    }

    const { time: formattedTime, isTimeUnknown } =
      resolveBirthTimeForApi(birthTime);

    // 백엔드 API 규격에 맞춰 요청 객체 구성
    const formData = {
      name: name.trim(),
      gender: gender === "male" ? "남" : "여",
      birthDate: `${birthDate.getFullYear()}-${String(
        birthDate.getMonth() + 1
      ).padStart(2, "0")}-${String(birthDate.getDate()).padStart(2, "0")}`,
      birthTime: formattedTime,
      calendarType: calendarType === "solar" ? "양력" : "음력",
      city: city.trim(),
    };

    if (isTimeUnknown) {
      formData.isTimeUnknown = true;
    }

    try {
      const result = await calculateSaju(formData);

      if (result.success) {
        setResultData(result.data);
      } else {
        alert(result.error || "사주 계산에 실패했습니다");
      }
    } catch {
      alert("사주 계산 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleSavedResults = () => {
    navigate("/saved-saju");
  };

  const timeOptions = BIRTH_TIME_OPTIONS;

  return (
    <Container>
      <GradientCircle1 />
      <GradientCircle2 />
      <ContentWrapper>
        <Title>SAJUBOYS</Title>

        <InputWrapper>
          <Label>이름</Label>
          <Input
            placeholder="이름을 입력해주세요"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </InputWrapper>

        <InputWrapper>
          <Label>성별</Label>
          <ToggleWrapper>
            <ToggleButton
              $active={gender === "male"}
              onClick={() => setGender("male")}
            >
              남성
            </ToggleButton>
            <ToggleButton
              $active={gender === "female"}
              onClick={() => setGender("female")}
            >
              여성
            </ToggleButton>
          </ToggleWrapper>
        </InputWrapper>

        <InputWrapper>
          <Label>생년월일시</Label>
          <DateInputRow>
            <DateToggleWrapper>
              <DateToggleButton
                $active={calendarType === "solar"}
                onClick={() => setCalendarType("solar")}
              >
                양력
              </DateToggleButton>
              <DateToggleButton
                $active={calendarType === "lunar"}
                onClick={() => setCalendarType("lunar")}
              >
                음력
              </DateToggleButton>
            </DateToggleWrapper>
            <DateInputWrapper>
              <DateInput
                value={birthDate}
                onChange={(date) => setBirthDate(date)}
                placeholder="생년월일 8자리를 입력해주세요"
              />
            </DateInputWrapper>
            <TimeSelect
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
            >
              {timeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TimeSelect>
          </DateInputRow>
        </InputWrapper>

        <InputWrapper>
          <Label>도시명</Label>
          <AddressSearch
            placeholder="도시명을 입력해주세요"
            value={city}
            onChange={(value) => setCity(value)}
          />
        </InputWrapper>

        <Button id="btn1" onClick={handleSajuAnalysis} disabled={loading}>
          {loading ? "분석 중..." : "사주팔자 확인하기"}
        </Button>
        <Button onClick={handleSavedResults}>저장된 사주팔자 보러가기</Button>
      </ContentWrapper>

      {loading && (
        <LoadingSpinner
          message={resultData ? "사주 팔자 계산 완료!" : "사주 팔자 계산 중..."}
          subMessage={
            resultData
              ? "결과를 확인해보세요"
              : "당신의 운명을 분석하고 있습니다"
          }
          onSkip={
            resultData
              ? () => {
                  setLoading(false); // 결과 확인 버튼으로 오버레이 닫기
                  navigate("/saju-result", { state: resultData });
                }
              : null
          }
        />
      )}
    </Container>
  );
}

export default SajuInput;
