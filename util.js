import { Dimensions } from "react-native";
import Orientation from "react-native-orientation";

const initialDimensions = Dimensions.get("window");

let screen = {
  width: initialDimensions.width,
  height: initialDimensions.height
};
let isLandscape = initialDimensions.height < initialDimensions.width;

Orientation.addOrientationListener(orientation => {
  const { height, width } = Dimensions.get("window");
  const min = Math.min(height, width);
  const max = Math.max(height, width);
  isLandscape = orientation === "LANDSCAPE";
  screen = {
    height: isLandscape ? min : max,
    width: isLandscape ? max : min
  };
});

export const getDimensions = () => screen;

export const getIsLandscape = () => isLandscape;
