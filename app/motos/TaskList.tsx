import { useState } from "react";
import { Button, StyleSheet, Switch, Text, TextInput, View } from "react-native";

type Todo = {
  id: number;
  title: string;
  done: boolean;
};

type TaskListProps = {
  todos: Todo[];
  onChangeTodo: (todo: Todo) => void;
  onDeleteTodo: (id: number) => void;
};

export default function TaskList({ todos, onChangeTodo, onDeleteTodo }: TaskListProps) {
  return (
    <View style={styles.list}>
      {todos.map((todo) => (
        <Task key={todo.id} todo={todo} onChange={onChangeTodo} onDelete={onDeleteTodo} />
      ))}
    </View>
  );
}

type TaskProps = {
  todo: Todo;
  onChange: (todo: Todo) => void;
  onDelete: (id: number) => void;
};

function Task({ todo, onChange, onDelete }: TaskProps) {
  const [isEditing, setIsEditing] = useState(false);

  let todoContent;
  if (isEditing) {
    todoContent = (
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={todo.title}
          onChangeText={(text) =>
            onChange({
              ...todo,
              title: text,
            })
          }
        />
        <Button title="Save" onPress={() => setIsEditing(false)} />
      </View>
    );
  } else {
    todoContent = (
      <View style={styles.row}>
        <Text style={styles.text}>{todo.title}</Text>
        <Button title="Edit" onPress={() => setIsEditing(true)} />
      </View>
    );
  }

  return (
    <View style={styles.task}>
      <Switch
        value={todo.done}
        onValueChange={(value) =>
          onChange({
            ...todo,
            done: value,
          })
        }
      />
      {todoContent}
      <Button title="Delete" color="red" onPress={() => onDelete(todo.id)} />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 10,
  },
  task: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
    gap: 5,
  },
  text: {
    fontSize: 16,
    flex: 1,
  },
  input: {
    borderBottomWidth: 1,
    flex: 1,
    fontSize: 16,
  },
});
