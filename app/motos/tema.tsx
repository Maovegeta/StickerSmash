import React, { createContext, ReactNode, useContext, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const ThemeContext = createContext<'light' | 'dark'>('light');

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={theme}>
      <SafeAreaView style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
        <Form />

        <Button
          onPress={() => setTheme(isDark ? 'light' : 'dark')}
        >
          Cambiar tema
        </Button>
      </SafeAreaView>
    </ThemeContext.Provider>
  );
}

interface PanelProps {
  title: string;
  children: ReactNode;
}

interface ButtonProps {
  children: ReactNode;
  onPress?: () => void;
}

function Form() {
  return (
    <Panel title="Bienvenido">
      <Button>Registrarse</Button>
      <Button>Iniciar sesión</Button>
    </Panel>
  );
}

function Panel({ title, children }: PanelProps) {
  const theme = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <View style={[styles.panel, isDark ? styles.panelDark : styles.panelLight]}>
      <Text style={[styles.panelTitle, isDark ? styles.textLight : styles.textDark]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function Button({ children, onPress }: ButtonProps) {
  const theme = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <TouchableOpacity
      style={[styles.button, isDark ? styles.buttonDark : styles.buttonLight]}
      onPress={onPress}
    >
      <Text style={isDark ? styles.textLight : styles.textDark}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  lightBg: {
    backgroundColor: '#f5f5f5',
  },
  darkBg: {
    backgroundColor: '#222',
  },
  panel: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  panelLight: {
    backgroundColor: '#fff',
  },
  panelDark: {
    backgroundColor: '#333',
  },
  panelTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonLight: {
    backgroundColor: '#e0e0e0',
  },
  buttonDark: {
    backgroundColor: '#444',
  },
  textLight: {
    color: '#fff',
  },
  textDark: {
    color: '#000',
  },
});
