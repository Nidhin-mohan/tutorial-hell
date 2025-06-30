<<<<<<< HEAD
import { useState } from 'react'
import './App.css'
import Count from './components/Count';
import { useDispatch } from 'react-redux';

function App() {
  const dispatch = useDispatch();
  

  return (
    <>
    <Count />
      <button onClick={(e) => {dispatch({type: "INCREMENT"})}}>Increment</button>
      <button onClick={(e) => {dispatch({type: "DECREMENT"})}}>Decrement</button>
    </>
  );
}

export default App
=======
import { Container, Typography } from "@mui/material";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import TaskFilter from "./components/TaskFilter";

const App = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Task Manager
      </Typography>
      <TaskInput />
      <TaskFilter />
      <TaskList />
    </Container>
  );
};

export default App;
>>>>>>> d8f1981 (task with redux)
