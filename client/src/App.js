import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getTodos();

  }, [todos]);

  const BASE_URL = 'http://localhost:3001'

  const getTodos = () => {
     fetch(BASE_URL + '/todos')
     .then(res => res.json())
     .then(data => setTodos(data))
     .catch(err => console.error("error", err))
  };

  return (
    <div className="App">
      <h1>Todo</h1>
      <form action='http://localhost:3001/todos/new' method='post'>
      <input type='text' name="text" placeholder="enter your note" required/>
      <button type='submit'>Add Note</button>
      </form>
      {todos.map((todo) => {
        return <div className="todo" key={todo._id}>
                 <input className="checkbtn" type="checkbox" checked={todo.completed} disabled />
                 <p className="todoText">{todo.text}</p>
                 <button className="deleteBtn">Delete</button>
               </div>
      })}
    </div>
  );
}

export default App;
