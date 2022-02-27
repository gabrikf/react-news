import { GetStaticProps } from "next";
import Head from "next/head";
import { getPrismicClient } from "../../services/prismic";
import styles from "./styles.module.scss";
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";
import Link from "next/link";
import { useSession } from "next-auth/react";
interface Posts {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface PostsProps {
  posts: Posts[];
}

export default function Posts({ posts }: PostsProps) {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Posts | Ignews </title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${session ? post.slug : "preview/" + post.slug}`}
            >
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.query(
    [Prismic.predicates.at("document.type", "post")],
    {
      fetch: ["post.title", "post.content"],
      pageSize: 100,
    }
  );
  const posts = response.results.map((result) => {
    return {
      slug: result.uid,
      title: RichText.asText(result.data.title),
      excerpt:
        result.data.content.find((content) => content.type === "paragraph")
          ?.text ?? "",
      updatedAt: new Date(result.last_publication_date).toLocaleDateString(
        "pt-br",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });
  console.log(posts);
  return {
    props: { posts },
  };
};
