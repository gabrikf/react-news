import { render, screen } from "@testing-library/react";
import { Header } from ".";

jest.mock("next-auth/react", () => {
  return {
    useSession() {
      return {
        session: {
          user: {
            name: "Gabriel",
          },
        },
      };
    },
  };
});
describe("Header tests", () => {
  it("should render header component", () => {
    render(<Header />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Posts")).toBeInTheDocument();
  });
});
