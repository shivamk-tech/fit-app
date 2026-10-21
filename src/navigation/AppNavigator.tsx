import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import type { BottomTabBarProps as NavigationTabBarProps } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabBar } from '../components/BottomTabBar';
import { useAuth } from '../hooks/useAuth';
import { COLORS } from '../theme/colors';
import type {
  AppTab,
  AppTabParamList,
  RootStackParamList,
} from '../types/navigation';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RewardsScreen } from '../screens/RewardsScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { WorkoutCompleteScreen } from '../screens/WorkoutCompleteScreen';
import { WorkoutDetailScreen } from '../screens/WorkoutDetailScreen';
import { WorkoutSessionScreen } from '../screens/WorkoutSessionScreen';
import { WorkoutsScreen } from '../screens/WorkoutsScreen';

const Tab = createBottomTabNavigator<AppTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// Match the navigator's backdrop to the app canvas so transitions never flash white.
const NAV_THEME = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: COLORS.background },
};

function AppTabs() {
  return (
    // Bottom inset is handled by the tab bar itself.
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'shift',
          sceneStyle: { backgroundColor: COLORS.background },
        }}
        tabBar={renderNavigationBottomTabBar}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Workouts" component={WorkoutsScreen} />
        <Tab.Screen name="Rewards" component={RewardsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

function renderNavigationBottomTabBar({
  state,
  navigation,
}: NavigationTabBarProps) {
  const activeTab = state.routes[state.index]?.name as AppTab;
  return (
    <BottomTabBar
      activeTab={activeTab}
      onTabPress={tabName => navigation.navigate(tabName)}
    />
  );
}

export function AppNavigator() {
  const { status } = useAuth();

  if (status === 'restoring') {
    // Brief blank canvas while the saved session loads (avoids a Welcome flash).
    return (
      <SafeAreaProvider>
        <View style={styles.root} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <View style={styles.root}>
        <NavigationContainer theme={NAV_THEME}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              contentStyle: { backgroundColor: COLORS.background },
            }}
          >
            {status === 'signedIn' ? (
              <>
                <Stack.Screen name="MainTabs" component={AppTabs} />
                <Stack.Screen
                  name="WorkoutDetail"
                  component={WorkoutDetailScreen}
                />
                <Stack.Screen
                  name="WorkoutSession"
                  component={WorkoutSessionScreen}
                  // Leaving mid-workout must go through the cancel confirmation.
                  options={{ gestureEnabled: false }}
                />
                <Stack.Screen
                  name="WorkoutComplete"
                  component={WorkoutCompleteScreen}
                  options={{
                    animation: 'fade_from_bottom',
                    gestureEnabled: false,
                  }}
                />
              </>
            ) : (
              <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                // Signing out lands here; fade so it doesn't feel like "back".
                options={{ animation: 'fade' }}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
