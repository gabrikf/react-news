import { signIn, useSession } from "next-auth/react";
import { api } from "../../services/api";
import { getStrpeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";
interface SubscibeButtonProps {
  priceId: string;
}
export function SubscribeButton({ priceId }: SubscibeButtonProps) {
  const { data: session } = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn();
      return;
    }
    try {
      const response = await api.post("/subscribe");
      const { sessionId } = response.data;

      const stripe = await getStrpeJs();
      console.log(sessionId);
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
