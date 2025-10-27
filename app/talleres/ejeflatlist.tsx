import React, { useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type Task = {
  id: string;
  title: string;
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Aprender React Native' },
    { id: '2', title: 'Practicar FlatList' },
  ]);

  const addTask = () => {
    const newId = (tasks.length + 1).toString();
    setTasks([...tasks, { id: newId, title: `Nueva tarea ${newId}` }]);
  };

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#ee0b0bff" />
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Lista de Tareas</Text>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />

        <TouchableOpacity style={styles.button} onPress={addTask}>
          <Text style={styles.buttonText}>Agregar tarea</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 80,
  },
  item: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 8,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
  },
  itemText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
