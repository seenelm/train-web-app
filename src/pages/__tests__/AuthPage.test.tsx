import { expect, vi, test} from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { mockReactRouterDom } from '../../common/mocks/mocks';
import AuthPage from '../AuthPage';

// Mock useNavigate
vi.mock('react-router-dom', () => ({
    ...vi.importActual('react-router-dom'),
    useNavigate: () => mockReactRouterDom.useNavigate(),
    useLocation: () => mockReactRouterDom.useLocation(),
    Link: (props: any) => mockReactRouterDom.Link(props)
}));

test('should render AuthPage', () => {
    render(
        <BrowserRouter>
            <AuthPage authType="login" />
        </BrowserRouter>
    );
    const container = document.body;
    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent('Welcome Back');
    expect(container).toHaveTextContent('Please sign in to continue');
    expect(container).toHaveTextContent('Don\'t have an account?');
    expect(container).toHaveTextContent('Remember me');
    expect(container).toHaveTextContent('Forgot password?');
    expect(container).toHaveTextContent('By signing in, you agree to our Privacy Policy and Terms of Service.');
});
