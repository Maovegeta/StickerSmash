import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Snackbar } from "react-native-paper";
import { useHunter } from "./context/HunterContext";
import { resilientFetch } from "./services/resilientFetch";
import { Logger } from "./utils/logger";


const API_MONGO = "https://hunter-backent.onrender.com"; 
const API_NEON = "https://hunter-backent-neon.onrender.com"; 

interface BaseHunter {
  nombre: string;
  edad?: number;
  anime: string;
  habilidad: string;
  tiponen: string;
  personalidad: string;
  objetivo: string;
  mejorAmigo: string;
  imagen: string;
}

interface MongoHunter extends BaseHunter {
  _id?: string;
}

interface NeonHunter extends BaseHunter {
  id?: number;
  
}

type Hunter = MongoHunter | NeonHunter;


export default function HunterScreen() {
  const { setHunterSeleccionado } = useHunter();
  const router = useRouter();

  const [huntersMongo, setHuntersMongo] = useState<Hunter[]>([]);
  const [huntersNeon, setHuntersNeon] = useState<Hunter[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingHunter, setEditingHunter] = useState<Hunter | null>(null);
  const [saveToMongo, setSaveToMongo] = useState(true); // por defecto Mongo
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [pendingDeleteHunter, setPendingDeleteHunter] = useState<Hunter | null>(null);
  
  

  const [formData, setFormData] = useState<Hunter>({
    nombre: "",
    edad: undefined,
    anime: "Hunter x Hunter",
    tiponen: "",
    habilidad: "",
    personalidad: "",
    objetivo: "",
    mejorAmigo: "",
    imagen: "",
  });

  // ✅ Consulta Mongo (Render)
  const fetchHuntersMongo = async () => {
  setLoading(true);
  
  Logger.info("▶ Iniciando consulta a Mongo...");
  Logger.debug("URL utilizada:", API_MONGO);

try {
  const data = await resilientFetch(`${API_MONGO}/hunters`);
  Logger.info("✅ Hunters obtenidos desde Mongo", data);
  setHuntersMongo(data);
} catch (error) {
  Logger.error("❌ Error obteniendo datos desde Mongo", error);
  Logger.warn("⛑ Cambiando al fallback: Neon");
  // fallback: intentar Neon
  fetchHuntersNeon();
} finally {
  setLoading(false);
}
};


  // ✅ Consulta PostgreSQL (Neon)
 const fetchHuntersNeon = async () => {
  Logger.info("▶ Iniciando consulta a Neon...");
  Logger.debug("URL utilizada:", API_NEON);

try {
  const data = await resilientFetch(`${API_NEON}/personajes_hunter`);
  Logger.info("✅ Hunters obtenidos desde Neon", data);
  setHuntersNeon(data);
} catch (error) {
  Logger.error("❌ Error obteniendo datos desde Neon", error);
  Logger.warn("⛑ Cambiando al fallback: Mongo");
  // fallback: intentar Mongo
  fetchHuntersMongo();
}
};

let mongoFailures = 0;
let neonFailures = 0;
const FAILURE_LIMIT = 3;
   
  useEffect(() => {
    fetchHuntersMongo();
    fetchHuntersNeon();
  }, []);

  // Type guards
const isMongoHunter = (hunter: Hunter): hunter is MongoHunter => {
  return '_id' in hunter;
};

const isNeonHunter = (hunter: Hunter): hunter is NeonHunter => {
  return 'id' in hunter;
};

const handleSave = async () => {
  if (!formData.nombre.trim()) {
    Alert.alert("Error", "El nombre es obligatorio");
    return;
  }

  try {
    let url = `${API_MONGO}/hunters`;
    let method = editingHunter ? "PUT" : "POST";
    let isNeonDB = false;

    // ✅ Si está editando, respetamos DB original
    if (editingHunter) {
      if (isMongoHunter(editingHunter)) {
        url = `${API_MONGO}/hunters/${editingHunter._id}`;
      } else if (isNeonHunter(editingHunter)) {
        url = `${API_NEON}/personajes_hunter/${editingHunter.id}`;
        isNeonDB = true;
      }

      // ✅ SI ES NUEVO —> switch decide DB
    } else {
      if (saveToMongo) {
        url = `${API_MONGO}/hunters`;
      } else {
        url = `${API_NEON}/personajes_hunter`;
        isNeonDB = true;
      }
    }
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error(`Error en la petición: ${res.status}`);
    }

    // ✅ Recargar tabla correcta según DB usada
    isNeonDB ? fetchHuntersNeon() : fetchHuntersMongo();

    // ✅ Reset de interfaz
    setShowForm(false);
    setEditingHunter(null);
    setFormData({
      nombre: "",
      edad: undefined,
      anime: "Hunter x Hunter",
      tiponen: "",
      habilidad: "",
      personalidad: "",
      objetivo: "",
      mejorAmigo: "",
      imagen: "",
    });

  } catch (error) {
    console.error("❌ Error guardando hunter:", error);
    Alert.alert("Error", "No se pudo guardar el hunter.");
  }
};

  // ✅ Editar en Neon
