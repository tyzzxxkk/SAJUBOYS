import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

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
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
  width: 100%;
  padding: 0 1rem;
  margin-top: 6rem;

  @media (min-width: 481px) {
    margin-top: 8rem;
    padding: 0 1.5rem;
  }

  @media (min-width: 769px) {
    margin-top: 10rem;
  }

  @media (min-width: 1025px) {
    margin-top: 14.25rem;
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

const SubTitle = styled.h1`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 400;
  margin-bottom: 0.8rem;
  letter-spacing: 0.5px;
  text-align: center;

  @media (min-width: 481px) {
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  @media (min-width: 769px) {
    font-size: 1.15rem;
  }

  @media (min-width: 1025px) {
    font-size: 1.25rem;
  }
`;

const Title = styled.h1`
  background: linear-gradient(135deg, #cec2ff, #dab6ff, #f9cbfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 4rem;
  font-weight: 900;
  font-family: "Cinzel Decorative", cursive;
  text-shadow: 0 0 40px rgba(150, 100, 200, 0.3);
  position: relative;
  text-align: center;
  line-height: 1.2;

  &::after {
    content: "SAJUBOYS";
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    background: none;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 80px rgba(150, 100, 200, 0.5);
  }

  @media (min-width: 769px) {
    font-size: 5rem;
  }

  @media (min-width: 1025px) {
    font-size: 6.5rem;
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
  margin-top: 4rem;
  padding: 1rem 2.5rem;
  min-width: 180px;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 90%;
  letter-spacing: 0.5px;
  box-shadow: 0 6px 25px rgba(150, 100, 200, 0.2);

  &:hover {
    background: rgba(190, 150, 250, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 10px 35px rgba(150, 100, 200, 0.4);
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

  @media (min-width: 481px) {
    margin-top: 6rem;
    font-size: 1.05rem;
    padding: 1rem 3rem;
  }

  @media (min-width: 769px) {
    margin-top: 8rem;
    font-size: 1.1rem;
    padding: 1rem 3.25rem;
    width: 28rem;
  }

  @media (min-width: 1025px) {
    margin-top: 12rem;
    padding: 1rem 3.5rem;
  }
`;

function Starting() {
  const navigate = useNavigate();

  return (
    <Container>
      <GradientCircle1 />
      <GradientCircle2 />
      <ContentWrapper>
        <SubTitle>오늘 당신의 사주를 확인해보세요</SubTitle>
        <Title>SAJUBOYS</Title>
        <Button onClick={() => navigate("/login")}>사주팔자 보러가기</Button>
      </ContentWrapper>
    </Container>
  );
}

export default Starting;
