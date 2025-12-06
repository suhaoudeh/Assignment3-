import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Home from '../components/home.jsx';

describe('Home Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    localStorage.getItem.mockReturnValue(null);
  });

  it('renders welcome heading', () => {
    render(<Home />);
    expect(screen.getByText('Welcome to the Home Page')).toBeInTheDocument();
  });

  it('shows intro paragraph', () => {
    render(<Home />);
    expect(screen.getByText(/A quick snapshot of your projects and education/)).toBeInTheDocument();
  });

  it('shows login message when no token is present', () => {
    render(<Home />);
    expect(screen.getByText(/Please log in to view projects/)).toBeInTheDocument();
    expect(screen.getByText(/Log in to view education entries/)).toBeInTheDocument();
  });

  it('shows Projects and Education sections', () => {
    render(<Home />);
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
  });

  it('fetches projects when token is present', async () => {
    const mockToken = 'fake-jwt-token';
    const mockProjects = [
      { _id: '1', name: 'Test Project', description: 'Test description' }
    ];

    localStorage.getItem.mockReturnValue(mockToken);
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProjects,
    });

    render(<Home />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/projects',
        expect.objectContaining({
          headers: { Authorization: `Bearer ${mockToken}` }
        })
      );
    });
  });

  it('fetches education when token is present', async () => {
    const mockToken = 'fake-jwt-token';
    const mockEducation = [
      { _id: '1', degree: 'BSc', institution: 'Test University', startDate: '2020', endDate: '2024' }
    ];

    localStorage.getItem.mockReturnValue(mockToken);
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEducation,
    });

    render(<Home />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/education',
        expect.objectContaining({
          headers: { Authorization: `Bearer ${mockToken}` }
        })
      );
    });
  });

  it('displays error when projects fetch fails', async () => {
    const mockToken = 'fake-jwt-token';
    localStorage.getItem.mockReturnValue(mockToken);
    
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Unauthorized' }),
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/Error: Unauthorized/)).toBeInTheDocument();
    });
  });

  it('renders project list when projects are fetched', async () => {
    const mockToken = 'fake-jwt-token';
    const mockProjects = [
      { _id: '1', name: 'Portfolio App', description: 'My portfolio application' }
    ];

    localStorage.getItem.mockReturnValue(mockToken);
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProjects,
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Portfolio App')).toBeInTheDocument();
      expect(screen.getByText('My portfolio application')).toBeInTheDocument();
    });
  });
});
