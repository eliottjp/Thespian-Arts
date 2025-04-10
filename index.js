const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(functions.config().stripe.secret); // Set using: firebase functions:config:set
admin.initializeApp();

exports.createCheckoutSession = functions.https.onCall(
  async (data, context) => {
    const { childId, className, priceId, successUrl, cancelUrl } = data;

    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be signed in"
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: context.auth.token.email,
      line_items: [
        {
          price: priceId, // This is your Stripe Price ID (not the amount!)
          quantity: 1,
        },
      ],
      metadata: {
        userId: context.auth.uid,
        childId,
        className,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return {
      id: session.id,
      url: session.url,
    };
  }
);
