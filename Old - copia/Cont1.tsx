import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

function App({ contador, setContador }: { contador: number; setContador: (n: number) => void }) {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => setContador(contador + 1)}
      >
        <Text style={styles.buttonLabel}>Incrementar</Text>
      </Pressable>

      <Text style={styles.text}>Contador: {contador}</Text>
    </View>
  );
}

function Cont({ contador }: { contador: number }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Contador: {contador}</Text>
    </View>
  );
}

export default function Index() {
  const [contador, setContador] = useState(0);

  return (
    <View style={{ flex: 1 }}>
      <App contador={contador} setContador={setContador} />
      <Cont contador={contador} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    marginTop: 20,
  },
  button: {
    backgroundColor: "#e52525",
    padding: 10,
    borderRadius: 8,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});