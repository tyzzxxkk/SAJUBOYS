import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease;
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 30px;
`;

const OuterRing = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid rgba(200, 160, 255, 0.8);
  border-right: 3px solid rgba(150, 100, 200, 0.8);
  border-radius: 50%;
  animation: ${rotate} 2s linear infinite;
`;

const InnerRing = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 100px;
  height: 100px;
  border: 3px solid transparent;
  border-bottom: 3px solid rgba(218, 182, 255, 0.8);
  border-left: 3px solid rgba(180, 140, 230, 0.8);
  border-radius: 50%;
  animation: ${rotate} 1.5s linear infinite reverse;
`;

const CenterDot = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(200, 160, 255, 0.9), rgba(150, 100, 200, 0.9));
  border-radius: 50%;
  animation: ${pulse} 1.5s ease-in-out infinite;
  box-shadow: 0 0 20px rgba(200, 160, 255, 0.5);
`;

const LoadingText = styled.div`
  color: white;
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 10px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const SubText = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  text-align: center;
  max-width: 300px;
  line-height: 1.5;
`;

const SkipButton = styled.button`
  margin-top: 30px;
  padding: 12px 32px;
  background: rgba(190, 144, 255, 0.3);
  border: 1px solid rgba(200, 160, 255, 0.5);
  border-radius: 50px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.3s ease;
  animation-delay: 0.2s;
  animation-fill-mode: both;
  box-shadow: 0 4px 20px rgba(150, 100, 200, 0.3);

  &:hover {
    background: rgba(190, 150, 250, 0.5);
    border-color: rgba(200, 160, 255, 0.7);
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(150, 100, 200, 0.4);
  }
`;

const LoadingSpinner = ({
  message = '사주 결과 분석 중...',
  subMessage = '잠시만 기다려주세요',
  onSkip = null,
}) => {
  return (
    <LoadingOverlay>
      <SpinnerContainer>
        <OuterRing />
        <InnerRing />
        <CenterDot />
      </SpinnerContainer>
      <LoadingText>{message}</LoadingText>
      <SubText>{subMessage}</SubText>
      {onSkip && <SkipButton onClick={onSkip}>결과 확인하기</SkipButton>}
    </LoadingOverlay>
  );
};

export default LoadingSpinner;