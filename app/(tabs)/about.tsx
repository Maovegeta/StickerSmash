import { useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { sculptureList } from "./data";

export default function Gallery() {
  const [index1, setIndex] = useState(0);

  function handleClick() {
    if (index1 + 1 < sculptureList.length) {
      setIndex(index1 + 1);
    } else {
      setIndex(0); 
    }
  }

  let sculpture = sculptureList[index1];

  return (
    <View style={styles.container}>
      <Button title="Next" onPress={handleClick} />

      <Text style={styles.title}>
        <Text style={styles.italic}>{sculpture.name}</Text> by {sculpture.artist}
      </Text>

      <Text style={styles.subtitle}>
        ({index1 + 1} of {sculptureList.length})
      </Text>

      <Image
        source={{ uri: sculpture.url }}
        style={styles.image}
        accessibilityLabel={sculpture.alt}
      />

      <Text style={styles.description}>{sculpture.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginTop: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  italic: {
    fontStyle: "italic",
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 8,
    textAlign: "center",
  },
  image: {
    width: 320,
    height: 240,
    borderRadius: 8,
    marginVertical: 12,
  },
  description: {
    fontSize: 16,
    textAlign: "justify",
    marginTop: 8,
  },
});

