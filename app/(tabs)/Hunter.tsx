import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { useHunter } from "./context/HunterContext";

const API_URL = "https://hunter-backent.onrender.com"; // 🔧 Cambia por tu endpoint real

  type Hunter = {
    _id?: string;
    nombre: string;
    edad?: number | string;
    anime?: string;
    nen?: { tipo?: string; habilidad?: string };
    personalidad?: string;
    objetivo?: string;
    mejorAmigo?: string;
    imagen?: string;
  };

  export default function HunterScreen() {
    const { hunters, setHunterSeleccionado, addHunter, updateHunter } = useHunter();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
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
        if (!res.ok) throw new Error('Error al obtener hunters');
      } catch (error) {
        console.error("❌ Error al obtener hunters:", error);
        Alert.alert("Error", "No se pudieron cargar los hunters");
      } finally {
        setLoading(false);
      }
    };

    const handleSave = async () => {
      if (!formData.nombre.trim()) {
        Alert.alert("Error", "El nombre es obligatorio");
        return;
      }

      try {
        if (editingHunter?._id) {
          // Actualizar hunter existente
          const response = await fetch(`${API_URL}/hunters/${editingHunter._id}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

          if (response.ok) {
            updateHunter({ ...formData, _id: editingHunter._id });
          } else {
            throw new Error('Error al actualizar');
          }
        } else {
          // Crear nuevo hunter
          const response = await fetch(`${API_URL}/hunters`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

          if (response.ok) {
            const newHunter = await response.json();
            addHunter(newHunter);
          } else {
            throw new Error('Error al crear');
          }
        }

        // Limpiar formulario
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
      } catch (error) {
        console.error("Error guardando hunter:", error);
        Alert.alert("Error", "No se pudo guardar el hunter");
      }
    };

    const handleDelete = async (id?: string) => {
      if (!id) return;
      Alert.alert("Confirmar", "¿Deseas eliminar este hunter?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(`${API_URL}/hunters/${id}`, {
                method: "DELETE",
              });
              if (res.ok) fetchHunters();
            } catch (error) {
              console.error("Error eliminando hunter:", error);
            }
          },
        },
      ]);
    };

    const startEdit = (hunter: Hunter) => {
      // Asegurar que edad sea number si existe
      const formattedHunter = {
        ...hunter,
        edad: hunter.edad ? Number(hunter.edad) : undefined
      };
      setEditingHunter(formattedHunter);
      setFormData(formattedHunter);
    };

    useEffect(() => {
      fetchHunters();
    }, []);

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.formTitle}>
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
          value={formData.nen?.tipo || ""}
          onChangeText={(t) =>
            setFormData({ ...formData, nen: { ...(formData.nen || {}), tipo: t } })
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Habilidad Nen"
          value={formData.nen?.habilidad || ""}
          onChangeText={(t) =>
            setFormData({ ...formData, nen: { ...(formData.nen || {}), habilidad: t } })
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
          placeholder="URL Imagen"
          value={formData.imagen}
          onChangeText={(t) => setFormData({ ...formData, imagen: t })}
        />

        <View style={styles.buttonRow}>
          <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
            {editingHunter ? "Actualizar" : "Guardar"}
          </Button>

          <Button
            mode="contained"
            onPress={() => {
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
            }}
            style={styles.cancelButton}
          >
            Cancelar
          </Button>
        </View>

        <Text style={styles.sectionTitle}>Hunters Registrados</Text>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={hunters}
            keyExtractor={(item) => item._id ?? item.nombre}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <TouchableOpacity
                  onPress={() => {
                    setHunterSeleccionado(item);
                    router.push("/hunterdetalle");
                  }}
                >
                  <Text style={styles.name}>{item.nombre}</Text>
                  <Text>Edad: {item.edad}</Text>
                  <Text>Nen: {item.nen?.tipo}</Text>
                </TouchableOpacity>

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
                    onPress={() => handleDelete(item._id)}
                    style={styles.deleteButton}
                  >
                    Eliminar
                  </Button>
                </View>
              </View>
            )}
          />
        )}
      </ScrollView>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    formTitle: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
    sectionTitle: { fontSize: 18, fontWeight: "600", marginTop: 16, marginBottom: 8 },
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