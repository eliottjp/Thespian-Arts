import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function createTestEvents() {
  const events = [
    {
      name: "Summer Showcase",
      date: new Date("2025-07-15T18:30:00Z"),
      location: "Great Barr Theatre",
      notes: "Dress rehearsal same day at 3pm.",
    },
    {
      name: "End of Term Party",
      date: new Date("2025-07-20T17:00:00Z"),
      location: "Brownhills Main Hall",
      notes: "Parents welcome. Bring snacks!",
    },
    {
      name: "Photo Day",
      date: new Date("2025-06-10T16:00:00Z"),
      location: "Pelsall",
      notes: "Wear full uniform.",
    },
    {
      name: "Easter Break Begins",
      date: new Date("2025-04-14T00:00:00Z"),
      location: "All Branches",
      notes: "No classes for 2 weeks.",
    },
    {
      name: "Ashmore Park Show Night",
      date: new Date("2025-05-30T19:00:00Z"),
      location: "Ashmore Park Theatre",
      notes: "",
    },
  ];

  for (const event of events) {
    await addDoc(collection(db, "events"), event);
  }

  console.log("✅ Test events created");
}
