import {
  View,
  Modal,
  Text,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: (e?: GestureResponderEvent) => void;
  title: string;
  message: string;
};

export default function CustomModal({
  visible,
  onClose,
  title,
  message,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <Pressable onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 14,
    width: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: "#444",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#d60124",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
