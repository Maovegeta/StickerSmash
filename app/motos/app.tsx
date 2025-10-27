import { useState } from "react";
import { StyleSheet, View } from "react-native";
import AddTodo from "./AddTodo";
import TaskList from "./TaskList";

type Todo = {
  id: number;
  title: string;
  done: boolean;
};

let nextId = 3;

const initialTodos: Todo[] = [
  { id: 0, title: "KAWASAKI", done: true },
  { id: 1, title: "YAMAHA", done: false },
  { id: 2, title: "SUZUKI", done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  function handleAddTodo(title: string) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title,
        done: false,
      },
    ]);
  }

  function handleChangeTodo(nextTodo: Todo) {
    setTodos(todos.map((t) => (t.id === nextTodo.id ? nextTodo : t)));
  }

  function handleDeleteTodo(todoId: number) {
    setTodos(todos.filter((t) => t.id !== todoId));
  }

  return (
    <View style={styles.container}>
      <AddTodo onAddTodo={handleAddTodo} />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
});
