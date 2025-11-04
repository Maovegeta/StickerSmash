import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal, ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from "react-native";
import { Button } from "react-native-paper";
import { useHunter } from "./context/HunterContext";

const API_URL = "https://hunter-backent.onrender.com"; // 🔧 Cambia por tu endpoint real

type Hunter = {
  _id?: string;
  nombre: string;
  edad?: number;
  anime: string;
  nen: { tipo: string; habilidad: string };
  personalidad: string;
  objetivo: string;
  mejorAmigo: string;
  imagen: string;
};

export default function HunterScreen() {
  const { setHunterSeleccionado } = useHunter();
  const router = useRouter();

  const [hunters, setHunters] = useState<Hunter[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingHunter, setEditingHunter] = useState<Hunter | null>(null);
  const [formData, setFormData] = useState<Hunter>({
    nombre: "",
    edad: undefined,
    anime: "Hunter x Hunter",
    nen: { tipo: "", habilidad: "" },
    personalidad: "",
    objetivo: "",
    mejorAmigo: "",
    imagen: "",
  });

  const fetchHunters = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/hunters`);
      const data = await res.json();
      setHunters(data);
    } catch (error) {
      console.error("❌ Error al obtener hunters:", error);
      setHunters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    try {
      const method = editingHunter ? "PUT" : "POST";
      const url = editingHunter
        ? `${API_URL}/hunters/${editingHunter._id}`
        : `${API_URL}/hunters`;
      console.log("Body enviado:", JSON.stringify(formData, null, 2));
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchHunters();
        setShowForm(false);
        setEditingHunter(null);
        setFormData({
          nombre: "",
          edad: undefined,
          anime: "Hunter x Hunter",
          nen: { tipo: "", habilidad: "" },
          personalidad: "",
          objetivo: "",
          mejorAmigo: "",
          imagen: "",
        });
      }
    } catch (error) {
      console.error("Error guardando hunter:", error);
    }
  };

const handleDelete = async (id: string) => {
  Alert.alert("Confirmar", "¿Deseas eliminar este hunter?", [
    { text: "Cancelar", style: "cancel" },
    {
      text: "Eliminar",
      style: "destructive",
      onPress: async () => {
        try {
          console.log(`🗑️ Eliminando hunter con ID: ${id}`);

          const res = await fetch(`${API_URL}/hunters/${id}`, {
            method: "DELETE",
          });

          if (res.ok) {
            fetchHunters(); // refresca la lista
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

  const startEdit = (hunter: Hunter) => {
    setEditingHunter(hunter);
    setFormData(hunter);
    setShowForm(true);
  };

  useEffect(() => {
    fetchHunters();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setEditingHunter(null);
          setShowForm(true);
        }}
      >
        <Text style={styles.addButtonText}>➕ Nuevo Hunter</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={hunters}
          keyExtractor={(item) => item._id!}
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
                  onPress={() => handleDelete(item._id!)}
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
});