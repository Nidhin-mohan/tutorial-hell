import React from "react";
import { List } from "@mui/material";
import TodoItem from "./TodoItem";
// import TodoItem from "./TodoIt  ";

type Props = {
  todos: { id: number; task: string; completed: boolean }[];
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
};

const TodoList: React.FC<Props> = ({ todos, toggleTodo, removeTodo }) => {
  return (
    <List>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo}
          removeTodo={removeTodo}
        />
      ))}
    </List>
  );
};

export default TodoList;
