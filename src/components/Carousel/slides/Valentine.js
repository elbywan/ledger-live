// @flow

import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import { Linking, Image, View, StyleSheet } from "react-native";
import getWindowDimensions from "../../../logic/getWindowDimensions";
import valentine from "../../../images/banners/valentine.png";
import LText from "../../LText";
import Touchable from "../../Touchable";
import { urls } from "../../../config/urls";
import colors from "../../../colors";

const Valentine = () => {
  const slideWidth = getWindowDimensions().width - 32;
  const onClick = useCallback(() => {
    Linking.openURL(urls.banners.valentine);
  }, []);
  return (
    <Touchable event="Valentine Carousel" onPress={onClick}>
      <View style={[styles.wrapper, { width: slideWidth }]}>
        <Image style={styles.illustration} source={valentine} />
        <View>
          <LText semiBold secondary style={styles.label}>
            <Trans i18nKey={`carousel.banners.valentine.title`} />
          </LText>
          <LText primary style={styles.description}>
            <Trans i18nKey={`carousel.banners.valentine.description`} />
          </LText>
        </View>
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  illustration: {
    position: "absolute",
    bottom: 0,
    right: 24,
    width: 96,
    height: 96,
  },
  wrapper: {
    width: "100%",
    height: 100,
    padding: 16,
    paddingBottom: 0,
    position: "relative",
  },
  buttonWrapper: {
    display: "flex",
    flexDirection: "row",
  },
  button: {
    marginBottom: 16,
  },
  label: {
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.5,
    color: colors.darkBlue,
    fontSize: 10,
    lineHeight: 15,
    marginRight: 100,
  },
  description: {
    color: colors.darkBlue,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 16,
    marginRight: 100,
  },
  layer: {
    position: "absolute",
  },
});

export default Valentine;
