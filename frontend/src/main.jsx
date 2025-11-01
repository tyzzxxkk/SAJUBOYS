import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 루트 컴포넌트는 StrictMode로 감싸 개발 중 잠재 이슈를 조기에 발견한다 */}
    <App />
  </StrictMode>
);
