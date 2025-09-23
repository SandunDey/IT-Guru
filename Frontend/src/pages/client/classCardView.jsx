import axios from "axios";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


export default function ClassCardList() {
    const [loaded, setLoaded] = useState(false);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        if (!loaded) {
            axios
                .get(import.meta.env.VITE_API_BASE_URL + "/api/card/")
                .then((res) => {
                    setCards(res.data);
                    setLoaded(true);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [loaded]);

    async function handlePayment(id) {
        console.log("Initiate payment for card ID:", id);
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/payment/add/${id}`);
        const session = res.data; // { id: "cs_..." }
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
            sessionId: session.id,
        });
        if (error) console.error("Stripe redirect error:", error.message);
        
    }

    return (
        <div>
            {cards.map((card, index) => (
                <div
                    key={card._id || index}
                    className="border p-4 m-4 bg-white rounded shadow"
                >
                    <p>
                        <span className="font-semibold">Class Name:</span>{" "}
                        {card.class_name}
                    </p>
                    <p>
                        <span className="font-semibold">Fee:</span> LKR {card.fee}
                    </p>
                    <p>
                        <span className="font-semibold">Duration:</span> {card.duration}{" "}
                        days
                    </p>
                    <button onClick={() => { handlePayment(card.card_id) }} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Enroll Now
                    </button>
                </div>
            ))}
        </div>
    );
}
