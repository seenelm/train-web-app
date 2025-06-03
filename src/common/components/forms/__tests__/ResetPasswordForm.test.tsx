import {describe, expect, vi, beforeEach, it} from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { mockAuthService, mockReactRouterDom } from '../../../mocks/mocks';

// Mock modules before importing the component
vi.mock('../../../../services/authService', () => ({
    authService: mockAuthService
}));

// Mock useNavigate and useLocation
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockReactRouterDom.useNavigate(),
  useLocation: () => ({ search: '?email=test@example.com' }),
}));

// Import the component after mocking dependencies
import ResetPasswordForm from '../ResetPasswordForm';

describe('ResetPasswordForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderResetPasswordForm = () => {
        return render(
        <BrowserRouter>
            <ResetPasswordForm />
        </BrowserRouter>
        );
    };

    it('renders the form correctly', () => {
        renderResetPasswordForm();

        // Check for all form elements using testId attributes
        expect(screen.getByTestId('email-input')).toBeInTheDocument();
        expect(screen.getByTestId('code-input')).toBeInTheDocument();
        expect(screen.getByTestId('password-input')).toBeInTheDocument();
        expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
        expect(screen.getByTestId('reset-button')).toBeInTheDocument();
        
        // Check for text content
        expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
    });
});