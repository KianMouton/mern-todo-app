import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/login.js';
import Register from './components/register.js';
import Notes from './components/notes.js';
import './App.css'

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/notes" element={<Notes />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </div>
  );
};

export default App;