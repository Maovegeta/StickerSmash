import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from 'expo-router';
import React from 'react';
import { CaballerosProvider } from './context/CaballerosContext';
import { CounterProvider } from "./context/CounterContext";

export default function TabsLayout() {
  return (
    <CaballerosProvider>
      <CounterProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "#3230adff",
            headerStyle: { backgroundColor: "#f61919ff" },
            headerShadowVisible: false,
            headerTintColor: "#111111ff",
            tabBarStyle: { backgroundColor: "#f0f4eeff" },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "home-sharp" : "home-outline"}
                  color={color}
                  size={24}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="Caballero"
            options={{
              title: "Caballeros",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "checkmark-circle" : "ellipse-outline"}
                  color={color}
                  size={24}
                />
              ),
            }}
          />

        <Tabs.Screen
          name="components/EmojiList"
          options={{
          href: null, 
        }}
      />
       <Tabs.Screen
          name="components/IconButton"
          options={{
          href: null, 
        }}
      />
      <Tabs.Screen
          name="components/EmojiPicker"
          options={{
          href: null, 
        }}
      />
      <Tabs.Screen
          name="components/CircleButton"
          options={{
          href: null, 
        }}
      />
      <Tabs.Screen
          name="components/EmojiSticker"
          options={{
          href: null, 
        }}
      />
      <Tabs.Screen
          name="app"
          options={{
          href: null, 
        }}
      />
      <Tabs.Screen
          name="index1"
          options={{
          href: null, 
        }}
      />
      <Tabs.Screen
          name="pressable"
          options={{
          href: null, 
        }}
      />
       <Tabs.Screen
          name="caballerodetalle"
          options={{
          href: null, 
        }}
      />
       <Tabs.Screen
          name="about"
          options={{
          href: null, 
        }}
      />
        </Tabs>
      </CounterProvider>
    </CaballerosProvider>
  );
}
