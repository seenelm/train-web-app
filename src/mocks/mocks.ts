import { vi } from "vitest";

export const mockAuthService = {
    register: vi.fn(),
    login: vi.fn(),
    requestPasswordReset: vi.fn(),
    resetPasswordWithCode: vi.fn(),
    signInWithGoogle: vi.fn(),
    authenticateWithProvider: vi.fn(),
    logout: vi.fn()
};

export const mockTokenService = {
    setTokens: vi.fn(),
    getAccessToken: vi.fn(),
    getRefreshToken: vi.fn(),
    getDeviceId: vi.fn(),
    getUser: vi.fn(),
    clearTokens: vi.fn(),
    generateDeviceId: vi.fn()
}

// Mock useNavigate
export const mockNavigate = vi.fn();

// Mock react-router-dom
export const mockReactRouterDom = {
  useNavigate: () => mockNavigate,
};