import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "../../services/api";
import { getStrpeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";
interface SubscibeButtonProps {
  priceId: string;
}
export function SubscribeButton({ priceId }: SubscibeButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  async function handleSubscribe() {
    if (!session) {
      signIn();
      return;
    }
    if (session.activeUser) {
      router.push("posts");
      return;
    }
    try {
      const response = await api.post("/subscribe");
      const { sessionId } = response.data;

      const stripe = await getStrpeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <button
      onClick={handleSubscribe}
      type="button"
      className={styles.subscribeButton}
    >
      Subscribe now
    </button>
  );
}
