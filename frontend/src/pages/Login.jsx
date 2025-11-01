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
  height: 100vh;
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

const LoginForm = styled.form`
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
  margin-bottom: 1.6rem;
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
  margin-top: 1.2rem;
  padding: 1rem 2.5rem;
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

function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 필수 입력 누락 시 서버 호출 전에 사용자에게 즉시 안내한다
    if (!formData.email || !formData.password) {
      setError("모든 필드를 입력해주세요");
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // 로그인 성공 후 바로 사주 입력 화면으로 이동시켜 흐름을 유지한다
      navigate("/saju-input");
    } else {
      setError(result.error || "로그인에 실패했습니다");
    }
  };

  return (
    <Container>
      <GradientCircle1 />
      <GradientCircle2 />
      <ContentWrapper>
        <Title>LOGIN</Title>
        <LoginForm onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
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
              placeholder="비밀번호를 입력해주세요"
              value={formData.password}
              onChange={handleChange}
            />
          </InputWrapper>
          <Button type="submit" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </Button>
          <LinkText>
            계정이 없으신가요? <Link to="/signup">회원가입하기</Link>
          </LinkText>
        </LoginForm>
      </ContentWrapper>
    </Container>
  );
}

export default Login;
