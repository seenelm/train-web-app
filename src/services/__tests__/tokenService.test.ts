import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tokenService } from '../tokenService';
import { v4 as uuidv4 } from 'uuid';

// Mock uuid
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mocked-uuid-value')
}));

describe('tokenService', () => {
  // Setup localStorage mock
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      })
    };
  })();

  // Replace the global localStorage with our mock
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('setTokens', () => {
    it('should store tokens and user info in localStorage', () => {
      // Arrange
      const accessToken = 'test-access-token';
      const refreshToken = 'test-refresh-token';
      const userId = 'user123';
      const username = 'testuser';
      const name = 'Test User';

      // Act
      tokenService.setTokens(accessToken, refreshToken, userId, username, name);

      // Assert
      expect(localStorageMock.setItem).toHaveBeenCalledWith('accessToken', accessToken);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('refreshToken', refreshToken);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify({ userId, username, name })
      );
    });
  });

  describe('getAccessToken', () => {
    it('should retrieve the access token from localStorage', () => {
      // Arrange
      const accessToken = 'test-access-token';
      localStorageMock.getItem.mockReturnValueOnce(accessToken);

      // Act
      const result = tokenService.getAccessToken();

      // Assert
      expect(localStorageMock.getItem).toHaveBeenCalledWith('accessToken');
      expect(result).toBe(accessToken);
    });

    it('should return null if access token is not in localStorage', () => {
      // Arrange
      localStorageMock.getItem.mockReturnValueOnce(null);

      // Act
      const result = tokenService.getAccessToken();

      // Assert
      expect(localStorageMock.getItem).toHaveBeenCalledWith('accessToken');
      expect(result).toBeNull();
    });
  });

  describe('getRefreshToken', () => {
    it('should retrieve the refresh token from localStorage', () => {
      // Arrange
      const refreshToken = 'test-refresh-token';
      localStorageMock.getItem.mockReturnValueOnce(refreshToken);

      // Act
      const result = tokenService.getRefreshToken();

      // Assert
      expect(localStorageMock.getItem).toHaveBeenCalledWith('refreshToken');
      expect(result).toBe(refreshToken);
    });

    it('should return null if refresh token is not in localStorage', () => {
      // Arrange
      localStorageMock.getItem.mockReturnValueOnce(null);

      // Act
      const result = tokenService.getRefreshToken();

      // Assert
      expect(localStorageMock.getItem).toHaveBeenCalledWith('refreshToken');
      expect(result).toBeNull();
    });
  });

  describe('getUser', () => {
    it('should retrieve the user info from localStorage', () => {
      // Arrange
      const userInfo = JSON.stringify({
        userId: 'user123',
        username: 'testuser',
        name: 'Test User'
      });
      localStorageMock.getItem.mockReturnValueOnce(userInfo);

      // Act
      const result = tokenService.getUser();

      // Assert
      expect(localStorageMock.getItem).toHaveBeenCalledWith('user');
      expect(result).toBe(userInfo);
    });

    it('should return null if user info is not in localStorage', () => {
      // Arrange
      localStorageMock.getItem.mockReturnValueOnce(null);

      // Act
      const result = tokenService.getUser();

      // Assert
      expect(localStorageMock.getItem).toHaveBeenCalledWith('user');
      expect(result).toBeNull();
    });
  });

  describe('clearTokens', () => {
    it('should remove all tokens and user data from localStorage', () => {
      // Act
      tokenService.clearTokens();

      // Assert
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('deviceId');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('getDeviceId', () => {
    it('should return existing deviceId if it exists in localStorage', () => {
      // Arrange
      const deviceId = 'existing-device-id';
      localStorageMock.getItem.mockReturnValueOnce(deviceId);

      // Act
      const result = tokenService.getDeviceId();

      // Assert
      expect(localStorageMock.getItem).toHaveBeenCalledWith('deviceId');
      expect(result).toBe(deviceId);
    });

    it('should generate and store a new deviceId if none exists', () => {
      // Arrange
      localStorageMock.getItem.mockReturnValueOnce(null);
      const generateDeviceIdSpy = vi.spyOn(tokenService, 'generateDeviceId');

      // Act
      const result = tokenService.getDeviceId();

      // Assert
      expect(localStorageMock.getItem).toHaveBeenCalledWith('deviceId');
      expect(generateDeviceIdSpy).toHaveBeenCalled();
      expect(result).toBe('mocked-uuid-value');
    });
  });

  describe('generateDeviceId', () => {
    it('should generate a new UUID and store it in localStorage', () => {
      // Act
      const result = tokenService.generateDeviceId();

      // Assert
      expect(uuidv4).toHaveBeenCalled();
      expect(localStorageMock.setItem).toHaveBeenCalledWith('deviceId', 'mocked-uuid-value');
      expect(result).toBe('mocked-uuid-value');
    });
  });
});