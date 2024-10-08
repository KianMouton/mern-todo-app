import { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [checkedTodos, setCheckedTodos] = useState([]);
  const [user, setUser] = useState();

  useEffect(() => {
    getUser();
    getTodos();

  }, [checkedTodos]);

  const BASE_URL = 'http://localhost:3001'

  const getUser = () => {
    const token = localStorage.getItem('token');
    fetch(BASE_URL + '/user', {
      method: "GET",
      headers: {
        'Authorization': 'Bearer' + token,
      },
      credentials: 'include', 
     })
     .then(res => res.json())
     .then(data => setUser(data))
     .catch(err => console.error("error", err))
  }

  const getTodos = () => {
    const token = localStorage.getItem('token');

     fetch(BASE_URL + '/todos', {
      method: "GET",
      headers: {
        'Authorization': 'Bearer' + token,
      },
      credentials: 'include', 
     })
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

  const handleCheck = async (e, id) => {
    //send the check to the database
    try {
      const response = (await fetch(BASE_URL + '/todos/check/' + id, { method: 'POST' }));
      const toCheck = await response.json();
      const text = e.target.nextElementSibling;
      if (toCheck.checked.completed) {
        text.classList.add('checked');
      } else {
        text.classList.remove('checked');
      }
    }
    catch(err) {
      console.error('could not send data to the server');
      alert('could not send data the data to the server');
    }
    
    if (checkedTodos.includes(id)) {
      setCheckedTodos(checkedTodos.filter(todoId => todoId !== id));
    } else {
      setCheckedTodos([...checkedTodos, id]);
    }
  } 

  return (
    <div className="App">
      <div className='todos'>
      <p className='username'>logged in as {user}</p>
      <h1>Todo</h1>
      <form onSubmit={getTodos} action='http://localhost:3001/todos/new' method='post'>
      <input type='text' name="text" placeholder="enter your note" required/>
      <button type='submit'>Add Note</button>
      </form>
      {todos.map((todo) => {
        return <div className="todo" key={todo._id}>
                 <input
                  onClick={(e) => handleCheck(e, todo._id)}
                  className="checkbtn"
                  type="checkbox"
                  checked={todo.completed}/>
                  <p className="todoText">{todo.text}</p>
                  <button onClick={() => deleteTodo(todo._id)} className="deleteBtn">Delete</button>
               </div>
      })}
      </div>
      <div className='completed'>
        <h2>Completed</h2>
        {todos.filter((todo) => todo.completed === true).map((todo) => {
          return <div className="todo" key={todo._id}>
            <input
                onClick={() => handleCheck(todo._id)}
                className="checkbtn"
                type="checkbox"
                checked={todo.completed}/>
                <p className="todoText">{todo.text}</p>
                <button onClick={() => deleteTodo(todo._id)} className="deleteBtn">Delete</button>
          </div> 
        })}
      </div>
    </div>
  );
}

export default App;
