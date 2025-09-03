
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_PUBLISH_KEY);

export default function Checkout() {
    const handleClick = async () => {
    const response = await fetch("http://localhost:3000/api/payment/", {
      method: "POST",
    });
    const session = await response.json();

    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId: session.id });
  };

    return(
        <button onClick={handleClick}>
            ckeck
        </button>
    )


}