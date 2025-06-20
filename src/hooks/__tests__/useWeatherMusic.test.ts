import { getWeatherMood } from "@/lib/music-utils";

describe("getWeatherMood", () => {
  it("should return a mood based on weather conditions", () => {
    const mood = getWeatherMood({ main: "Clear" });
    expect(mood).toBe("upbeat");
  });

  it("should return 'mellow' for rainy weather", () => {
    const mood = getWeatherMood({ main: "Rain" });
    expect(mood).toBe("mellow");
  });
});