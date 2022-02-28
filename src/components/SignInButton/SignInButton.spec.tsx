import { render, screen, fireEvent } from "@testing-library/react";
import { SignInButton } from ".";
import { mocked } from "ts-jest/utils";
import { useSession, signOut, signIn } from "next-auth/react";

jest.mock("next-auth/react");

describe("Signin Button component", () => {
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

  it("should call signout fn when user click", () => {
    const mockedSigOut = mocked(signOut);
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
    const mockedButton = screen.getByText("@Gabriel");
    fireEvent.click(mockedButton);

    expect(mockedSigOut).toBeCalled();
  });

  it("should call signinFn when click", () => {
    const mockedSigOut = mocked(signIn);
    useMockedSession.mockReturnValueOnce({
      status: "unauthenticated",
      data: null,
    });

    render(<SignInButton />);
    const mockedButton = screen.getByText("Sign in with Github");
    fireEvent.click(mockedButton);

    expect(mockedSigOut).toBeCalled();
  });
});
