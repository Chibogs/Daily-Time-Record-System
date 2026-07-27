import {useState} from 'react';
import {login} from '../api/authApi';
import { getToken, saveAuthToken } from '../services/authService';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const auth  = useAuth();

    async function handleLogin(event: React.SyntheticEvent<HTMLFormElement>) {

        event.preventDefault();

        try{
            const response = await login({ username, password });
            saveAuthToken(response);

            auth.login({
                username: response.username,
                fullName: response.fullName,
                role: response.role,
                expiresAt: response.expiresAt
            });
            // console.log('Login successful:');
            // console.log(getToken());
            navigate('/dashboard');
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