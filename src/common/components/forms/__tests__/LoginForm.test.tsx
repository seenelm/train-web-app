import {describe, expect, vi, beforeEach, it} from 'vitest';
import { render, screen } from '@testing-library/react';
import LoginForm from '../LoginForm';
import { BrowserRouter } from 'react-router';
import { mockAuthService, mockReactRouterDom } from '../../../mocks/mocks';

vi.mock('../../../../services/authService', () => ({
    authService: mockAuthService
}));

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockReactRouterDom.useNavigate(),
  };
});

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
