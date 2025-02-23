import React from "react";
import { ListItem, ListItemText, IconButton, Checkbox } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  todo: { id: number; task: string; completed: boolean };
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
};

const TodoItem: React.FC<Props> = ({ todo, toggleTodo, removeTodo }) => {
  return (
    <ListItem
      sx={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Checkbox checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
      <ListItemText
        primary={todo.task}
        sx={{ textDecoration: todo.completed ? "line-through" : "none" }}
      />
      <IconButton edge="end" onClick={() => removeTodo(todo.id)}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
};

export default TodoItem;
