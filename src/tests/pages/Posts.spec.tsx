import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import Posts, { getStaticProps } from "../../pages/posts";
import { getPrismicClient } from "../../services/prismic";

const posts = [
  {
    slug: "new-post",
    title: "My new post",
    excerpt: "new post",
    updatedAt: "10 Março",
  },
];
jest.mock("next-auth/react", () => {
  return {
    useSession() {
      return {
        session: null,
      };
    },
  };
});

jest.mock("../../services/prismic");
describe("Posts page", () => {
  it("should render correctly", () => {
    render(<Posts posts={posts} />);
    expect(screen.getByText("My new post")).toBeInTheDocument();
  });

  it("should load data from prismic", async () => {
    const mockedPrismic = mocked(getPrismicClient);
    mockedPrismic.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: "my-new-post",
            data: {
              title: [{ type: "heading", text: "O título top" }],
              content: [{ type: "paragraph", text: "Oopa tudo certo?" }],
            },
            last_publication_date: "04-01-2022",
          },
        ],
      }),
    } as any);
    const response = await getStaticProps({});
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: "my-new-post",
              title: "O título top",
              excerpt: "Oopa tudo certo?",
              updatedAt: "01 de abril de 2022",
            },
          ],
        },
      })
    );
  });

  // it("loads inital data", async () => {
  //   const mockedStripePrice = mocked(stripe.prices.retrieve);
  //   mockedStripePrice.mockResolvedValueOnce({
  //     id: "fakeId",
  //     unit_amount: 1000,
  //   } as any);
  //   const response = await getStaticProps({});
  //   console.log(response);
  //   expect(response).toEqual(
  //     expect.objectContaining({
  //       props: {
  //         product: {
  //           priceId: "fakeId",
  //           amount: "$10.00",
  //         },
  //       },
  //     })
  //   );
  // });
});
