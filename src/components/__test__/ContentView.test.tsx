import { expect, test } from 'vitest';
import ContentView from '../ContentView';
import { render } from '@testing-library/react';

test('should render ContentView', () => {
    const { container } = render(
        <ContentView>
            <div>Test Content</div>
        </ContentView>
    );
    expect(container).toBeInTheDocument();
});