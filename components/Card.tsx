import { ReactNode, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Animated,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

type CardProps = {
  children?: ReactNode;
  title?: string;
  description?: string;
  style?: ViewStyle;
  variant?: "default" | "notification";
  visible?: boolean;
  onPress?: () => void;
};

export default function Card({
  children,
  title,
  description,
  style,
  variant = "default",
  visible = true,
  onPress,
}: CardProps) {
  const { role } = useAuth(); // 🎯 using computed role
  const [activeAnnouncement, setActiveAnnouncement] = useState<any>(null);

  const isNotification = variant === "notification";

  const shimmerAnim = useRef(new Animated.Value(-1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const showDynamic = isNotification && !title && !description;

  useEffect(() => {
    if (!showDynamic || !role) return;

    const unsub = onSnapshot(collection(db, "announcements"), (snap) => {
      const now = new Date();

      const matching = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((a) => {
          const isInAudience = a.audience?.includes(role);
          const isActive =
            a.startTime.toDate() <= now && now <= a.endTime.toDate();
          return isInAudience && isActive;
        });

      setActiveAnnouncement(matching[0] || null);
    });

    return () => unsub();
  }, [showDynamic, role]);

  useEffect(() => {
    if (isNotification) {
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [isNotification]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-200, 200],
  });

  const handlePress = () => {
    if (!isNotification) return;

    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onPress) onPress();
    });
  };

  const displayTitle = title || activeAnnouncement?.title;
  const displayDescription = description || activeAnnouncement?.description;

  if (!visible || (isNotification && showDynamic && !activeAnnouncement)) {
    return null;
  }

  if (isNotification) {
    return (
      <Pressable onPress={handlePress}>
        <Animated.View
          style={[
            styles.card,
            styles.notification,
            { transform: [{ scale: scaleAnim }] },
            style,
          ]}
        >
          <Animated.View
            pointerEvents="none"
            style={[styles.shimmerOverlay, { transform: [{ translateX }] }]}
          >
            <LinearGradient
              colors={["transparent", "rgba(255,255,255,0.2)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          {displayTitle && (
            <Text style={[styles.title, { color: "#fff" }]}>
              {displayTitle}
            </Text>
          )}
          {displayDescription && (
            <Text style={[styles.description, { color: "#ffe6e6" }]}>
              {displayDescription}
            </Text>
          )}
          {children}
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, style]}>
      {displayTitle && <Text style={styles.title}>{displayTitle}</Text>}
      {displayDescription && (
        <Text style={styles.description}>{displayDescription}</Text>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  notification: {
    backgroundColor: "#d60124",
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    color: "#222",
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
});
