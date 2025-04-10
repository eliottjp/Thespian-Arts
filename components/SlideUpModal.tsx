import {
  Animated,
  Modal,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ReactNode, useEffect, useRef } from "react";

type SlideUpModalProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function SlideUpModal({
  visible,
  onClose,
  children,
}: SlideUpModalProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[styles.modal, { transform: [{ translateY: slideAnim }] }]}
      >
        {children}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 1,
  },
  modal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    zIndex: 2,
  },
});
