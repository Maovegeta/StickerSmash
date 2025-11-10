import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useHunter } from "./context/HunterContext";

export default function HunterDetalle() {
  const { hunterSeleccionado } = useHunter();
  const router = useRouter();

  if (!hunterSeleccionado) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No hay hunter seleccionado</Text>
        <Button 
          mode="contained" 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          Volver
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: hunterSeleccionado.imagen }} style={styles.image} />
      
      <View style={styles.infoContainer}>
        <Text style={styles.nombre}>{hunterSeleccionado.nombre}</Text>
        
        {hunterSeleccionado.edad && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Edad:</Text>
            <Text style={styles.value}>{hunterSeleccionado.edad}</Text>
          </View>
        )}

        {hunterSeleccionado.tiponen && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Tipo de Nen:</Text>
            <Text style={styles.value}>{hunterSeleccionado.tiponen}</Text>
          </View>
        )}

        {hunterSeleccionado.habilidad && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Habilidad:</Text>
            <Text style={styles.value}>{hunterSeleccionado.habilidad}</Text>
          </View>
        )}

        {hunterSeleccionado.personalidad && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Personalidad:</Text>
            <Text style={styles.value}>{hunterSeleccionado.personalidad}</Text>
          </View>
        )}

        {hunterSeleccionado.objetivo && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Objetivo:</Text>
            <Text style={styles.value}>{hunterSeleccionado.objetivo}</Text>
          </View>
        )}

        {hunterSeleccionado.mejorAmigo && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Mejor Amigo:</Text>
            <Text style={styles.value}>{hunterSeleccionado.mejorAmigo}</Text>
          </View>
        )}

        <Button 
          mode="contained" 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          Volver
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 20,
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    flex: 2,
    fontSize: 16,
    color: '#333',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
  },
});