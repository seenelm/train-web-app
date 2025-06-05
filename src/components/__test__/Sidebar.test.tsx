import { expect, test, vi } from 'vitest';
import Sidebar from '../Sidebar';
import { render } from '@testing-library/react';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

test('should render Sidebar', () => {
    const { container } = render(
        <Sidebar tabs={[]} onTabChange={() => {}} defaultActiveTab="home" />
    );
    expect(container).toBeInTheDocument();
});