
const Register = () => {

    return (
        <div className='login'>
            <h1>Register</h1>
            <form>
            <input type='text' name="username" placeholder="username" required/>
            <input type='password' name="password" placeholder="password" required/>
            <button type='submit'>Register</button>
            </form>
        </div>
    )
}

export default Register;