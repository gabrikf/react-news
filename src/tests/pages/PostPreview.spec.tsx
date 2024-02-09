import { render, screen } from "@testing-library/react";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { mocked } from "ts-jest/utils";

import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismic";

jest.mock("next-auth/react");
jest.mock("next/router");
jest.mock("../../services/prismic");
const post = {
  slug: "new-post",
  title: "My new post",
  content: "new post",
  updatedAt: "10 Março",
};

describe("Post preview page", () => {
  it("should render correctly", () => {
    const mockedSession = mocked(useSession);
    mockedSession.mockReturnValueOnce({
      data: null,
      status: null,
    });
    render(<Post post={post} />);
    expect(screen.getByText("My new post")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("should redirect user to main page if he has an subscription", () => {
    const mockedSession = mocked(useSession);
    const mockedPush = jest.fn();
    mockedSession.mockReturnValueOnce({
      data: {
        expires: "1",
        activeUser: "fake-active",
        user: {
          name: "Gabriel",
        },
      },
    } as any);

    const mockedUseRouter = mocked(useRouter);
    mockedUseRouter.mockReturnValueOnce({
      push: mockedPush,
    } as any);
    render(<Post post={post} />);
    expect(mockedPush).toBeCalledWith("/posts/new-post");
  });

  it("should return correctly the data", async () => {
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
    const response = await getStaticProps({
      params: { slug: "new-post" },
    } as any);
    expect(response).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          post: {
            slug: "new-post",
            title: "O título top",
            content: "<p>Oopa tudo certo?</p>",
            updatedAt: "01 de abril de 2022",
          },
        }),
      })
    );
  });
});
