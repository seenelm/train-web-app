
// import { describe, expect, vi, beforeEach } from 'vitest';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { BrowserRouter } from 'react-router';
// import Sidebar from '../Sidebar';
// import { AiOutlineHome, AiOutlineUser, AiOutlineSetting } from 'react-icons/ai';
// import { authService } from '../../../services/authService';

// // Mock the services
// vi.mock('../../../services/authService', () => ({
//   authService: {
//     logout: vi.fn().mockResolvedValue({}),
//   },
// }));

// vi.mock('../../../services/tokenService', () => ({
//   tokenService: {
//     getDeviceId: vi.fn().mockReturnValue('test-device-id'),
//     getRefreshToken: vi.fn().mockReturnValue('test-refresh-token'),
//   },
// }));

// // Mock the useNavigate hook
// const mockNavigate = vi.fn();
// vi.mock('react-router-dom', async () => {
//   const actual = await vi.importActual('react-router-dom');
//   return {
//     ...actual,
//     useNavigate: () => mockNavigate,
//   };
// });

// // Mock window.innerWidth for testing mobile behavior
// Object.defineProperty(window, 'innerWidth', {
//   writable: true,
//   configurable: true,
//   value: 1024, // Default to desktop width
// });

// // Sample tabs for testing
// const mockTabs = [
//   { id: 'home', label: 'Home', icon: <AiOutlineHome /> },
//   { id: 'profile', label: 'Profile', icon: <AiOutlineUser /> },
//   { id: 'settings', label: 'Settings', icon: <AiOutlineSetting /> },
// ];

// const renderSidebar = (props = {}) => {
//   const defaultProps = {
//     tabs: mockTabs,
//     onTabChange: vi.fn(),
//     defaultActiveTab: 'home',
//   };

//   return render(
//     <BrowserRouter>
//       <Sidebar {...defaultProps} {...props} />
//     </BrowserRouter>
//   );
// };

// describe('Sidebar Component', () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   test('renders correctly with default props', () => {
//     renderSidebar();
    
//     // Check if logo is rendered
//     expect(screen.getByAltText('Train Logo')).toBeInTheDocument();
    
//     // Check if all tabs are rendered
//     mockTabs.forEach(tab => {
//       expect(screen.getByTitle(tab.label)).toBeInTheDocument();
//     });
    
//     // Check if sign out button is rendered
//     expect(screen.getByTitle('Sign Out')).toBeInTheDocument();
//   });

//   test('activates the correct tab on click', () => {
//     const onTabChange = vi.fn();
//     renderSidebar({ onTabChange });
    
//     // Click on the second tab
//     fireEvent.click(screen.getByTitle('Profile'));
    
//     // Check if onTabChange was called with the correct tab id
//     expect(onTabChange).toHaveBeenCalledWith('profile');
//   });

//   test('toggles sidebar expansion when toggle button is clicked', () => {
//     renderSidebar();
    
//     const sidebar = screen.getByRole('complementary', { hidden: true }) || document.querySelector('.sidebar');
//     expect(sidebar).toHaveClass('collapsed');
    
//     // Click on the toggle button
//     const toggleButton = screen.getByText('»');
//     fireEvent.click(toggleButton);
    
//     // Check if sidebar is expanded
//     expect(sidebar).toHaveClass('expanded');
    
//     // Click again to collapse
//     const collapseButton = screen.getByText('«');
//     fireEvent.click(collapseButton);
    
//     // Check if sidebar is collapsed again
//     expect(sidebar).toHaveClass('collapsed');
//   });

//   test('calls logout service and navigates to login page on sign out', async () => {
//     renderSidebar();
    
//     // Click on sign out button
//     fireEvent.click(screen.getByTitle('Sign Out'));
    
//     // Wait for the async logout process
//     await waitFor(() => {
//       // Check if logout was called with correct params
//       expect(authService.logout).toHaveBeenCalledWith({
//         deviceId: 'test-device-id',
//         refreshToken: 'test-refresh-token',
//       });
      
//       // Check if navigation happened
//       expect(mockNavigate).toHaveBeenCalledWith('/login');
//     });
//   });

//   test('closes sidebar on mobile after clicking a tab', () => {
//     // Set window width to mobile size
//     window.innerWidth = 768;
    
//     renderSidebar();
    
//     // First expand the sidebar
//     fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    
//     const sidebar = screen.getByRole('complementary', { hidden: true }) || document.querySelector('.sidebar');
//     expect(sidebar).toHaveClass('expanded');
    
//     // Click on a tab
//     fireEvent.click(screen.getByTitle('Profile'));
    
//     // Check if sidebar is collapsed
//     expect(sidebar).toHaveClass('collapsed');
    
//     // Reset window width
//     window.innerWidth = 1024;
//   });

//   test('handles click outside to close expanded sidebar', () => {
//     renderSidebar();
    
//     // First expand the sidebar
//     fireEvent.click(screen.getByText('»'));
    
//     const sidebar = screen.getByRole('complementary', { hidden: true }) || document.querySelector('.sidebar');
//     expect(sidebar).toHaveClass('expanded');
    
//     // Simulate click outside
//     fireEvent.mouseDown(document);
    
//     // Check if sidebar is collapsed
//     expect(sidebar).toHaveClass('collapsed');
//   });
// });