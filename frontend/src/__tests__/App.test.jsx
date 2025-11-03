import { describe, test, expect, vi, afterAll, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
vi.mock('../utils/formatTime', () => ({
  default: (seconds) => 'mocked time', 
}));

vi.mock("./Component/WatchHistory",()=>({
  default:()=><div>WatchHistory</div>
}))

vi.mock("./Component/Monthly",()=>({
  default:()=><div>Monthly data</div>
}))

vi.mock("./Component/Hourly",()=>({
  default:()=><div>Hourly data</div>
}))

vi.mock("./Component/Weekly",()=>({
  default:()=><div>Weekly data</div>
})) 

// src/__tests__/App.test.jsx
beforeAll(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ totalWatchTime: 0, totalShorts: 0, records: [] }),
    })
  );
});

afterAll(() => {
  vi.restoreAllMocks();
});


describe("Homepage", () => {
  test("Homepage is testing", () => {
    render(<App />);
    const Heading = screen.getByText(/WatchTracker/i);
    expect(Heading).toBeInTheDocument();
  });
});

describe("Routes",()=>{
  test("renders Component WatchHistory",async()=>{
    render(
        <App />
    );
    const navLink = screen.getByRole('link', { name: /WatchHistory/i });
    expect(navLink).toBeInTheDocument();
    await userEvent.click(navLink);
    const lazyContent = await screen.findByText(/WatchHistory/i, {}, { timeout: 2000 });
    expect(lazyContent).toBeInTheDocument();
  })
  test("renders Component Monthly",async()=>{
    render(
        <App />
    );
    const navLink = screen.getByRole('link', { name: /Monthly/i });
    expect(navLink).toBeInTheDocument();
    await userEvent.click(navLink);
    const lazyContent = await screen.findByText(/Monthly/i, {}, { timeout: 2000 });
    expect(lazyContent).toBeInTheDocument();
  })
  test("renders Component Weekly",async()=>{
    render(
        <App />
    );
    const navLink = screen.getByRole('link', { name: /Weekly/i });
    expect(navLink).toBeInTheDocument();
    await userEvent.click(navLink);
    const lazyContent = await screen.findByText(/Weekly/i, {}, { timeout: 2000 });
    expect(lazyContent).toBeInTheDocument();
  })
  test("renders Component Hourly",async()=>{
    render(
        <App />
    );
    const navLink = screen.getByRole('link', { name: /Hourly/i });
    expect(navLink).toBeInTheDocument();
    await userEvent.click(navLink);
    const lazyContent = await screen.findByText(/Hourly/i, {}, { timeout: 2000 });
    expect(lazyContent).toBeInTheDocument();
  })
})
