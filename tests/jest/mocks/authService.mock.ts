// Mock implementation of authService
const mockUser = {
  uid: 'test-uid',
  name: 'Test User',
  email: 'test@example.com',
  photoURL: 'https://example.com/photo.jpg'
};

export const authServiceMock = {
  getCurrentUser: jest.fn().mockReturnValue(null),
  signInWithGoogle: jest.fn().mockResolvedValue(mockUser),
  signOut: jest.fn().mockResolvedValue(undefined)
};

// Helper to reset all mocks between tests
export const resetAuthServiceMock = () => {
  authServiceMock.getCurrentUser.mockReset().mockReturnValue(null);
  authServiceMock.signInWithGoogle.mockReset().mockResolvedValue(mockUser);
  authServiceMock.signOut.mockReset().mockResolvedValue(undefined);
};

// Helper to simulate logged in state
export const simulateLoggedInUser = () => {
  authServiceMock.getCurrentUser.mockReturnValue(mockUser);
};

// Helper to simulate logged out state
export const simulateLoggedOutUser = () => {
  authServiceMock.getCurrentUser.mockReturnValue(null);
};
