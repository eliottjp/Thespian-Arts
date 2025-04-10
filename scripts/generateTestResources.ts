import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const TEST_GROUP_ID = "groupA";

const SAMPLE_RESOURCES = [
  {
    name: "Welcome Pack",
    type: "pdf",
    url: "https://example.com/welcome-pack.pdf",
  },
  {
    name: "Intro Dance Routine",
    type: "video",
    url: "https://example.com/dance.mp4",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  },
  {
    name: "Warmup Audio",
    type: "audio",
    url: "https://example.com/warmup.mp3",
  },
  {
    name: "Show Poster",
    type: "image",
    url: "https://example.com/poster.jpg",
    thumbnail: "https://example.com/poster-thumb.jpg",
  },
];

export async function generateTestResources() {
  for (const resource of SAMPLE_RESOURCES) {
    await addDoc(collection(db, "groups", TEST_GROUP_ID, "resources"), {
      ...resource,
      uploadedAt: serverTimestamp(),
    });
  }

  console.log("✅ Sample resources added to group:", TEST_GROUP_ID);
}
