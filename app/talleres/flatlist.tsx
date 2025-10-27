import React, { useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type ItemData = {
  id: string;
  title: string;
};

const DATA: ItemData[] = [
  {
    id: '1',
    title: 'Primer Item',
  },
  {
    id: '2',
    title: 'Segundo Item',
  },
  {
    id: '3',
    title: 'Tercero Item',
  },
  {
    id: '4',
    title: 'Cuarto Item',
  },
  {
    id: '5',
    title: 'Quinto Item',
  },
  {
    id: '4',
    title: 'Cuarto Item',
  },
  {
    id: '4',
    title: 'Cuarto Item',
  },
  {
    id: '4',
    title: 'Cuarto Item',
  },
  {
    id: '4',
    title: 'Cuarto Item',
  },
  {
    id: '4',
    title: 'Cuarto Item',
  },
  {
    id: '4',
    title: 'Cuarto Item',
  },
  {
    id: '4',
    title: 'Cuarto Item',
  },
  {
    id: '4',
    title: 'Cuarto Item',
  },
  {
    id: '4',
    title: 'Cuarto Item',
  },
  {
    id: '4',
    title: 'Cuarto Item',
  },
  {
    id: '4',
    title: 'Cuarto Item',
  },
  {
    id: '4',
    title: 'Cuarto Item',
  },
];

type ItemProps = {
  item: ItemData;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

const Item = ({item, onPress, backgroundColor, textColor}: ItemProps) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
    <Text style={[styles.title, {color: textColor}]}>{item.title}</Text>
  </TouchableOpacity>
);

const App = () => {
  const [selectedId, setSelectedId] = useState<string>();

  const renderItem = ({item}: {item: ItemData}) => {
    const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={selectedId}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default App;