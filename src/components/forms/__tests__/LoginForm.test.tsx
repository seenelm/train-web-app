import {describe, expect, vi, beforeEach, it} from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { mockAuthService, mockReactRouterDom, mockTokenService } from '../../../mocks/mocks';
import { LoginModel } from '../LoginForm';
import AuthDataProvider from '../../../common/test-util/data-providers/AuthDataProvider';
import { LoginErrorTypes } from '../../../common/enums/authEnum';

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

    const fillForm = async (model: LoginModel) => {
        const emailInput = screen.getByTestId('email-input');
        const passwordInput = screen.getByTestId('password-input');
        const rememberCheckbox = screen.getByTestId('remember-checkbox');

        fireEvent.change(emailInput, { target: { value: model.email } });
        fireEvent.change(passwordInput, { target: { value: model.password } });

        if (model.rememberMe) {
            fireEvent.click(rememberCheckbox);
        }
    }

    it('renders the form correctly', () => {
        renderLogin();

        expect(screen.getByTestId('email-input')).toBeInTheDocument();
        expect(screen.getByTestId("password-input")).toBeInTheDocument();
        expect(screen.getByTestId("remember-checkbox")).toBeInTheDocument();
        expect(screen.getByTestId("forgot-password-link")).toBeInTheDocument();
        expect(screen.getByTestId('login-button')).toBeInTheDocument();
        expect(screen.getByTestId('google-button')).toBeInTheDocument();
    });

    describe('Error Cases', () => {
        it.each(AuthDataProvider.loginFormErrorCases)(
            "$description",
            async ({ model, expectedError }) => {
              renderLogin();
              
              await fillForm(model);
              
              // Submit form
              const submitButton = screen.getByTestId('login-button');
              fireEvent.click(submitButton);
              
              // Check for error message
              await waitFor(() => {
                if (expectedError === LoginErrorTypes.PasswordRequired) {
                    console.log('Looking for password error');
                    const errorElement = screen.getByTestId('password-input-error');
                    console.log('Error element:', errorElement);
                    expect(errorElement).toHaveTextContent(expectedError);
                } else if (expectedError === LoginErrorTypes.EmailRequired) {
                    console.log('Looking for email error');
                    const emailInput = screen.getByTestId('email-input');
                    const errorElement = emailInput.closest('.form-group')?.querySelector('.input-error');
                    expect(errorElement).toHaveTextContent(expectedError);
                }
              });
            }
          );
    });
});
