import { useState } from "react";
import { Button, Image, Modal, StyleSheet, Text, View } from "react-native";
import { useCaballero } from "./context/CaballerosContext";

export default function CaballeroDetalle() {
  const { caballeroSeleccionado } = useCaballero();
  const [visible, setVisible] = useState(false);

  if (!caballeroSeleccionado) return <Text>No hay caballero seleccionado</Text>;

  return (
    <View style={styles.container}>
      <Image source={{ uri: caballeroSeleccionado.imagen }} style={styles.image} />
      <Text style={styles.nombre}>{caballeroSeleccionado.nombre}</Text>
      <Text style={styles.constelacion}>{caballeroSeleccionado.constelacion}</Text>

      <Button title="Ver más información" onPress={() => setVisible(true)} />

      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.titulo}>{caballeroSeleccionado.nombre}</Text>
            <Text>Nivel: {caballeroSeleccionado.nivel}</Text>
            <Text style={{ marginTop: 10 }}>{caballeroSeleccionado.descripcion}</Text>
            <Button title="Cerrar" onPress={() => setVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  image: { width: 150, height: 150, borderRadius: 75, marginBottom: 20 },
  nombre: { fontSize: 22, fontWeight: "bold" },
  constelacion: { fontSize: 18, color: "#555", marginBottom: 20 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  titulo: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
});