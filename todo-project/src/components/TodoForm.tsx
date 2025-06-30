import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

type Props = {
  addTodo: (task: string) => void;
};

const TodoForm: React.FC<Props> = ({ addTodo }) => {
  const [task, setTask] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo(task);
    setTask("");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", gap: 2 }}
    >
      <TextField
        fullWidth
        variant="outlined"
        label="Enter a task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <Button variant="contained" type="submit">
        Add
      </Button>
    </Box>
  );
};

export default TodoForm;
