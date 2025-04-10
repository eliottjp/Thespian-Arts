import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import Screen from "../../../../components/Screen";
import Title from "../../../../components/Title";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEvent } from "expo";
import { Audio } from "expo-av";
import { useRef, useState, useEffect } from "react";

export default function ViewResourceScreen() {
  const router = useRouter();
  const { name, type, url } = useLocalSearchParams<{
    name: string;
    type: string;
    url: string;
  }>();

  // 🎥 Video Setup
  const videoPlayer = useVideoPlayer(url, (player) => {
    player.loop = false;
  });

  const { isPlaying: isVideoPlaying } = useEvent(videoPlayer, "playingChange", {
    isPlaying: videoPlayer.playing,
  });

  // 🎵 Audio Setup
  const sound = useRef<Audio.Sound | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    return () => {
      if (sound.current) sound.current.unloadAsync();
    };
  }, []);

  const handleAudioPlayPause = async () => {
    if (!sound.current) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );
      sound.current = newSound;

      sound.current.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        setPosition(status.positionMillis || 0);
        setDuration(status.durationMillis || 0);
        setIsAudioPlaying(status.isPlaying || false);
      });
    } else {
      const status = await sound.current.getStatusAsync();
      if (status.isPlaying) {
        await sound.current.pauseAsync();
      } else {
        await sound.current.playAsync();
      }
    }
  };

  const handleRestart = async () => {
    if (sound.current) {
      await sound.current.setPositionAsync(0);
      await sound.current.playAsync();
    }
  };

  const handleStop = async () => {
    if (sound.current) {
      await sound.current.stopAsync();
      await sound.current.setPositionAsync(0);
      setIsAudioPlaying(false);
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={router.back}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.badge}>{type?.toUpperCase()}</Text>
        </View>

        <Title>{name}</Title>

        {type === "video" && (
          <>
            <VideoView
              style={styles.video}
              player={videoPlayer}
              allowsFullscreen
              allowsPictureInPicture
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                isVideoPlaying ? videoPlayer.pause() : videoPlayer.play()
              }
            >
              <Text style={styles.buttonText}>
                {isVideoPlaying ? "⏸ Pause Video" : "▶️ Play Video"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {type === "image" && (
          <Image
            source={{ uri: url }}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        {type === "audio" && (
          <View style={styles.audioContainer}>
            <Text style={styles.info}>🎵 Audio Preview</Text>
            <View style={styles.audioControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleAudioPlayPause}
              >
                <Text style={styles.controlText}>
                  {isAudioPlaying ? "⏸ Pause" : "▶️ Play"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleRestart}
              >
                <Text style={styles.controlText}>⏪ Restart</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleStop}
              >
                <Text style={styles.controlText}>⏹ Stop</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.info}>
              {formatTime(position)} / {formatTime(duration)}
            </Text>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progress,
                  { width: `${(position / duration) * 100 || 0}%` },
                ]}
              />
            </View>
          </View>
        )}

        {type === "pdf" && (
          <View style={styles.pdfContainer}>
            <Text style={styles.info}>
              📄 PDF preview not supported — tap below to open in browser.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (url) {
                  Platform.OS === "web"
                    ? window.open(url, "_blank")
                    : router.push({ pathname: url });
                }
              }}
            >
              <Text style={styles.buttonText}>Open PDF</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  back: {
    color: "#d60124",
    fontWeight: "600",
    fontSize: 16,
  },
  badge: {
    backgroundColor: "#eee",
    color: "#555",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "600",
  },
  video: {
    width: "100%",
    height: Dimensions.get("window").width * 0.56,
    borderRadius: 10,
    marginTop: 16,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginTop: 16,
  },
  button: {
    backgroundColor: "#d60124",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  info: {
    marginTop: 16,
    fontSize: 14,
    color: "#333",
  },
  audioContainer: {
    marginTop: 20,
    backgroundColor: "#fafafa",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  audioControls: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    gap: 10,
  },
  controlButton: {
    backgroundColor: "#d60124",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  controlText: {
    color: "#fff",
    fontWeight: "600",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#ddd",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 10,
  },
  progress: {
    height: 6,
    backgroundColor: "#d60124",
  },
  pdfContainer: {
    backgroundColor: "#f7f7f7",
    padding: 16,
    borderRadius: 14,
    marginTop: 20,
  },
});
