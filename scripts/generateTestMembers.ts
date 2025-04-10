import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase"; // adjust path as needed

const BRANCHES = [
  "Rugeley",
  "Brownhills",
  "Great Barr",
  "Ashmore Park",
  "Pelsall",
];
const NAMES = [
  "Sophie Thomas",
  "Leo Morgan",
  "Ella Patel",
  "Noah Carter",
  "Maya Hughes",
];

const generateLinkCode = () => {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

export async function generateFakeMembers() {
  for (let i = 0; i < NAMES.length; i++) {
    const name = NAMES[i];
    const branch = BRANCHES[i % BRANCHES.length];
    const newMember = {
      uid: `test-member-${i + 1}`,
      name,
      role: "member",
      branch,
      groups: [],
      linkCode: generateLinkCode(),
      parentUid: null,
    };

    await addDoc(collection(db, "users"), newMember);
    console.log(`✅ Added: ${name}`);
  }

  console.log("🎉 Test members added.");
}
