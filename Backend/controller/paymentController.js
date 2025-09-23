import mongoose from "mongoose";
import Payment from "../model/Payment.js";
import Stripe from "stripe";
import ClassCard from "../model/classCard.js";
import PDFDocument from "pdfkit";


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
export const getReceipt = async (req, res) => {
  try {
    const sessionId = req.params.id;
    // Payment එක DB එකේ තියෙනවා කියලා assume කරනවා
    const pay = await Payment.findOne({ session_id: sessionId });
    if (!pay) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=receipt_${sessionId}.pdf`
    );

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(20).text("Payment Receipt", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Receipt ID: ${sessionId}`);
    doc.text(`Payment ID: ${pay.payment_id}`);
    doc.text(`Class: ${pay.class_name}`);
    doc.text(`Amount: ${pay.amount} LKR`);
    doc.text(`Status: ${pay.status}`);
    doc.text(`Created: ${pay.createdAt.toLocaleString()}`);

    doc.moveDown();
    doc.text("Thank you for your payment!", { align: "center" });

    doc.end();
  } catch (err) {
    console.error("Receipt error:", err);
    res.status(500).json({ message: "Failed to generate receipt" });
  }
};
