import { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const BASE_URL = 'http://localhost:3001'

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch( BASE_URL + '/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        })

        const data = await response.json();

        if (response.ok) {
            setMessage(data.message);
        } else {
            setMessage(data.message);
        }
    }

    return (
        <div className='login'>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
            <input type='text' name="username" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
            <input type='password' name="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
            <button type='submit'>Register</button>
            <Link to='/'>
            <button>Login</button>
            </Link>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}

export default Register;