import mongoose from "mongoose";
import Payment from "../model/Payment.js";
import Stripe from "stripe";
import ClassCard from "../model/classCard.js";

const stripe = new Stripe(process.env.SECRET_KEY);

export const createPayment = async (req, res) => {
  const card_id = req.params.id;
  const card=await ClassCard.findOne({card_id: card_id })
  if (!card) {
    return res.status(404).json({ message: "Class card not found" });
  }
   try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          locale: "en",
          line_items: [
            {
              price_data: {
                currency: "LKR",
                product_data: {
                  name: card.class_name
                },
                unit_amount: card.fee * 100,
              },
              quantity: 1,
            },
          ],
          success_url: `http://localhost:5173/paymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: "http://localhost:5173/paymentFailed",
          metadata: {
            // userId: req.user._id,
            // planId: req.params.id,
          },
        });

        res.json({ id: session.id });
      } catch (error) {
        console.error("Error creating Stripe session:", error);
        return res.status(500).json({ message: "Internal server error" });
      }


  
};
