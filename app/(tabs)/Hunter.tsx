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


const API_URL = "https://hunter-backent.onrender.com";

export default function HuntersScreen() {
  // Tipo local para personajes (adaptado a Hunter x Hunter)
  type Hunter = {
    _id: string;
    nombre: string;
    afiliacion?: string; // por ejemplo 'Ging', 'Phantom Troupe', 'Hunter Association'
    imagen: string;
    descripcion?: string;
  };

  const [characters, setCharacters] = useState<Hunter[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Hunter[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Usa hooks dentro del componente
  const { setCaballeroSeleccionado } = useCaballero();
  const router = useRouter();

  const fetchCharacters = async () => {
    setLoading(true);
    try {
      // Ajusta la ruta del recurso si tu backend expone /hunters en lugar de /caballeros
      const response = await fetch(`${API_URL}/caballeros`);
      const data: Hunter[] = await response.json();
      setCharacters(data);
    } catch (error) {
      console.log("❌ Error al obtener personajes:", error);
      setCharacters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const searchCharacters = async () => {
    if (!searchName) return;
    setSearching(true);
    try {
      const response = await fetch(
        `${API_URL}/caballeros/search?name=${encodeURIComponent(searchName)}`
      );
      const data: Hunter[] = await response.json();
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
        placeholder="Buscar personaje por nombre"
        value={searchName}
        onChangeText={setSearchName}
        style={styles.input}
      />

      <Button mode="contained" onPress={searchCharacters} style={{ marginBottom: 10 }}>
        Buscar personaje
      </Button>

      {searching && <ActivityIndicator />}

      {searchResults.length > 0 && (
        // constrain search results height so the 'Ver Caballeros' button stays visible
        <ScrollView style={styles.searchListContainer}>
          {searchResults.map((c) => (
            <TouchableOpacity
              key={c._id}
              onPress={() => {
                // map a la forma esperada por el contexto de 'Caballero'
                setCaballeroSeleccionado({
                  _id: c._id,
                  nombre: c.nombre,
                  constelacion: (c as any).afiliacion || '',
                  nivel: (c as any).nivel || '',
                  descripcion: c.descripcion || '',
                  imagen: c.imagen,
                }); // ✅ guarda en contexto
                router.push("/caballerodetalle"); // mantiene navegación a la pantalla detalle existente
              }}
            >
              <View style={styles.card}>
                <Image source={{ uri: c.imagen }} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.name}>{c.nombre}</Text>
                  <Text style={styles.constelacion}>{c.afiliacion}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={{ height: 10 }} />
      <Button mode="contained" onPress={fetchCharacters}>
        Ver Personajes de Hunter
      </Button>

      <View style={{ height: 12 }} />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : characters.length === 0 ? (
        <Text style={{ marginTop: 12, color: "#666" }}>
          No hay personajes disponibles.
        </Text>
      ) : (
        <ScrollView style={styles.listContainer}>
          {characters.map((c) => (
            <View key={c._id} style={styles.card}>
              <Image source={{ uri: c.imagen }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{c.nombre}</Text>
                <Text style={styles.constelacion}>{c.afiliacion}</Text>
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
    flex: 1,
  },
  searchListContainer: {
    marginTop: 12,
    maxHeight: 260,
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
