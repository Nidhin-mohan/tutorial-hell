import { createSlice} from '@reduxjs/toolkit';

const initialState = {
    tasks: [],
    filter: 'all',
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    toggleTask: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    setFilter: (state, action) => {
        console.log("first", state);
        console.log("second", action.payload);
      state.filter = action.payload;
    },
  },
});

export const { addTask, toggleTask, removeTask, setFilter } = taskSlice.actions;
export default taskSlice.reducer;