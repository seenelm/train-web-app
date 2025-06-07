import {describe, expect, vi, beforeEach, it} from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { mockAuthService, mockReactRouterDom, mockTokenService } from '../../../mocks/mocks';

// Mock modules before importing the component
vi.mock('../../services/authService', () => ({
    authService: mockAuthService
}));

vi.mock('../../services/tokenService', () => ({
    tokenService: mockTokenService
}));

// Mock useNavigate
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockReactRouterDom.useNavigate(),
}));

// Import the component after mocking dependencies
import LoginForm from '../LoginForm';

describe('LoginForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderLogin = () => {
        return render(
        <BrowserRouter>
            <LoginForm />
        </BrowserRouter>
        );
    };

    it('renders the form correctly', () => {
        renderLogin();

        expect(screen.getByTestId('email-input')).toBeInTheDocument();
        expect(screen.getByTestId("password-input")).toBeInTheDocument();
        expect(screen.getByTestId("remember-checkbox")).toBeInTheDocument();
        expect(screen.getByTestId("forgot-password-link")).toBeInTheDocument();
        expect(screen.getByTestId('login-button')).toBeInTheDocument();
        expect(screen.getByTestId('google-button')).toBeInTheDocument();
    });
});
