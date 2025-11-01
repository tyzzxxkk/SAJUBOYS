import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  min-height: 100vh;
  position: relative;
  overflow: hidden;
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

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
  width: 100%;
  margin-top: 1rem;
`;

const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 800px;
`;

const Title = styled.h1`
  background: linear-gradient(135deg, #cec2ff, #dab6ff, #f9cbfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2.2rem;
  font-weight: 900;
  margin: 0;
  margin-bottom: 1.5rem;
  font-family: "Cinzel", cursive;
  letter-spacing: 1.5px;
  position: relative;
  line-height: 1.2;

  @media (min-width: 769px) {
    font-size: 2.8rem;
    letter-spacing: 2px;
  }

  @media (min-width: 1025px) {
    font-size: 3.5rem;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.8rem;
  width: 100%;
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  margin-bottom: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  color: white;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 0;
  width: 100%;
  padding: 1.25rem 2rem;
  box-sizing: border-box;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(180, 140, 230, 0.6);
    box-shadow: 0 0 25px rgba(150, 100, 200, 0.4);
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
  margin-top: 1rem;
  padding: 1rem 2.5rem;
  min-width: 180px;
  transition: all 0.3s ease;
  width: 100%;
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
`;

const LinkText = styled.p`
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2rem;
  font-size: 0.9rem;

  a {
    color: #9576dfb0;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const SuccessMessage = styled.p`
  color: #51cf66;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-align: center;
`;

function Signup() {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  // 기본 입력 검증을 통과해야 서버에 회원가입을 위임한다
  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("모든 필드를 입력해주세요");
      return false;
    }

    if (formData.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("올바른 이메일 형식이 아닙니다");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await signup(
      formData.name,
      formData.email,
      formData.password
    );

    if (result.success) {
      setSuccess("회원가입이 완료되었습니다!");
      // 성공 메시지를 잠시 노출한 뒤 로그인 화면으로 보내 사용자 흐름을 이어간다
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setError(result.error || "회원가입에 실패했습니다");
    }
  };

  return (
    <Container>
      <GradientCircle1 />
      <GradientCircle2 />
      <ContentWrapper>
        <Title>SIGN UP</Title>
        <SignupForm onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          <InputWrapper>
            <Label>이름</Label>
            <Input
              type="text"
              name="name"
              placeholder="이름을 입력해주세요"
              value={formData.name}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <Label>이메일</Label>
            <Input
              type="email"
              name="email"
              placeholder="이메일을 입력해주세요"
              value={formData.email}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <Label>비밀번호</Label>
            <Input
              type="password"
              name="password"
              placeholder="비밀번호를 입력해주세요 (6자 이상)"
              value={formData.password}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <Label>비밀번호 확인</Label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="비밀번호를 다시 입력해주세요"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </InputWrapper>
          <Button type="submit" disabled={loading}>
            {loading ? "가입 중..." : "회원가입"}
          </Button>
          <LinkText>
            이미 계정이 있으신가요? <Link to="/login">로그인하기</Link>
          </LinkText>
        </SignupForm>
      </ContentWrapper>
    </Container>
  );
}

export default Signup;
