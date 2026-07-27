import {useState} from 'react';
import {login} from '../api/authApi';
import { getToken, saveAuthToken } from '../services/authService';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin(event: React.SyntheticEvent<HTMLFormElement>) {

        event.preventDefault();

        try{
            const response = await login({ username, password });
            saveAuthToken(response);
            console.log('Login successful:');
            console.log(getToken());
            // Handle successful login, e.g., store token, redirect, etc.
        } catch (error) {
            console.error('Login failed:', error);
        }
    }

    return(

        <form onSubmit={handleLogin}>
            <div>
                <label>Username</label>

                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div>
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button type="submit">Login</button>
        </form>

    )
    // Handle Login
}

export default LoginPage;