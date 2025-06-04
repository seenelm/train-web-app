import {describe, expect, vi, beforeEach, it} from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { mockAuthService, mockReactRouterDom } from '../../../../mocks/mocks';

// Mock modules before importing the component
vi.mock('../../../../services/authService', () => ({
    authService: mockAuthService
}));

// Mock useNavigate
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockReactRouterDom.useNavigate(),
}));

// Import the component after mocking dependencies
import ForgotPasswordForm from '../ForgotPasswordForm';

describe('ForgotPasswordForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderForgotPasswordForm = () => {
        return render(
        <BrowserRouter>
            <ForgotPasswordForm />
        </BrowserRouter>
        );
    };

    it('renders the form correctly', () => {
        renderForgotPasswordForm();

        // Check for all form elements using testId attributes
        expect(screen.getByTestId('email-input')).toBeInTheDocument();
        expect(screen.getByTestId('submit-button')).toBeInTheDocument();
        
        // Check for text content
        expect(screen.getByText(/Enter your email address below/i)).toBeInTheDocument();
        expect(screen.getByText(/Send Reset Instructions/i)).toBeInTheDocument();
    });
});