import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import App from '../../../src/App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Basic test to verify the component renders
  });
});
