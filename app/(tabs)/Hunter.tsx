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
import { Button } from "react-native-paper";
import { useHunter } from "./context/HunterContext";


const API_MONGO = "https://hunter-backent.onrender.com"; // 🔧 Cambia por tu endpoint real
const API_NEON = "http://localhost:3003"; 


interface BaseHunter {
  nombre: string;
  edad?: number;
  anime: string;
  nen: { tipo: string; habilidad: string };
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
  tiponen: string;
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

  const [formData, setFormData] = useState<Hunter>({
    nombre: "",
    edad: undefined,
    anime: "Hunter x Hunter",
    nen: { tipo: "", habilidad: "" },
    tiponen: "",
    personalidad: "",
    objetivo: "",
    mejorAmigo: "",
    imagen: "",
  });

  // ✅ Consulta Mongo (Render)
  const fetchHuntersMongo = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_MONGO}/hunters`);
      const data = await res.json();
      setHuntersMongo(data);
    } catch (error) {
      console.error("❌ Error al obtener hunters desde Mongo:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Consulta PostgreSQL (Neon)
  const fetchHuntersNeon = async () => {
    try {
      const res = await fetch(`${API_NEON}/personajes_hunter`);
      const data = await res.json();
      setHuntersNeon(data);
    } catch (error) {
      console.error("❌ Error al obtener hunters desde Neon:", error);
    }
  };

   // ✅ Se ejecuta cuando carga la pantalla
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
      nen: { tipo: "", habilidad: "" },
      tiponen: "",
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
    nen: {
      tipo: hunter.nen?.tipo ?? "",
      habilidad: hunter.nen?.habilidad ?? "",
    },
    tiponen: "",
    personalidad: hunter.personalidad,
    objetivo: hunter.objetivo,
    mejorAmigo: hunter.mejorAmigo,
    imagen: hunter.imagen,
  });
  setShowForm(true);
};

const handleDelete = (hunter: Hunter) => {
  if (!isMongoHunter(hunter) || !hunter._id) return;

  Alert.alert("Confirmar", "¿Deseas eliminar este hunter?", [
    { text: "Cancelar", style: "cancel" },
    {
      text: "Eliminar",
      style: "destructive",
      onPress: async () => {
        try {
          console.log(`🗑️ Eliminando hunter con ID: ${hunter._id}`);

          const res = await fetch(`${API_MONGO}/hunters/${hunter._id}`, {
            method: "DELETE",
          });

          if (res.ok) {
            fetchHuntersMongo(); // refresca la lista
          } else {
            console.error("❌ Error en el DELETE:", await res.text());
          }
        } catch (error) {
          console.error("⚠️ Error eliminando hunter:", error);
        }
      },
    },
  ]);
};

// ✅ Eliminar en Neon
const handleDeleteNeon = (hunter: Hunter) => {
  if (!isNeonHunter(hunter) || !hunter.id) return;

  Alert.alert("Confirmar", "¿Deseas eliminar este hunter?", [
    { text: "Cancelar", style: "cancel" },
    {
      text: "Eliminar",
      style: "destructive",
      onPress: async () => {
        try {
          console.log(`🗑️ Eliminando hunter de Neon con ID: ${hunter.id}`);

          const res = await fetch(`${API_NEON}/personajes_hunter/${hunter.id}`, {
            method: "DELETE",
          });

          if (res.ok) {
            fetchHuntersNeon(); // 🔄 refresca la lista de Neon
          } else {
            console.error("❌ Error en el DELETE Neon:", await res.text());
          }
        } catch (error) {
          console.error("⚠️ Error eliminando hunter en Neon:", error);
        }
      },
    },
  ]);
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
                      {isNeonHunter(item) && <Text>Tipo Nen: {item.tiponen}</Text>}
                     
                     
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
                <Text>Tipo Nen: {item.nen.tipo}</Text>
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
            value={formData.nen.tipo}
            onChangeText={(t) =>
              setFormData({ ...formData, nen: { ...formData.nen, tipo: t } })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Habilidad Nen"
            value={formData.nen.habilidad}
            onChangeText={(t) =>
              setFormData({ ...formData, nen: { ...formData.nen, habilidad: t } })
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