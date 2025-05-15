import { useEffect, useState } from "react";
import {
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

export function useEventAttendance(eventId: string) {
  const { userData } = useAuth();
  const [attending, setAttending] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const userId = userData?.uid;

  useEffect(() => {
    if (!eventId || !userId) return;

    const ref = doc(db, "events", eventId, "attendees", userId);
    const unsub = onSnapshot(ref, (snap) => {
      setAttending(snap.exists());
      setLoading(false);
    });

    return () => unsub();
  }, [eventId, userId]);

  const toggleAttendance = async (eventName: string) => {
    if (!userId || !userData?.name) return;

    const ref = doc(db, "events", eventId, "attendees", userId);
    if (attending) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, {
        attending: true,
        name: userData.name,
        timestamp: serverTimestamp(),
        uid: userId,
        photoURL: userData.photoURL || "",
      });
    }
  };

  return { attending, toggleAttendance, loading };
}
