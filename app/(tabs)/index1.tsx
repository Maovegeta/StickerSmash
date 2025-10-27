import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useCounter } from "./context/CounterContext";


function Cont1({ navigation }: any) {
  const { contador, setContador } = useCounter();

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => setContador(contador + 1)}>
        <Text style={styles.buttonLabel}>Incrementar</Text>
      </Pressable>
      <View>      
      <Text style={styles.text2}>Contador: {contador}</Text>
      </View>
    </View>
  );
}

function Cont2({ navigation }: any) {
  const { contador, setContador } = useCounter();

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
      <Cont1 contador={contador} setContador={setContador} />
      <Cont2 contador={contador} setContador={setContador} />
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
   text2: {
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