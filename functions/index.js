const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Stripe = require("stripe");

admin.initializeApp();

const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: "2022-11-15",
});

exports.createCheckoutSession = functions.https.onCall(
  async (data, context) => {
    const { priceId, customerEmail, successUrl, cancelUrl } = data;

    if (!customerEmail || !priceId || !successUrl || !cancelUrl) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing required parameters"
      );
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price: priceId, // Use priceId from Firestore document
            quantity: 1,
          },
        ],
        customer_email: customerEmail,
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      return { url: session.url };
    } catch (error) {
      console.error("Stripe error:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Unable to create checkout session"
      );
    }
  }
);
