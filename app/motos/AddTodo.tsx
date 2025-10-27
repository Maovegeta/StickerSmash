import { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";

type AddTodoProps = {
  onAddTodo: (title: string) => void;
};

export default function AddTodo({ onAddTodo }: AddTodoProps) {
  const [title, setTitle] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add todo"
        value={title}
        onChangeText={setTitle} 
      />
      <Button
        title="Add"
        onPress={() => {
          onAddTodo(title);
          setTitle("");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    margin: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
  },
});