const handleEditNeon = (hunter: Hunter) => {
  setEditingHunter(hunter);
  setFormData({
    nombre: hunter.nombre,
    edad: hunter.edad,
    anime: hunter.anime,
    tiponen: hunter.tiponen,
    habilidad: hunter.habilidad,
    personalidad: hunter.personalidad,
    objetivo: hunter.objetivo,
    mejorAmigo: hunter.mejorAmigo,
    imagen: hunter.imagen,
  });
  setShowForm(true);
};

//  Eliminar en Mongo
const handleDelete = (hunter: Hunter) => {
  if (!isMongoHunter(hunter) || !hunter._id) return;

  setPendingDeleteHunter(hunter);
  setSnackbarMsg(`¿Eliminar a ${hunter.nombre}?`);
  setSnackbarVisible(true);
  };
  

// ✅ Eliminar en Neon
const handleDeleteNeon = (hunter: Hunter) => {
  if (!isNeonHunter(hunter) || !hunter.id) return;
  
  setPendingDeleteHunter(hunter);
  setSnackbarMsg(`¿Eliminar a ${hunter.nombre}?`);
  setSnackbarVisible(true);
};

// Confirm deletion handler (reads pendingDeleteHunter)
const confirmDelete = async () => {
  const hunter = pendingDeleteHunter;
  if (!hunter) {
    setSnackbarMsg("No hay hunter seleccionado para eliminar");
    setSnackbarVisible(true);
    return;
  }

  try {
    let res;
    if (isNeonHunter(hunter) && hunter.id) {
      res = await fetch(`${API_NEON}/personajes_hunter/${hunter.id}`, {
        method: "DELETE",
      });
    } else if (isMongoHunter(hunter) && hunter._id) {
      res = await fetch(`${API_MONGO}/hunters/${hunter._id}`, {
        method: "DELETE",
      });
    } else {
      throw new Error("Hunter inválido para eliminar");
    }

    if (res.ok) {
      setSnackbarMsg("✅ Hunter eliminado correctamente");
      // Refresh the correct list based on hunter type
      if (isNeonHunter(hunter)) {
        fetchHuntersNeon();
      } else {
        fetchHuntersMongo();
      }
    } else {
      setSnackbarMsg("❌ Error eliminando hunter");
    }
  } catch (error) {
    setSnackbarMsg("⚠️ Error eliminando hunter");
    console.error("Error al eliminar:", error);
  } finally {
    setSnackbarVisible(true);
    setPendingDeleteHunter(null);
  }
};
  const startEdit = (hunter: Hunter) => {
    setEditingHunter(hunter);
    setFormData(hunter);
    setShowForm(true);
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowForm(true)}
      >
        <Text style={styles.addButtonText}>➕ Nuevo Hunter</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          ListHeaderComponent={
            <>
              <Text style={styles.sectionTitle}>Hunters desde Neon (PostgreSQL)</Text>
              <FlatList
                 data={huntersNeon}
                  keyExtractor={(item) => isNeonHunter(item) && item.id ? item.id.toString() : Math.random().toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                          style={styles.card}
                          onPress={() => {
                            setHunterSeleccionado(item);
                            router.push("/hunterdetalle");
                          }}
                        >
                    <View style={styles.card}>
                      <Text style={styles.name}>{item.nombre}</Text>
                      <Text>Edad: {item.edad}</Text>
                      <Text>Personalidad: {item.personalidad}</Text>
                     
                      <View style={styles.actions}>
                            <Button
                              mode="contained"
                              onPress={() => handleEditNeon(item)}
                              style={styles.editButton}
                            >
                              Editar
                            </Button>

                            <Button
                              mode="contained"
                              onPress={() => handleDeleteNeon(item)}
                              style={styles.deleteButton}
                            >
                              Eliminar
                            </Button>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />

              <Text style={styles.sectionTitle}>Hunters desde MongoDB</Text>
            </>
          }
          data={huntersMongo}
          keyExtractor={(item) => isMongoHunter(item) && item._id ? item._id : Math.random().toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                setHunterSeleccionado(item);
                router.push("/hunterdetalle");
              }}
            >
              <View>
                <Text style={styles.name}>{item.nombre}</Text>
                <Text>Edad: {item.edad}</Text>
                <Text>Personalidad: {item.personalidad}</Text>
              </View>
              <View style={styles.actions}>
                <Button
                  mode="contained"
                  onPress={() => startEdit(item)}
                  style={styles.editButton}
                >
                  Editar
                </Button>
                <Button
                  mode="contained"
                  onPress={() => handleDelete(item)}
                  style={styles.deleteButton}
                >
                  Eliminar
                </Button>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Global Snackbar for confirm delete (works for both Neon and Mongo) */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{ label: "Eliminar", onPress: confirmDelete }}
      >
        {snackbarMsg}
      </Snackbar>

      <Modal visible={showForm} animationType="slide">
        <ScrollView style={styles.modal}>
          <Text style={styles.modalTitle}>
            {editingHunter ? "Editar Hunter" : "Nuevo Hunter"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={formData.nombre}
            onChangeText={(t) => setFormData({ ...formData, nombre: t })}
          />

          <TextInput
            style={styles.input}
            placeholder="Edad"
            keyboardType="numeric"
            value={formData.edad?.toString() || ""}
            onChangeText={(t) =>
              setFormData({ ...formData, edad: parseInt(t) || undefined })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Tipo Nen"
            value={formData.tiponen}
            onChangeText={(t) => setFormData({ ...formData, tiponen: t } )
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Habilidad Nen"
            value={formData.habilidad}
            onChangeText={(t) => setFormData({ ...formData, habilidad: t } )
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Objetivo"
            value={formData.objetivo}
            onChangeText={(t) => setFormData({ ...formData, objetivo: t })}
          />

          <TextInput
            style={styles.input}
            placeholder="Personalidad"
            value={formData.personalidad}
            onChangeText={(t) => setFormData({ ...formData, personalidad: t })}
          />

          <TextInput
            style={styles.input}
            placeholder="Mejor Amigo"
            value={formData.mejorAmigo}
            onChangeText={(t) => setFormData({ ...formData, mejorAmigo: t })}
          />

          <TextInput
            style={styles.input}
            placeholder="URL Imagen"
            value={formData.imagen}
            onChangeText={(t) => setFormData({ ...formData, imagen: t })}
          />
            <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Guardar en:</Text>

                <View style={styles.switchRow}>
                  <Text>MongoDB</Text>
                  <Switch
                    value={saveToMongo}
                    onValueChange={setSaveToMongo}
                  />
                  <Text></Text>
                </View>
              </View>

          <View style={styles.buttonRow}>
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.saveButton}
            >
              {editingHunter ? "Actualizar" : "Guardar"}
            </Button>
            <Button
              mode="contained"
              onPress={() => setShowForm(false)}
              style={styles.cancelButton}
            >
              Cancelar
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  sectionTitle: { fontSize: 18, marginVertical: 10, fontWeight: "bold" },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  addButtonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: { fontSize: 18, fontWeight: "bold" },
  actions: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  editButton: { backgroundColor: "#FFA500" },
  deleteButton: { backgroundColor: "#E53935" },
  modal: { padding: 20 },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  saveButton: { backgroundColor: "#4CAF50" },
  cancelButton: { backgroundColor: "#999" },
  switchContainer: {
  marginTop: 10,
  marginBottom: 20,
},
switchLabel: {
  fontSize: 16,
  fontWeight: "bold",
  marginBottom: 5,
},
switchRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
},
});