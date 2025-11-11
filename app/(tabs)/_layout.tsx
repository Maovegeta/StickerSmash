import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from 'expo-router';
import React from 'react';
import { CaballerosProvider } from './context/CaballerosContext';
import { CounterProvider } from "./context/CounterContext";
import { HunterProvider } from "./context/HunterContext";

export default function TabsLayout() {
  return (
    <CaballerosProvider>
      <CounterProvider>
        <HunterProvider>
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
            name="Hunter"
            options={{
              title: "Hunters",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "person" : "person-outline"}
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
      <Tabs.Screen
          name="data"
          options={{
          href: null, 
        }}
      />
      <Tabs.Screen
          name="context/HunterContext"
          options={{
          href: null, 
        }}
      />
      <Tabs.Screen
          name="context/CounterContext"
          options={{
          href: null, 
        }}
      />
      <Tabs.Screen
          name="context/CaballerosContext"
          options={{
          href: null, 
        }}
      />
        <Tabs.Screen
          name="utils/logger"
          options={{
          href: null, 
        }}
      />
      <Tabs.Screen
          name="services/resilientFetch"
          options={{
          href: null, 
        }}
      />
        </Tabs>
        </HunterProvider>
      </CounterProvider>
    </CaballerosProvider>
  );
}
