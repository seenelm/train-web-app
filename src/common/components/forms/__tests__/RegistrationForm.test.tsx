import {describe, expect, vi, beforeEach, it} from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { mockAuthService, mockReactRouterDom, mockTokenService } from '../../../mocks/mocks';

// Mock modules before importing the component
vi.mock('../../../../services/authService', () => ({
    authService: mockAuthService
}));

vi.mock('../../../../services/tokenService', () => ({
    tokenService: mockTokenService
}));

// Mock useNavigate
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockReactRouterDom.useNavigate(),
}));

// Import the component after mocking dependencies
import RegistrationForm from '../RegistrationForm';

describe('RegistrationForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderRegistration = () => {
        return render(
        <BrowserRouter>
            <RegistrationForm />
        </BrowserRouter>
        );
    };

    it('renders the form correctly', () => {
        renderRegistration();

        // Check for all form elements using testId attributes
        expect(screen.getByTestId('name-input')).toBeInTheDocument();
        expect(screen.getByTestId('email-input')).toBeInTheDocument();
        expect(screen.getByTestId('password-input')).toBeInTheDocument();
        expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
        expect(screen.getByTestId('terms-checkbox')).toBeInTheDocument();
        expect(screen.getByTestId('register-button')).toBeInTheDocument();
        expect(screen.getByTestId('google-button')).toBeInTheDocument();
        
        // Check for text elements
        expect(screen.getByText(/Terms of Service/i)).toBeInTheDocument();
        expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
        expect(screen.getByText(/Or sign up with/i)).toBeInTheDocument();
    });
});