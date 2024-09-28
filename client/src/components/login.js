import { Link, useNavigate } from 'react-router-dom';
import { useState} from 'react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
    
        if (response.ok) {
            const data = await response.json();
            console.log(data.message); 
            navigate("/notes");
        } else {
            const errorData = await response.json();
            alert(errorData.message); 
        }
    }

    return (
        <div className='login'>
            <h1>Login</h1>
            <form >
                <div className='user-and-pass'>
                <input type='text' name="username" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                <input type='password' name="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <button onSubmit={handleLogin} type='submit'>Login</button>
                <p>don't have a account?</p>
                <Link to='/register'>
                <button>Register</button>
                </Link>
            </form>
        </div>
    )
}

export default Login;