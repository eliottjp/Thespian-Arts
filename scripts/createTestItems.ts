import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";

const items = [
  {
    id: "bottle",
    name: "Water Bottle",
    cost: 50,
    emoji: "🥤",
    imageURL: "https://example.com/bottle.jpg", // optional
  },
  {
    id: "tshirt",
    name: "T-Shirt",
    cost: 100,
    emoji: "👕",
  },
  {
    id: "stickers",
    name: "Sticker Pack",
    cost: 20,
    emoji: "📦",
  },
];

async function seedItems() {
  const ref = collection(db, "store", "config", "items");
  for (const item of items) {
    await setDoc(doc(ref, item.id), item);
  }
}
