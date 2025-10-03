import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

vi.mock('../utils/formatTime', () => ({
  default: (seconds) => 'mocked time', 
}));

describe("Homepage", () => {
  it("Homepage is testing", () => {
    render(<App />);
    const Heading = screen.getByText(/WatchTracker/i);
    expect(Heading).toBeInTheDocument();
  });
});

