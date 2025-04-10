import { ReactNode, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Animated,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

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
  if (!visible) return null;

  const isNotification = variant === "notification";

  // Animations only for notification variant
  const shimmerAnim = useRef(new Animated.Value(-1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

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

  // ────── Notification Card ──────
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
          {/* Shimmer */}
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

          {title && (
            <Text style={[styles.title, { color: "#fff" }]}>{title}</Text>
          )}
          {description && (
            <Text style={[styles.description, { color: "#ffe6e6" }]}>
              {description}
            </Text>
          )}
          {children}
        </Animated.View>
      </Pressable>
    );
  }

  // ────── Default Card ──────
  return (
    <View style={[styles.card, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {description && <Text style={styles.description}>{description}</Text>}
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
