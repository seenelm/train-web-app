// import { describe, it, expect, vi, beforeEach } from 'vitest';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { BrowserRouter } from 'react-router-dom';
// import ForgotPasswordForm from '../ForgotPasswordForm';
// import { authService } from '../../../../services/authService';

// // Mock the authService
// vi.mock('../../../services/authService', () => ({
//   authService: {
//     requestPasswordReset: vi.fn()
//   }
// }));

// // Mock the useNavigate hook
// const mockNavigate = vi.fn();
// vi.mock('react-router', () => ({
//   useNavigate: () => mockNavigate
// }));

// describe('ForgotPasswordForm Component', () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   it('renders the form correctly', () => {
//     render(
//       <BrowserRouter>
//         <ForgotPasswordForm />
//       </BrowserRouter>
//     );

//     expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: /send reset instructions/i })).toBeInTheDocument();
//     expect(screen.getByText(/enter your email address below/i)).toBeInTheDocument();
//   });

//   it('handles form submission with valid email', async () => {
//     // Mock successful API response
//     vi.mocked(authService.requestPasswordReset).mockResolvedValueOnce(undefined);

//     render(
//       <BrowserRouter>
//         <ForgotPasswordForm />
//       </BrowserRouter>
//     );

//     // Fill in the email field
//     const emailInput = screen.getByLabelText(/email/i);
//     fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

//     // Submit the form
//     const submitButton = screen.getByRole('button', { name: /send reset instructions/i });
//     fireEvent.click(submitButton);

//     // Wait for the API call to complete
//     await waitFor(() => {
//       expect(authService.requestPasswordReset).toHaveBeenCalledWith({ email: 'test@example.com' });
//       expect(mockNavigate).toHaveBeenCalledWith('/reset-password?email=test%40example.com');
//     });
//   });

//   it('displays error message when API call fails', async () => {
//     // Mock failed API response
//     vi.mocked(authService.requestPasswordReset).mockRejectedValueOnce(new Error('API Error'));

//     render(
//       <BrowserRouter>
//         <ForgotPasswordForm />
//       </BrowserRouter>
//     );

//     // Fill in the email field
//     const emailInput = screen.getByLabelText(/email/i);
//     fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

//     // Submit the form
//     const submitButton = screen.getByRole('button', { name: /send reset instructions/i });
//     fireEvent.click(submitButton);

//     // Wait for the error message to appear
//     await waitFor(() => {
//       expect(screen.getByText(/failed to request password reset/i)).toBeInTheDocument();
//       expect(mockNavigate).not.toHaveBeenCalled();
//     });
//   });

//   it('disables the form during submission', async () => {
//     // Mock API response with delay to test loading state
//     vi.mocked(authService.requestPasswordReset).mockImplementationOnce(
//       () => new Promise(resolve => setTimeout(resolve, 100))
//     );

//     render(
//       <BrowserRouter>
//         <ForgotPasswordForm />
//       </BrowserRouter>
//     );

//     // Fill in the email field
//     const emailInput = screen.getByLabelText(/email/i);
//     fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

//     // Submit the form
//     const submitButton = screen.getByRole('button', { name: /send reset instructions/i });
//     fireEvent.click(submitButton);

//     // Check that the button is disabled during submission
//     expect(submitButton).toBeDisabled();
//     expect(emailInput).toBeDisabled();

//     // Wait for the API call to complete
//     await waitFor(() => {
//       expect(authService.requestPasswordReset).toHaveBeenCalled();
//     });
//   });
// });
