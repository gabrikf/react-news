import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import Home, { getStaticProps } from "../../pages";
import { stripe } from "../../services/stripe";

jest.mock("next/router");
jest.mock("../../services/stripe");
jest.mock("next-auth/react", () => {
  return {
    useSession() {
      return {
        session: null,
      };
    },
  };
});

describe("Home page", () => {
  it("should render correctly", () => {
    const { debug } = render(
      <Home
        product={{
          amount: "R$10,00",
          priceId: "fake-priceId",
        }}
      />
    );
    expect(screen.getByText("for R$10,00 month")).toBeInTheDocument();
  });

  it("loads inital data", async () => {
    const mockedStripePrice = mocked(stripe.prices.retrieve);
    mockedStripePrice.mockResolvedValueOnce({
      id: "fakeId",
      unit_amount: 1000,
    } as any);
    const response = await getStaticProps({});
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: "fakeId",
            amount: "$10.00",
          },
        },
      })
    );
  });
});
