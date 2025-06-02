// import { describe, it, expect, vi } from 'vitest';
// import { render, screen } from '@testing-library/react';
// import { BrowserRouter } from 'react-router-dom';
// import AuthPage from '../AuthPage';

// // Mock the child components
// vi.mock('../../components/forms/LoginForm', () => ({
//   default: () => <div data-testid="login-form">Login Form</div>
// }));

// vi.mock('../../components/forms/RegisterForm', () => ({
//   default: () => <div data-testid="register-form">Register Form</div>
// }));

// vi.mock('../../components/forms/ForgotPasswordForm', () => ({
//   default: () => <div data-testid="forgot-password-form">Forgot Password Form</div>
// }));

// vi.mock('../../components/forms/ResetPasswordForm', () => ({
//   default: () => <div data-testid="reset-password-form">Reset Password Form</div>
// }));

// describe('AuthPage Component', () => {
//   it('renders login form when authType is login', () => {
//     render(
//       <BrowserRouter>
//         <AuthPage authType="login" />
//       </BrowserRouter>
//     );

//     expect(screen.getByTestId('login-form')).toBeInTheDocument();
//     expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
//     expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
//   });

//   it('renders register form when authType is register', () => {
//     render(
//       <BrowserRouter>
//         <AuthPage authType="register" />
//       </BrowserRouter>
//     );

//     expect(screen.getByTestId('register-form')).toBeInTheDocument();
//     expect(screen.getByText(/create an account/i)).toBeInTheDocument();
//     expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument();
//   });

//   it('renders forgot password form when authType is forgot-password', () => {
//     render(
//       <BrowserRouter>
//         <AuthPage authType="forgot-password" />
//       </BrowserRouter>
//     );

//     expect(screen.getByTestId('forgot-password-form')).toBeInTheDocument();
//     expect(screen.getByText(/forgot your password\?/i)).toBeInTheDocument();
//     expect(screen.getByText(/remember your password\?/i)).toBeInTheDocument();
//   });

//   it('renders reset password form when authType is reset-password', () => {
//     render(
//       <BrowserRouter>
//         <AuthPage authType="reset-password" />
//       </BrowserRouter>
//     );

//     expect(screen.getByTestId('reset-password-form')).toBeInTheDocument();
//     expect(screen.getByText(/reset your password/i)).toBeInTheDocument();
//     expect(screen.getByText(/remember your password\?/i)).toBeInTheDocument();
//   });

//   it('adds the correct class name based on authType', () => {
//     const { container, rerender } = render(
//       <BrowserRouter>
//         <AuthPage authType="login" />
//       </BrowserRouter>
//     );
    
//     expect(container.querySelector('.auth-page-login')).toBeInTheDocument();
    
//     rerender(
//       <BrowserRouter>
//         <AuthPage authType="forgot-password" />
//       </BrowserRouter>
//     );
    
//     expect(container.querySelector('.auth-page-forgot-password')).toBeInTheDocument();
//   });
// });
