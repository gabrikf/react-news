import styles from "./styles.module.scss";
interface SubscibeButtonProps {
  priceId: string;
}
export function SubscribeButton({priceId}: SubscibeButtonProps) {
  return (
    <button type="button" className={styles.subscribeButton}>
      Subscribe now
    </button>
  );
}
