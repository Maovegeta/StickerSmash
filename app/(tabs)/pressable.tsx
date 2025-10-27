import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  const [timesPressed, setTimesPressed] = useState(0);
  const [eventType, setEventType] = useState('');
  const intervalRef = useRef<number | null>(null);

  let textLog = '';
  if (timesPressed > 1) {
    textLog = timesPressed + 'x onPress';
  } else if (timesPressed > 0) {
    textLog = 'onPress';
  }

  const startCounting = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setTimesPressed(current => current + 1);
    }, 200); 
  };

  const stopCounting = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Pressable
          onPressIn={() => {
            startCounting();
          }}
          onPressOut={() => {
            stopCounting();
          }}
          onPress={() => {
            setTimesPressed(current => current + 1);
          }}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? 'rgba(204, 239, 46, 1)' : 'red',
            },
            styles.wrapperCustom,
          ]}
        >
          {({ pressed }) => (
            <Text style={styles.text}>
              {pressed ? 'Presionado!' : 'Presióname'}
            </Text>
          )}
        </Pressable>
        <View style={styles.logBox}>
          <Text testID="pressable_press_console">{textLog}</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
  },
  wrapperCustom: {
    borderRadius: 20,
    padding: 20,
  },
  logBox: {
    padding: 20,
    margin: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#7b7c78ff',
    backgroundColor: '#f9f9f9',
  },
});

export default App;
