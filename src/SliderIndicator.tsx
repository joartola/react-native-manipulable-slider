import React from 'react';
import {View, StyleSheet} from 'react-native';

const SliderIndicator = ({
  itemCount,
  currentIndex,
  indicatorStyle,
  indicatorActiveColor,
  indicatorInActiveColor,
  indicatorActiveWidth = 6,
  indicatorContainerStyle,
}: {
  itemCount: number;
  currentIndex: number;
  indicatorStyle: object;
  indicatorInActiveColor: string;
  indicatorActiveColor: string;
  indicatorActiveWidth?: number;
  indicatorContainerStyle: object;
}) => {
  let indicators = [];
  for (let i = 0; i < itemCount; i++) {
    indicators.push(
      <View
        key={`SliderIndicator${i.toString()}`}
        style={[
          styles.indicator,
          indicatorStyle,
          i === currentIndex
            ? indicatorActiveColor
              ? {
                  ...styles.active,
                  ...{
                    backgroundColor: indicatorActiveColor,
                    width: indicatorActiveWidth,
                  },
                }
              : styles.active
            : {
                ...styles.inactive,
                ...{backgroundColor: indicatorInActiveColor},
              },
        ]}
      />,
    );
  }
  return (
    <View style={[styles.container, indicatorContainerStyle]}>
      {indicators}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  active: {},
  inactive: {},
});

export default SliderIndicator;
