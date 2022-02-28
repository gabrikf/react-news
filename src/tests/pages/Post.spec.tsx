import { render, screen } from "@testing-library/react";
import { getSession } from "next-auth/react";
import { mocked } from "ts-jest/utils";

import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismic";

jest.mock("next-auth/react");
jest.mock("../../services/prismic");
const post = {
  slug: "new-post",
  title: "My new post",
  content: "new post",
  updatedAt: "10 Março",
};

describe("Post page", () => {
  it("should render correctly", () => {
    render(<Post post={post} />);
    expect(screen.getByText("My new post")).toBeInTheDocument();
  });

  it("should redirect user if subscription was not found", async () => {
    const sessionMocket = mocked(getSession);
    sessionMocket.mockReturnValueOnce(null);
    const response = await getServerSideProps({
      params: { slug: "my-new-post" },
    } as any);
    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/",
        }),
      })
    );
  });

  it("should return correctly the data", async () => {
    const sessionMocket = mocked(getSession);
    sessionMocket.mockReturnValueOnce({
      activeUser: "fake-user",
    } as any);
    const mockedPrismic = mocked(getPrismicClient);
    mockedPrismic.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: "heading", text: "O título top" }],
          content: [{ type: "paragraph", text: "Oopa tudo certo?" }],
        },
        last_publication_date: "04-01-2022",
      }),
    } as any);
    const response = await getServerSideProps({
      params: { slug: "my-new-post" },
    } as any);
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "my-new-post",
            title: "O título top",
            content: "<p>Oopa tudo certo?</p>",
            updatedAt: "01 de abril de 2022",
          },
        },
      })
    );
  });
});
