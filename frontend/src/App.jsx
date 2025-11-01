import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { AuthProvider } from './context/AuthContext';
import { SajuProvider } from './context/SajuContext';
import { ROUTES } from './constants';

const Starting = lazy(() => import('./Starting'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const SajuInput = lazy(() => import('./pages/SajuInput'));
const SajuResult = lazy(() => import('./pages/SajuResult'));
const SavedSaju = lazy(() => import('./pages/SavedSaju'));

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
  
  body {
    overflow-x: hidden;
  }
  
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'black',
    color: 'white',
    fontSize: '1.2rem'
  }}>
    로딩 중...
  </div>
);

function App() {
  return (
    <>
      <GlobalStyle />
      {/* 인증과 사주 상태를 전역으로 공유해 라우팅 간 데이터 일관성을 유지한다 */}
      <AuthProvider>
        <SajuProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path={ROUTES.HOME} element={<Starting />} />
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.SIGNUP} element={<Signup />} />
                <Route path={ROUTES.SAJU_INPUT} element={<SajuInput />} />
                <Route path={ROUTES.SAJU_RESULT} element={<SajuResult />} />
                <Route path={ROUTES.SAVED_SAJU} element={<SavedSaju />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </SajuProvider>
      </AuthProvider>
    </>
  );
}

export default App;
