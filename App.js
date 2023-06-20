import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { DefaultTheme, Provider } from "react-native-paper";

import ChatList from "./screens/ChatList";
import Chat from "./screens/Chat";
import Settings from "./screens/Settings";
import SignUp from "./screens/SignUp";
import SignIn from "./screens/SignIn";

import firebase from "firebase/compat";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBfHjx9ZD3Ax9UtyG_mqCd57DQaGcNm2Mg",
  authDomain: "chat-app-7b246.firebaseapp.com",
  projectId: "chat-app-7b246",
  storageBucket: "chat-app-7b246.appspot.com",
  messagingSenderId: "794906644508",
  appId: "1:794906644508:web:9885cb016e6cdd82eb8fd9",
  measurementId: "G-VDZY8N57W5",
};

firebase.initializeApp(firebaseConfig);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  const navigation = useNavigation();
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (!user) {
        navigation.navigate("SignUp");
      }
    });
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          return (
            <Ionicons
              name={route.name === "ChatList" ? "chatbubbles" : "settings"}
              color={color}
              size={size}
            />
          );
        },
      })}
    >
      <Tab.Screen name="ChatList" component={ChatList} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

const theme = {
  ...DefaultTheme,
  roundness: 5,
  colors: {
    ...DefaultTheme.colors,
    primary: "#2196f3",
  },
};

export default function App() {
  return (
    <NavigationContainer>
      <Provider theme={theme}>
        <Stack.Navigator screenOptions={{ headerBackVisible: false }}>
          <Stack.Screen
            name="Main"
            component={MyTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ presentation: "fullScreenModal" }}
          />
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ presentation: "fullScreenModal" }}
          />
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
