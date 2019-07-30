import React from "react";
import { StyleSheet, Text, View } from "react-native";
import VideoPlayer from "./VideoPlayer";

export default function App() {
  return (
    <View style={styles.container}>
      <VideoPlayer
        posterUri="https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F605317687_960x540.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png"
        // uri="https://player.vimeo.com/external/193584205.m3u8?s=a44ef137d646b32aaeb0732782d19c59c05be602"
        uri="https://player.vimeo.com/external/193584205.m3u8?s=a44ef137d646b32aaeb0732782d19c59c05be602"
        // uri="https://vimeo.com/265045525"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
