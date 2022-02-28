import Head from "next/head";
import { GetStaticProps } from "next";
import { SubscribeButton } from "../components/SubscribeButton";
import styles from "./home.module.scss";
import { stripe } from "../services/stripe";

// 3 formats of apis's calls

//client side
//server side
//static site generation
interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        {" "}
        <title>ig news início </title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hail, welcome!</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications
            <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton />
        </section>
        <img src="/images/avatar.svg" alt="Girl Coding" />
      </main>
    </>
  );
}

// everething that a use here will hsappen in snode server, not in browser
export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1K0tHmGCQHtsbFUAjY3gGqvn", {
    expand: ["product"], // get all product's info
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };
  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 60 * 60 = 1hr * 24 = 1d
  };
};

// export const getServerSideProps: GetServerSideProps = async () => {
//   const price = await stripe.prices.retrieve('price_1K0tHmGCQHtsbFUAjY3gGqvn',{
//     expand:['product'] // get all product's info
//   })

//   const product = {
//     priceId: price.id,
//     amount: new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency:'USD'
//     }).format((price.unit_amount / 100)),

//   }
//   return {
//      props:{
//       product
//      }
//   }
// }
