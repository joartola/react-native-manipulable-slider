import React, {createRef} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ViewToken,
  FlatListProps,
  ViewabilityConfigCallbackPairs,
  UIManager,
} from 'react-native';
import {useState} from 'react';
import {useRef} from 'react';
import SliderIndicator from './SliderIndicator';
import {Platform} from 'react-native';
import {useImperativeHandle} from 'react';
import {LayoutAnimation} from 'react-native';
import {useEffect} from 'react';
import {useCallback} from 'react';
import {ManipulableSliderProps} from './types';

const FlatListSlider: React.FC<ManipulableSliderProps> = ({
  data = [],
  itemWIdth,
  renderItem,
  loop = false,
  currentIndexCallback = () => {},
  indicatorStyle = {},
  indicatorContainerStyle = {},
  indicatorInActiveColor = '#3498db',
  indicatorActiveColor = '#bdc3c7',
  indicatorActiveWidth = 6,
  indicator = true,
  sliderRef = createRef<FlatList<FlatListProps<any>>>(),
  animation = true,
  imperativeHandlerRef = undefined,
  onSlideOnLast = () => null,
  onStateChange = _state => null,
  autoscroll = false,
  timer = 3000,
}) => {
  if (animation) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }
  const [state, setState] = useState({index: 0});
  const slideNext = useCallback(() => {
    let nextIndex = state.index + 1;
    const lastIndex = data.length - 1;
    if (nextIndex > lastIndex && !loop) {
      onSlideOnLast ? onSlideOnLast() : null;
      return;
    } else if (nextIndex > lastIndex && loop) {
      nextIndex = 0;
    }
    sliderRef && sliderRef.current
      ? sliderRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        })
      : null;
    setState(prevState => ({...prevState, index: nextIndex}));
  }, [data.length, loop, onSlideOnLast, sliderRef, state.index]);

  const slideBack = useCallback(() => {
    let nextIndex = state.index - 1;
    const firstIndex = 0;
    if (nextIndex < firstIndex && !loop) {
      onSlideOnLast ? onSlideOnLast() : null;
      return;
    } else if (nextIndex < firstIndex && loop) {
      nextIndex = data.length - 1;
    }
    sliderRef && sliderRef.current
      ? sliderRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        })
      : null;
    setState(prevState => ({...prevState, index: nextIndex}));
  }, [data.length, loop, onSlideOnLast, sliderRef, state.index]);

  const slideToIndex = useCallback(
    (index: number) => {
      if (index >= data.length) {
        return;
      }
      sliderRef && sliderRef.current
        ? sliderRef.current.scrollToIndex({
            index: index,
            animated: true,
          })
        : null;
      setState(prevState => ({...prevState, index: index}));
    },
    [data.length, sliderRef],
  );
  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  useEffect(() => {
    let sliderTimer: NodeJS.Timer;

    const startAutoPlay = () => {
      sliderTimer = setInterval(slideNext, timer);
    };
    const stopAutoPlay = () => {
      if (sliderTimer) {
        clearInterval(sliderTimer);
      }
    };
    if (autoscroll) {
      startAutoPlay();
    }
    return stopAutoPlay;
  }, [autoscroll, slideNext, timer]);

  useEffect(() => onStateChange(state), [state, onStateChange]);

  useImperativeHandle(imperativeHandlerRef, () => ({
    slideNext: slideNext,
    slideBack: slideBack,
    slideToIndex: slideToIndex,
  }));

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
    changed: ViewToken[];
  }) => {
    if (viewableItems.length > 0) {
      const currentIndex = viewableItems[0].index ? viewableItems[0].index : 0;

      if (currentIndex % data.length === data.length - 1 && loop) {
        setState(prevState => ({
          ...prevState,
          index: currentIndex,
        }));
      } else {
        setState(prevState => ({...prevState, index: currentIndex}));
      }

      if (currentIndexCallback) {
        currentIndexCallback(currentIndex);
      }
    }
  };
  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  const viewabilityConfigCallbackPairs = useRef<ViewabilityConfigCallbackPairs>(
    [{viewabilityConfig, onViewableItemsChanged}],
  );

  return (
    <View>
      <FlatList
        ref={sliderRef}
        renderItem={renderItem}
        data={data}
        keyExtractor={(item, index) => item.toString() + index}
        horizontal={true}
        pagingEnabled={true}
        decelerationRate="fast"
        bounces={false}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{width: 0}} />}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_data, index) => ({
          length: itemWIdth,
          offset: itemWIdth * index,
          index,
        })}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        removeClippedSubviews={true}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
      {indicator && (
        <SliderIndicator
          itemCount={data.length}
          currentIndex={state.index % data.length}
          indicatorStyle={{...styles.indicator, ...indicatorStyle}}
          indicatorContainerStyle={[
            styles.indicatorContainerStyle,
            indicatorContainerStyle,
          ]}
          indicatorActiveColor={indicatorActiveColor}
          indicatorInActiveColor={indicatorInActiveColor}
          indicatorActiveWidth={indicatorActiveWidth}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 20,
  },
  contentStyle: {
    paddingHorizontal: 16,
  },
  image: {
    height: 230,
    resizeMode: 'stretch',
  },
  indicatorContainerStyle: {
    marginTop: 18,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 3, height: 3},
        shadowOpacity: 0.4,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
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
export default FlatListSlider;
