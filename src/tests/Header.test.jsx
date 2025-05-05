// tests/Header.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Header from '../components/Header';
import { useApp } from '../context/AppContext';
import { BrowserRouter } from 'react-router-dom';

// Mock the useApp hook
jest.mock('@/context/AppContext', () => ({
  useApp: jest.fn()
}));

// Mock MUI icons to prevent file handle issues
jest.mock('@mui/icons-material/Menu', () => () => <div>MenuIcon</div>);

describe('Header Component', () => {
  const mockLogout = jest.fn();
  
  const setup = (user = null) => {
    useApp.mockReturnValue({
      user,
      logout: mockLogout
    });
    
    return render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the logo and title', () => {
    setup();
    expect(screen.getByText('Economics Tracker')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Economics Tracker' })).toHaveAttribute('href', '/dashboard');
  });

  describe('when user is not logged in', () => {
    beforeEach(() => setup());

    it('shows login and register buttons', () => {
      expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/login');
      expect(screen.getByRole('link', { name: 'Register' })).toHaveAttribute('href', '/register');
    });

    it('does not show user avatar or menu', () => {
      expect(screen.queryByRole('button', { name: /user/i })).not.toBeInTheDocument();
    });
  });

  describe('when user is logged in', () => {
    const mockUser = {
      firstName: 'John',
      roles: ['User']
    };

    beforeEach(() => setup(mockUser));

    it('shows user avatar with first initial', () => {
      expect(screen.getByText('J')).toBeInTheDocument();
    });

    it('opens user menu when avatar is clicked', async () => {
      const avatarButton = screen.getByRole('button', { name: /user/i });
      fireEvent.click(avatarButton);
      
      await waitFor(() => {
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
      });
    });

    it('calls logout when logout menu item is clicked', async () => {
      fireEvent.click(screen.getByRole('button', { name: /user/i }));
      fireEvent.click(await screen.findByText('Logout'));
      
      expect(mockLogout).toHaveBeenCalled();
    });

    describe('on mobile view', () => {
      beforeEach(() => {
        // Mock mobile view
        useMediaQuery.mockImplementation(() => true);
        setup(mockUser);
      });

      it('shows mobile menu button', () => {
        expect(screen.getByText('MenuIcon')).toBeInTheDocument();
      });

      it('opens mobile drawer when menu button is clicked', async () => {
        fireEvent.click(screen.getByText('MenuIcon'));
        
        await waitFor(() => {
          expect(screen.getByText('Dashboard')).toBeInTheDocument();
          expect(screen.getByText('Regions')).toBeInTheDocument();
          expect(screen.getByText('Profile')).toBeInTheDocument();
        });
      });
    });

    describe('when user is admin', () => {
      const adminUser = {
        firstName: 'Admin',
        roles: ['Admin']
      };

      beforeEach(() => setup(adminUser));

      it('shows admin link in desktop nav', () => {
        // Mock desktop view
        useMediaQuery.mockImplementation(() => false);
        setup(adminUser);
        
        expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/admin');
      });

      it('shows admin link in mobile drawer', async () => {
        fireEvent.click(screen.getByText('MenuIcon'));
        expect(await screen.findByText('Admin')).toBeInTheDocument();
      });
    });
  });
});