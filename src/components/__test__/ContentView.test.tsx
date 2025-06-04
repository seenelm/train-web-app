// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import ContentView from '../ContentView';

// describe('ContentView Component', () => {
//   test('renders without crashing', () => {
//     render(
//       <ContentView>
//         <div>Test Content</div>
//       </ContentView>
//     );
    
//     // Check if the component renders
//     const contentElement = document.querySelector('.content-view');
//     expect(contentElement).toBeInTheDocument();
//   });

//   test('renders children correctly', () => {
//     render(
//       <ContentView>
//         <div data-testid="test-child">Child Content</div>
//       </ContentView>
//     );
    
//     // Check if children are rendered inside the component
//     const childElement = screen.getByTestId('test-child');
//     expect(childElement).toBeInTheDocument();
//     expect(childElement).toHaveTextContent('Child Content');
//   });

//   test('applies the correct CSS class', () => {
//     render(
//       <ContentView>
//         <div>Test Content</div>
//       </ContentView>
//     );
    
//     // Check if the component has the correct CSS class
//     const contentElement = document.querySelector('.content-view');
//     expect(contentElement).toHaveClass('content-view');
//   });

//   test('renders multiple children correctly', () => {
//     render(
//       <ContentView>
//         <div data-testid="child-1">First Child</div>
//         <div data-testid="child-2">Second Child</div>
//         <div data-testid="child-3">Third Child</div>
//       </ContentView>
//     );
    
//     // Check if all children are rendered
//     expect(screen.getByTestId('child-1')).toBeInTheDocument();
//     expect(screen.getByTestId('child-2')).toBeInTheDocument();
//     expect(screen.getByTestId('child-3')).toBeInTheDocument();
    
//     // Check content of children
//     expect(screen.getByTestId('child-1')).toHaveTextContent('First Child');
//     expect(screen.getByTestId('child-2')).toHaveTextContent('Second Child');
//     expect(screen.getByTestId('child-3')).toHaveTextContent('Third Child');
//   });
// });