import { Link } from 'react-router-dom';

const Login = () => {

    return (
        <div className='login'>
            <h1>Login</h1>
            <form >
                <div className='user-and-pass'>
                <input type='text' name="username" placeholder="username" required/>
                <input type='password' name="password" placeholder="password" required/>
                </div>
                <button type='submit'>Login</button>
                <p>don't have a account?</p>
                <Link to='/register'>
                <button>Register</button>
                </Link>
            </form>
        </div>
    )
}

export default Login;