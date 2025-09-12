import { useSelector, useDispatch } from "react-redux";
import { toggleTask, removeTask } from "../features/tasks/taskSlice";
import {
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const TaskList = () => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const filter = useSelector((state) => state.tasks.filter);
  const dispatch = useDispatch();

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true; // "all" case
  });

  return (
    <List>
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <ListItem
            key={task.id}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Checkbox
              checked={task.completed}
              onChange={() => dispatch(toggleTask(task.id))}
            />
            <ListItemText
              primary={task.text}
              sx={{ textDecoration: task.completed ? "line-through" : "none" }}
            />
            <IconButton
              onClick={() => dispatch(removeTask(task.id))}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText primary="No tasks found" />
        </ListItem>
      )}
    </List>
  );
};

export default TaskList;
