import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function BadgeSummary() {
  const { userData } = useAuth();
  const [points, setPoints] = useState<number>(0);
  const [badges, setBadges] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  // Card wiggle animations
  const wiggle1 = useRef(new Animated.Value(0)).current;
  const wiggle2 = useRef(new Animated.Value(0)).current;
  const wiggle3 = useRef(new Animated.Value(0)).current;

  // Emoji bounce animations
  const bounce1 = useRef(new Animated.Value(1)).current;
  const bounce2 = useRef(new Animated.Value(1)).current;
  const bounce3 = useRef(new Animated.Value(1)).current;

  const triggerAnimations = (
    wiggle: Animated.Value,
    bounce: Animated.Value
  ) => {
    wiggle.setValue(0);
    bounce.setValue(1);

    Animated.parallel([
      // Wiggle animation
      Animated.sequence([
        Animated.timing(wiggle, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(wiggle, {
          toValue: -1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(wiggle, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      // Emoji bounce animation
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: 1.3,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  useEffect(() => {
    if (!userData?.uid) return;

    const unsub = onSnapshot(doc(db, "members", userData.uid), (snap) => {
      const data = snap.data();
      setPoints(data?.points || 0);
      setBadges(data?.badges || 0);
      setStreak(data?.streak || 0);
    });

    return () => unsub();
  }, [userData?.uid]);

  return (
    <View style={styles.badgeRow}>
      <TouchableWithoutFeedback
        onPress={() => triggerAnimations(wiggle1, bounce1)}
      >
        <Animated.View
          style={[
            styles.badgeCard,
            {
              transform: [
                {
                  rotate: wiggle1.interpolate({
                    inputRange: [-1, 1],
                    outputRange: ["-5deg", "5deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.Text
            style={[
              styles.badgeEmoji,
              {
                transform: [{ scale: bounce1 }],
              },
            ]}
          >
            🏅
          </Animated.Text>
          <Text style={styles.badgeText}>{badges} Badges</Text>
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        onPress={() => triggerAnimations(wiggle2, bounce2)}
      >
        <Animated.View
          style={[
            styles.badgeCard,
            {
              transform: [
                {
                  rotate: wiggle2.interpolate({
                    inputRange: [-1, 1],
                    outputRange: ["-5deg", "5deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.Text
            style={[
              styles.badgeEmoji,
              {
                transform: [{ scale: bounce2 }],
              },
            ]}
          >
            🔥
          </Animated.Text>
          <Text style={styles.badgeText}>{streak} Week Streak</Text>
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        onPress={() => triggerAnimations(wiggle3, bounce3)}
      >
        <Animated.View
          style={[
            styles.badgeCard,
            {
              transform: [
                {
                  rotate: wiggle3.interpolate({
                    inputRange: [-1, 1],
                    outputRange: ["-5deg", "5deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.Text
            style={[
              styles.badgeEmoji,
              {
                transform: [{ scale: bounce3 }],
              },
            ]}
          >
            💰
          </Animated.Text>
          <Text style={styles.badgeText}>{points} Points</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  badgeCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  badgeEmoji: {
    fontSize: 26,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },
});
