import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
<<<<<<< HEAD
import { store } from './redux/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
=======
import { store } from './app/store.js'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>  
      <App /> 
    </StrictMode>
  </Provider>
>>>>>>> d8f1981 (task with redux)
)
