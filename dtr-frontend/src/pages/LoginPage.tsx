import {useState} from 'react';
import {login} from '../api/authApi';
import { saveAuthToken } from '../services/authService';
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

        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <form onSubmit={handleLogin} className="w-full max-w-md rounded border bg-white p-6">
                <h1 className="mb-6 text-2xl font-bold">
                    Login
                </h1>

                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block font-medium">Username</label>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full max-w-md rounded border p-2"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full max-w-md rounded border p-2"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="mt-6 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Login
                </button>
            </form>
        </div>

    )
    // Handle Login
}

export default LoginPage;