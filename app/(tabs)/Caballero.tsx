import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { useCaballero } from "./context/CaballerosContext"; // ⚠️ ajusta esta ruta según tu estructura

// Ajusta esta URL según tu entorno (usa tu IP local real si estás en Expo)
const API_URL = "http://localhost:4000";


export default function CaballerosScreen() {
  const [caballeros, setCaballeros] = useState<Caballero[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Caballero[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Usa hooks dentro del componente
  const { setCaballeroSeleccionado } = useCaballero();
  const router = useRouter();

  const fetchCaballeros = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/caballeros`);
      const data: Caballero[] = await response.json();
      setCaballeros(data);
    } catch (error) {
      console.log("❌ Error al obtener caballeros:", error);
      setCaballeros([]);
    } finally {
      setLoading(false);
    }
  };

  type Caballero = {
  _id: string;
  nombre: string;
  constelacion: string;
  imagen: string;
  nivel: string;
  descripcion: string;
};

  useEffect(() => {
    fetchCaballeros();
  }, []);

  const searchCaballeros = async () => {
    if (!searchName) return;
    setSearching(true);
    try {
      const response = await fetch(
        `${API_URL}/caballeros/search?name=${encodeURIComponent(searchName)}`
      );
      const data: Caballero[] = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.log("❌ Error en búsqueda:", error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar por nombre"
        value={searchName}
        onChangeText={setSearchName}
        style={styles.input}
      />

      <Button mode="contained" onPress={searchCaballeros} style={{ marginBottom: 10 }}>
        Buscar por nombre
      </Button>

      {searching && <ActivityIndicator />}

      {searchResults.length > 0 && (
        <ScrollView style={styles.listContainer}>
          {searchResults.map((c) => (
            <TouchableOpacity
              key={c._id}
              onPress={() => {
                setCaballeroSeleccionado(c); // ✅ guarda en contexto
                router.push("/caballerodetalle"); // ✅ navega a la pantalla detalle
              }}
            >
              <View style={styles.card}>
                <Image source={{ uri: c.imagen }} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.name}>{c.nombre}</Text>
                  <Text style={styles.constelacion}>{c.constelacion}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={{ height: 10 }} />
      <Button mode="contained" onPress={fetchCaballeros}>
        Ver Caballeros del Zodiaco
      </Button>

      <View style={{ height: 12 }} />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : caballeros.length === 0 ? (
        <Text style={{ marginTop: 12, color: "#666" }}>
          No hay caballeros disponibles.
        </Text>
      ) : (
        <ScrollView style={styles.listContainer}>
          {caballeros.map((c) => (
            <View key={c._id} style={styles.card}>
              <Image source={{ uri: c.imagen }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{c.nombre}</Text>
                <Text style={styles.constelacion}>{c.constelacion}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  input: {
    width: "100%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
  },
  listContainer: {
    marginTop: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  constelacion: {
    color: "#666",
  },
});
