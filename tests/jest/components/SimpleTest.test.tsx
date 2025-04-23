import * as React from 'react';
import { render, screen } from '@testing-library/react';

// A simple test component that doesn't depend on your actual code
const SimpleComponent = () => {
  return <div>Hello, Testing World!</div>;
};

describe('Simple Component Test', () => {
  it('renders without crashing', () => {
    render(<SimpleComponent />);
    expect(screen.getByText('Hello, Testing World!')).toBeInTheDocument();
  });
});
