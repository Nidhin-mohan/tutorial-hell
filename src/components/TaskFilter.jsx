import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../features/tasks/taskSlice";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";

const TaskFilter = () => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.tasks.filter);

  return (
    <ToggleButtonGroup
      value={filter}
      exclusive
      onChange={(e, newFilter) => newFilter && dispatch(setFilter(newFilter))}
      sx={{ mb: 2 }}
    >
      <ToggleButton value="all">All</ToggleButton>
      <ToggleButton value="completed">Completed</ToggleButton>
      <ToggleButton value="pending">Pending</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default TaskFilter;
