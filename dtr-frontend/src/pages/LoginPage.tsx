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

        <div className="login-page">
            <div className="login-panel">
                <section className="login-intro">
                    <div className="login-mark" aria-hidden="true">D</div>
                    <p className="login-kicker">DTR System</p>
                    <h1>Keep every workday accounted for.</h1>
                    <p className="login-description">
                        A simple workspace for recording attendance, reviewing
                        time entries, and keeping teams aligned.
                    </p>
                    <div className="login-rule" />
                    <p className="login-note">Secure attendance workspace</p>
                </section>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="login-form-heading">
                        <p className="form-eyebrow">Welcome back</p>
                        <h2>Sign in to continue</h2>
                        <p>Use your account credentials to access your dashboard.</p>
                    </div>

                    <div className="login-fields">
                        <div className="login-field">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                            />
                        </div>

                        <div className="login-field">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    <button type="submit" className="login-submit">
                        Sign in
                        <span aria-hidden="true">&#8594;</span>
                    </button>
                </form>
            </div>
        </div>

    )
    // Handle Login
}

export default LoginPage;