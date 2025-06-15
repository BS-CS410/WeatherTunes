import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WeatherDisplay } from "../WeatherDisplay";
import type { WeatherDisplayData } from "../../types/weather";

describe("WeatherDisplay", () => {
  it("should render weather information", () => {
    const weatherData: WeatherDisplayData = {
      location: "San Francisco",
      temperature: "20",
      condition: "clear sky",
      unit: "°C",
      sunrise: "6:30am",
      sunset: "7:45pm",
      isError: false,
    };

    render(<WeatherDisplay weatherData={weatherData} />);

    expect(screen.getByText("San Francisco")).toBeInTheDocument();
    expect(screen.getByText("20°C")).toBeInTheDocument();
    expect(screen.getByText("clear sky")).toBeInTheDocument();
    expect(screen.getByText("6:30am")).toBeInTheDocument();
    expect(screen.getByText("7:45pm")).toBeInTheDocument();
  });

  it("should show loading state", () => {
    const weatherData: WeatherDisplayData = {
      location: "Loading...",
      temperature: "--",
      condition: "Loading...",
      unit: "°",
      sunrise: "--",
      sunset: "--",
      isError: false,
    };

    render(<WeatherDisplay weatherData={weatherData} />);

    const loadingElements = screen.getAllByText("Loading...");
    expect(loadingElements.length).toBeGreaterThan(0);
    expect(screen.getByText("--°")).toBeInTheDocument();
  });

  it("should show error state", () => {
    const weatherData: WeatherDisplayData = {
      location: "Unable to load weather",
      temperature: "--",
      condition: "Weather unavailable",
      unit: "°",
      sunrise: "--",
      sunset: "--",
      isError: true,
    };

    render(<WeatherDisplay weatherData={weatherData} />);

    expect(screen.getByText("Unable to load weather")).toBeInTheDocument();
    expect(screen.getByText("Weather unavailable")).toBeInTheDocument();
  });

  it("should display temperature with correct unit", () => {
    const weatherData: WeatherDisplayData = {
      location: "New York",
      temperature: "75",
      condition: "sunny",
      unit: "°F",
      sunrise: "6:00am",
      sunset: "8:00pm",
      isError: false,
    };

    render(<WeatherDisplay weatherData={weatherData} />);

    expect(screen.getByText("75°F")).toBeInTheDocument();
  });

  it("should handle missing weather data gracefully", () => {
    const weatherData: WeatherDisplayData = {
      location: "",
      temperature: "",
      condition: "",
      unit: "",
      sunrise: "",
      sunset: "",
      isError: false,
    };

    render(<WeatherDisplay weatherData={weatherData} />);

    // Component should render without crashing
    expect(document.querySelector("section")).toBeInTheDocument();
  });
});
