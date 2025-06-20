import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import App from '../App';
import { fetchFoodTrucks } from '../api';
import { mockData } from '../utils/mock-data';

jest.mock('../api');

describe('App level testing', () => {
  beforeEach(() => {
    (fetchFoodTrucks as jest.Mock).mockResolvedValue(mockData);
  });

  it('renders food trucks after load', async () => {
    render(<App />);
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading food trucks...');

    await waitFor(() => {
      expect(screen.getByTestId('food-truck-row-123')).toHaveTextContent("Bob's Donut Truck");
      expect(screen.getByTestId('food-truck-row-234')).toHaveTextContent("Tina's Taco Truck");
      expect(screen.getByTestId('food-truck-row-345')).toHaveTextContent("Adam's Breakfast Shack");
    });
  });

  it("When filtering by applicant name, only applicable applicants render", async () => {
    render(<App />);
    
    await screen.findByTestId("food-truck-row-123");
  
    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "bob" },
    });
  
    // Wait for debounce
    await waitFor(() => {
      // The filtered out food trucks should not render
      expect(screen.queryByTestId("food-truck-row-234")).not.toBeInTheDocument();
      expect(screen.queryByTestId("food-truck-row-345")).not.toBeInTheDocument();
  
      // Only the applicable food truck renders
      expect(screen.queryByTestId("food-truck-row-123")).toHaveTextContent("Bob's Donut Truck");
    });
  });

  it("When filtering by address, only applicable applicants render", async () => {
    render(<App />);
    
    await screen.findByTestId("food-truck-row-123");

    fireEvent.click(screen.getByTestId("search-type-dropdown-trigger"));

    const dropdown = screen.getByTestId("search-type-dropdown-menu");
    const addressOption = within(dropdown).getByText("Address");

    fireEvent.click(addressOption);
  
    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "Washington" },
    });
  
    // Wait for debounce
    await waitFor(() => {
      // The filtered out food trucks should not render
      expect(screen.queryByTestId("food-truck-row-234")).not.toBeInTheDocument();
      expect(screen.queryByTestId("food-truck-row-345")).not.toBeInTheDocument();
  
      // Only the applicable food truck renders
      expect(screen.queryByTestId("food-truck-row-556677")).toHaveTextContent("Burger Bus SF");
    });
  });

  it('When filtering by status, only applicable applicants render', async () => {
    render(<App />);

    await screen.findByTestId("food-truck-row-123");

    fireEvent.click(screen.getByTestId("status-dropdown-trigger"));
    fireEvent.click(screen.getByText("Expired"));

    // The food trucks with "Expired status should render"
    expect(screen.queryByTestId("food-truck-row-123")).not.toBeInTheDocument();
    expect(screen.queryByTestId("food-truck-row-234")).toBeInTheDocument();
  });

  it('shows correct pagination count at the top of the table', async () => {
    render(<App />);

    await screen.findByTestId("food-truck-row-123");

    expect(screen.getByTestId('truck-count')).toHaveTextContent('Showing 1–10 of 11');
  });

  it('renders the pagination buttons at the bottom', async () => {
    render(<App />);

    await screen.findByTestId("food-truck-row-123");

    expect(screen.getByTestId('previous-button')).toHaveTextContent('Previous');
    expect(screen.getByTestId('next-button')).toHaveTextContent('Next');
    // previous button is disabled since we are on first page
    expect(screen.getByTestId('previous-button')).toBeDisabled();
    expect(screen.getByTestId('next-button')).toBeEnabled();

    fireEvent.click(screen.getByTestId('next-button'));

    // next button is now disabled since we are on the last page
    expect(screen.getByTestId('previous-button')).toBeEnabled();
    expect(screen.getByTestId('next-button')).toBeDisabled();
  });
});