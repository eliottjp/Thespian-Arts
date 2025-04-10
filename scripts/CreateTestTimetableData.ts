import { db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function createTestTimetableData() {
  const childId = "child123";

  // Step 1: Create 2 groups
  await setDoc(doc(db, "groups", "groupA123"), {
    name: "Beginner Drama",
    schedule: [
      { day: "Monday", time: "16:00", location: "Studio 1" },
      { day: "Thursday", time: "17:30", location: "Main Hall" },
    ],
  });

  await setDoc(doc(db, "groups", "groupB456"), {
    name: "Vocal Training",
    schedule: [{ day: "Wednesday", time: "15:00", location: "Studio 2" }],
  });

  // Step 2: Create a child linked to those groups
  await setDoc(doc(db, "users", childId), {
    name: "Sophie Taylor",
    role: "member",
    groups: ["groupA123", "groupB456"],
  });

  console.log("✅ Test child and groups created");
}
