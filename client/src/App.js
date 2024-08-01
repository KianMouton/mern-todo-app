import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getTodos();

  }, []);

  const BASE_URL = 'http://localhost:3001'

  const getTodos = () => {
     fetch(BASE_URL + '/todos')
     .then(res => res.json())
     .then(data => setTodos(data))
     .catch(err => console.error("error", err))
  };

  const deleteTodo = async (id) => {

    try {
      await fetch(BASE_URL + '/todos/delete/' + id, {
        method: 'DELETE',
      })

     setTodos((prevTodos) => prevTodos.filter(todo => todo._id !== id));
    }
    catch(err) {
      console.error("error", err)
    }
  }

  const checkTodo = async (id) => {
    
    try {
      await fetch(BASE_URL + '/todos/check/' + id, {
        method: 'POST',
      })
    }
    catch(err) {
      console.error("error", err)
    }
  }

  const handleCheck =(e) => {
    const checkBox = e.target;
    if (checkBox.checked) {
      checkBox.nextElementSibling.classList.add('checked');
    }
    else {
      checkBox.nextElementSibling.classList.remove('checked');
    }
    
    const pElement = checkBox.nextElementSibling;
    console.log(pElement);

    getTodos();
  } 

  return (
    <div className="App">
      <h1>Todo</h1>
      <form onSubmit={getTodos} action='http://localhost:3001/todos/new' method='post'>
      <input type='text' name="text" placeholder="enter your note" required/>
      <button type='submit'>Add Note</button>
      </form>
      {todos.map((todo) => {
        return <div className="todo" key={todo._id}>
                 <input onClick={() => checkTodo(todo._id)}
                  onChange={handleCheck}
                  className="checkbtn"
                  type="checkbox"
                  checked={todo.completed}/>
                 <p className="todoText">{todo.text}</p>
                 <button onClick={() => deleteTodo(todo._id)} className="deleteBtn">Delete</button>
               </div>
      })}
    </div>
  );
}

export default App;
