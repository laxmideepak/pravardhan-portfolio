import { LocalDetails } from "@/components/LocalDetails";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const originalFetch = global.fetch;

describe("LocalDetails", () => {
  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("renders city and temperature with celsius symbol", async () => {
    global.fetch = vi.fn((input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes("ipapi.co/json")) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              latitude: 32.7767,
              longitude: -96.797,
              city: "Dallas",
              region: "Texas",
              country_name: "United States",
              timezone: "America/Chicago",
            }),
            { status: 200 },
          ),
        );
      }

      if (url.includes("api.open-meteo.com/v1/forecast")) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              timezone: "America/Chicago",
              current: { temperature_2m: 23.1 },
            }),
            { status: 200 },
          ),
        );
      }

      if (url.includes("geocoding-api.open-meteo.com/v1/reverse")) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              results: [{ name: "Dallas", admin1: "Texas", country: "United States" }],
            }),
            { status: 200 },
          ),
        );
      }

      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    }) as typeof fetch;

    render(<LocalDetails />);

    await waitFor(() => {
      expect(screen.getByText(/°C/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Dallas/i)).toBeInTheDocument();
  });
});
