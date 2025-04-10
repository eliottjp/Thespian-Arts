import { db } from "../lib/firebase";
import { setDoc, doc } from "firebase/firestore";

const groups = [
  // Brownhills
  {
    id: "mini-mixers-brownhills",
    name: "Mini Mixers",
    branch: "Brownhills",
    schedule: [{ day: "Monday", time: "16:30", location: "Brownhills" }],
  },
  {
    id: "dance-private-brownhills",
    name: "Dance Private Lessons",
    branch: "Brownhills",
    schedule: [{ day: "Monday", time: "17:30", location: "Brownhills" }],
  },
  {
    id: "dance-group-brownhills",
    name: "Dance Group",
    branch: "Brownhills",
    schedule: [{ day: "Monday", time: "18:00", location: "Brownhills" }],
  },
  {
    id: "guitar-group-brownhills",
    name: "Guitar Group",
    branch: "Brownhills",
    schedule: [{ day: "Monday", time: "18:00", location: "Brownhills" }],
  },
  {
    id: "piano-group-brownhills",
    name: "Piano Group",
    branch: "Brownhills",
    schedule: [
      { day: "Monday", time: "19:00", location: "Brownhills" },
      { day: "Wednesday", time: "16:30", location: "Brownhills" },
      { day: "Saturday", time: "12:00", location: "Brownhills" },
    ],
  },
  {
    id: "drama-group-brownhills",
    name: "Drama Group",
    branch: "Brownhills",
    schedule: [{ day: "Monday", time: "19:00", location: "Brownhills" }],
  },
  {
    id: "private-lessons-brownhills",
    name: "Private Lessons",
    branch: "Brownhills",
    schedule: [{ day: "Wednesday", time: "17:00", location: "Brownhills" }],
  },
  {
    id: "musical-theatre-group-brownhills",
    name: "Musical Theatre Group",
    branch: "Brownhills",
    schedule: [{ day: "Wednesday", time: "18:30", location: "Brownhills" }],
  },
  {
    id: "vocal-group-brownhills",
    name: "Vocal Group",
    branch: "Brownhills",
    schedule: [{ day: "Saturday", time: "10:00", location: "Brownhills" }],
  },
  {
    id: "guitar-group-saturday-brownhills",
    name: "Guitar Group",
    branch: "Brownhills",
    schedule: [{ day: "Saturday", time: "10:00", location: "Brownhills" }],
  },
  {
    id: "drum-group-brownhills",
    name: "Drum Group",
    branch: "Brownhills",
    schedule: [{ day: "Saturday", time: "11:00", location: "Brownhills" }],
  },

  // Great Barr
  {
    id: "dance-group-great-barr",
    name: "Dance Group",
    branch: "Great Barr",
    schedule: [{ day: "Tuesday", time: "16:30", location: "Great Barr" }],
  },
  {
    id: "musical-theatre-great-barr",
    name: "Musical Theatre Group",
    branch: "Great Barr",
    schedule: [{ day: "Tuesday", time: "17:30", location: "Great Barr" }],
  },

  // Rugeley
  {
    id: "drama-group-rugeley",
    name: "Drama Group",
    branch: "Rugeley",
    schedule: [{ day: "Thursday", time: "18:00", location: "Rugeley" }],
  },
  {
    id: "musical-theatre-rugeley",
    name: "Musical Theatre Group",
    branch: "Rugeley",
    schedule: [{ day: "Thursday", time: "19:00", location: "Rugeley" }],
  },

  // Pelsall
  {
    id: "mini-mixers-pelsall",
    name: "Mini Mixers",
    branch: "Pelsall",
    schedule: [{ day: "Thursday", time: "16:30", location: "Pelsall" }],
  },
  {
    id: "vocal-group-pelsall",
    name: "Vocal Group",
    branch: "Pelsall",
    schedule: [{ day: "Thursday", time: "16:30", location: "Pelsall" }],
  },
  {
    id: "dance-group-pelsall",
    name: "Dance Group",
    branch: "Pelsall",
    schedule: [
      { day: "Thursday", time: "17:30", location: "Pelsall" },
      { day: "Friday", time: "16:30", location: "Pelsall" },
    ],
  },
  {
    id: "drama-group-pelsall",
    name: "Drama Group",
    branch: "Pelsall",
    schedule: [{ day: "Thursday", time: "18:30", location: "Pelsall" }],
  },
  {
    id: "guitar-group-pelsall",
    name: "Guitar Group",
    branch: "Pelsall",
    schedule: [{ day: "Friday", time: "16:30", location: "Pelsall" }],
  },
  {
    id: "musical-theatre-pelsall",
    name: "Musical Theatre Group",
    branch: "Pelsall",
    schedule: [{ day: "Friday", time: "17:30", location: "Pelsall" }],
  },

  // Ashmore Park
  {
    id: "musical-theatre-ashmore-park",
    name: "Musical Theatre Group",
    branch: "Ashmore Park",
    schedule: [{ day: "Tuesday", time: "17:30", location: "Ashmore Park" }],
  },
];

export async function createAllGroups() {
  for (const group of groups) {
    await setDoc(doc(db, "groups", group.id), group);
  }

  console.log("✅ All groups created in Firestore");
}
