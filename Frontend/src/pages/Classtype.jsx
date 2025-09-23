import { motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function ClassCards() {
  const [classes, setClasses] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate(); // <-- correct usage

  useEffect(() => {
    if (!loaded) {
      axios
        .get(import.meta.env.VITE_API_BASE_URL + "/api/card/")
        .then((res) => {
          setClasses(res.data);
          setLoaded(true);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [loaded]);

  async function handlePayment(id) {
    console.log("Initiate payment for card ID:", id);
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/payment/add/${id}`
    );
    const session = res.data; // { id: "cs_..." }
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    if (error) console.error("Stripe redirect error:", error.message);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-10">
        ITGuru Classes
      </h1>

      <div className="grid gap-8 md:grid-cols-3">
        {classes.map((cls, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="relative group bg-white rounded-2xl shadow-xl p-6 cursor-pointer overflow-hidden"
          >
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-20 transition duration-500"></div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-lg shadow-md group-hover:bg-blue-600 group-hover:text-white transition">
                {cls.class_name}
              </div>
              <h2 className="text-xl font-semibold text-blue-700 group-hover:text-blue-900 transition">
                {cls.fee}
              </h2>
              <p className="text-gray-500">LKR.{cls.fee}</p>

              {/* Pay button */}
              <button
                onClick={() => handlePayment(cls.card_id)}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 transition"
              >
                Pay Here
              </button>

              {/* View Class button */}
              <button
                onClick={() => navigate(`/class/${cls.card_id}`)} // <-- fixed
                className="px-5 py-2 rounded-lg bg-green-600 text-white font-medium shadow-md hover:bg-green-700 transition"
              >
                View Class
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
