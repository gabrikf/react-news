import { render, screen } from "@testing-library/react";
import { SignInButton } from ".";
import { mocked } from "ts-jest/utils";
import { useSession } from "next-auth/react";

jest.mock("next-auth/react");

describe("Header tests", () => {
  const useMockedSession = mocked(useSession);
  it("renders conrrectly when user is not authenticated", () => {
    useMockedSession.mockReturnValueOnce({
      status: "unauthenticated",
      data: null,
    });

    render(<SignInButton />);
    expect(screen.getByText("Sign in with Github")).toBeInTheDocument();
  });
  it("renders conrrectly when user is  authenticated", () => {
    useMockedSession.mockReturnValueOnce({
      status: "authenticated",

      data: {
        expires: "1",
        user: {
          name: "Gabriel",
        },
      },
    });

    render(<SignInButton />);

    expect(screen.getByText("@Gabriel")).toBeInTheDocument();
  });
});
