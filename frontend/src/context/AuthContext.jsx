import { createContext, useContext, useReducer, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // 페이지 새로 고침 이후에도 로그인 상태를 복원한다
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: "LOGIN", payload: user });
      } catch {
        localStorage.removeItem("user");
      }
    }
    dispatch({ type: "SET_LOADING", payload: false });
  }, []);

  const login = async (email, password) => {
    // 인증 API 호출 전 로딩 상태를 표시한다
    dispatch({ type: "SET_LOADING", payload: true });

    const response = await authAPI.login({ email, password });

    if (response.success) {
      const userData = {
        ...response.data.user,
        accessToken: response.data.accessToken,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      dispatch({ type: "LOGIN", payload: userData });

      return { success: true };
    }

    const errorMessage = response.message || "로그인에 실패했습니다";
    dispatch({ type: "SET_ERROR", payload: errorMessage });
    return { success: false, error: errorMessage };
  };

  const signup = async (name, email, password) => {
    try {
      // 신규 회원가입 요청 전에 로딩 상태를 설정한다
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await authAPI.signup({ name, email, password });

      if (response.success) {
        dispatch({ type: "SET_LOADING", payload: false });
        return { success: true, user: response.data };
      }

      throw new Error(response.message || "회원가입에 실패했습니다");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "회원가입에 실패했습니다";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 내에서 사용되어야 합니다");
  }
  return context;
};
