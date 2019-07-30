import React, { Component } from "react";
import { Video } from "expo-av";
import {
  TouchableHighlight,
  StyleSheet,
  Image,
  View,
  NetInfo,
  Text
} from "react-native";
import { getDimensions, getIsLandscape } from "./util";

type Props = {
  horizontalMargin: number;
  posterUri: string;
  uri: string;
};

type State = {
  posterWidth: number;
  posterHeight: number;
  isConnected: boolean;
};

export default class VideoPlayer extends Component<Props, State> {
  static defaultProps = {
    horizontalMargin: 0
  };

  // Percentage of video that has been played. 0 = none; 0.5 = half-way; 1 = complete
  // Not included in state to avoid triggering re-render on every update.
  percentPlayed = 0;

  player = null;

  constructor(props: Props) {
    super(props);

    // Initial state; Set default aspect ratio to 16:9
    this.state = {
      posterWidth: 16,
      posterHeight: 9,
      isConnected: true
    };

    // this.getAndSetImageDimensions(props.posterUri);
  }

  // componentDidMount() {
    // this.player = await new Video.
  //   NetInfo.addEventListener("connectionChange", this.handleConnectivity);
  // }

  // componentWillUnmount() {
  //   NetInfo.removeEventListener("connectionChange", this.handleConnectivity);
  // }

  // getAndSetImageDimensions = posterUri => {
  //   if (!posterUri) {
  //     return;
  //   }

  //   Image.getSize(
  //     posterUri,
  //     (width, height) =>
  //       this.setState({
  //         posterWidth: width,
  //         posterHeight: height,
  //         isConnected: true
  //       }),
  //     () => this.setState({ isConnected: false }) // If image fails to load, assume no connectivity.
  //   );
  // };

  setPlayerRef = element => {
    this.player = element;
    this.player.loadAsync();
    // this.player.onStatusUpdate(this.onPlaybackStatusUpdate);
  };

  onPlaybackStatusUpdate = (playbackStatus) => {
    if (!playbackStatus.isLoaded) {
      // Update your UI for the unloaded state
      if (playbackStatus.error) {
        console.log(`Encountered a fatal error during playback: ${playbackStatus.error}`);
        // Send Expo team the error on Slack or the forums so we can help you debug!
      }
    } else {
      // Update your UI for the loaded state
      if (playbackStatus.shouldPlay) {
        console.log('should play');
      }

      if (playbackStatus.isPlaying) {
        // Update your UI for the playing state
        console.log('playing');
      } else {
        console.log('not playing');
        // Update your UI for the paused state
      }

      if (playbackStatus.isBuffering) {
        console.log('buffering');
        this.player.pauseAsync();
        // Update your UI for the buffering state
      }

      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        console.log('finishing');
        // The player has just finished playing and will stop. Maybe you want to play something else?
      }

      // ... // etc
    }
  }

  // handleConnectivity = Connection => {
  //   // Only update the state if they gain connectivity; this way if a user has already loaded
  //   // the video and loses connectivity, they won't also lose any of the video that has already been loaded.
  //   if (Connection.type !== "none") {
  //     this.getAndSetImageDimensions(this.props);
  //   }
  // };

  // handleLayout = () => {
    // if (getIsLandscape()) {
    //   this.setState({
    //     posterWidth: getDimensions().width - this.props.horizontalMargin,
    //     posterHeight: getDimensions().height
    //   });
    // } else {
    //   const { posterWidth, posterHeight } = this.state;
    //   const width = getDimensions().width - this.props.horizontalMargin;
    //   this.setState({
    //     posterWidth: width,
    //     posterHeight: (posterHeight / posterWidth) * width
    //   });
    // }
  // };

  handleProgress = playbackStatus => {
    const {
      isLoaded,
      error,
      isBuffering,
      isPlaying,
      shouldPlay,
      positionMillis,
      durationMillis
    } = playbackStatus;

    if (!isLoaded || error) {
      return;
    }

    if (!shouldPlay) {
      console.log("DONT PLAY");
    //   this.player.pauseAsync();
    }
    //  else if (shouldPlay && !isPlaying) {
    // this.player.playAsync();
    // }

    this.percentPlayed = positionMillis / durationMillis;

    if (this.percentPlayed >= 100) {
      this.player.dismissFullscreenPlayer();
    }
  };

  handleStartVideo = () => {
    // Only start video from beginning if 90% has already been played.
    if (this.percentPlayed > 0.9) {
      this.player.setStatusAsync({ positionMillis: 0 });
    }

    this.player.presentFullscreenPlayer();
  };

  handleFullscreenUpdate = ({ fullscreenUpdate }) => {
    // if (fullscreenUpdate === Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT) {
    //   this.player.playAsync();
    // } else if (
    //   fullscreenUpdate === Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS
    // ) {
    //   this.player.pauseAsync();
    // }
  };

  render() {
    return (
      <View
        style={[
          styles.container
        ]}
      >
        <View style={{ flex: 1 }}>
          <Video
            source={{ uri: this.props.uri }}
            ref={this.setPlayerRef}
            resizeMode={Video.RESIZE_MODE_CONTAIN}
            onPlaybackStatusUpdate={this.onPlaybackStatusUpdate}
            onFullscreenUpdate={this.handleFullscreenUpdate}
          />
          <TouchableHighlight
            underlayColor="transparent"
            activeOpacity={0.8}
            onPress={this.handleStartVideo}
            style={styles.playContainer}
          >
            <Image
              source={{ uri: this.props.posterUri }}
              style={styles.posterImage}
              resizeMode={getIsLandscape() ? "contain" : undefined}
            />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '80%',
    height: 10,
    justifyContent: 'center',
  },
  playContainer: {
    flex: 1,
    zIndex: 0
  },
  posterImage: {
    flex: 1
  },
});
