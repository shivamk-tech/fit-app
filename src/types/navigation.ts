import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AppTabParamList = {
  Home: undefined;
  Workouts: undefined;
  Rewards: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  MainTabs: NavigatorScreenParams<AppTabParamList> | undefined;
  WorkoutDetail: { workoutId: string };
  WorkoutSession: { workoutId: string; workoutName: string };
  WorkoutComplete: { sessionId: string };
};

export type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList, 'MainTabs'>
>;
export type WorkoutsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, 'Workouts'>,
  NativeStackScreenProps<RootStackParamList, 'MainTabs'>
>;
export type RewardsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, 'Rewards'>,
  NativeStackScreenProps<RootStackParamList, 'MainTabs'>
>;
export type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList, 'MainTabs'>
>;
export type WorkoutSessionScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'WorkoutSession'
>;
export type WorkoutDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'WorkoutDetail'
>;
export type WorkoutCompleteScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'WorkoutComplete'
>;

export type AppTab = keyof AppTabParamList;
