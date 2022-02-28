import { render, screen, fireEvent } from "@testing-library/react";
import { SubscribeButton } from ".";
import { mocked } from "ts-jest/utils";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

jest.mock("next-auth/react");
jest.mock("next/router");

describe("Sbscribe button component", () => {
  describe("Sbscribe button component", () => {
    const useMockedSession = mocked(useSession);
    useMockedSession.mockReturnValueOnce({
      status: "unauthenticated",
      data: null,
    });
    it("renders correctly", () => {
      render(<SubscribeButton />);

      expect(screen.getByText("Subscribe now")).toBeInTheDocument();
    });
  });
  it("redirects to signIn when user not authenticated", () => {
    const signInMocked = mocked(signIn);
    const useMockedSession = mocked(useSession);
    useMockedSession.mockReturnValueOnce({
      status: "unauthenticated",
      data: null,
    });
    render(<SubscribeButton />);
    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);
    expect(signInMocked).toBeCalled();
  });

  it("should push user to posts page", () => {
    const pushMock = jest.fn();
    const useMockedSession = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    useMockedSession.mockReturnValueOnce({
      status: "authenticated",
      data: {
        expires: "1",
        activeUser: "fake-active",
        user: {
          name: "Gabriel",
        },
      },
    });

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);
    render(<SubscribeButton />);
    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);
    expect(pushMock).toHaveBeenCalledWith("/posts");
  });
});
