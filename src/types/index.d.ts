import React from 'react';
import {FlatList, ListRenderItem, FlatListProps} from 'react-native';

interface ManipulableSliderProps {
  data: any[];
  renderItem: ListRenderItem<any>;
  itemWIdth: number;
  loop?: boolean;
  currentIndexCallback?: (_props: any) => void;
  onSlideOnLast?: () => void;
  onStateChange?: ({index}: {index: number}) => void;
  indicatorStyle?: object;
  indicatorContainerStyle?: object;
  indicatorInActiveColor?: string;
  indicatorActiveColor?: string;
  indicatorActiveWidth?: number;
  indicator?: boolean;
  sliderRef?: React.RefObject<FlatList<FlatListProps<any>>>;
  animation?: boolean;
  imperativeHandlerRef?: React.Ref<unknown> | undefined;
  autoscroll?: boolean;
  timer?: number;
}

interface SliderIndicatorProps {
  itemCount: number;
  currentIndex: number;
  indicatorStyle: object;
  indicatorInActiveColor: string;
  indicatorActiveColor: string;
  indicatorActiveWidth?: number;
  indicatorContainerStyle: object;
}

declare class FlatListSlider extends React.Component<ManipulableSliderProps> {}
