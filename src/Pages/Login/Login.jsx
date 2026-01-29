import React, { useState } from 'react';
import styles from './Login.module.css';

export default function Login() {
    const [newAccount, setNewAccount] = useState(false); // True means sign-up, false means login
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (newAccount) {
            // Handle signup
            if (password !== confirmPassword) {
                setError("Passwords do not match!");
                return;
            }
            handleRegister(username, password);
        } else {
            // Handle login
            handleLogin(username, password);
        }
    };

    // Register user
    const handleRegister = async (username, password) => {
        setLoading(true);
        const response = await fetch('http://localhost:8080/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        setLoading(false);

        if (response.ok) {
            console.log('User created:', data);
            alert('User created successfully! You can now log in.');
            setNewAccount(false); // Switch to login form
        } else {
            setError(data.message || 'An error occurred during registration.');
        }
    };

    // Login user
    const handleLogin = async (username, password) => {
        setLoading(true);
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        setLoading(false);

        if (response.ok) {
            console.log('Login successful:', data.token);
            localStorage.setItem('authToken', data.token); // Save the token to local storage
            alert('Login successful!');
        } else {
            setError(data.message || 'Invalid credentials');
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.h2}>{newAccount ? 'Sign Up' : 'Log In'}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.div}>
                    <label htmlFor="username" className={styles.label}>Username:</label>
                    <input 
                        type="text" 
                        id="username" 
                        value={username} 
                        className={styles.input}
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div className={styles.div}>
                    <label htmlFor="password" className={styles.label}>Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        className={styles.input}
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                {newAccount && (
                    <div className={styles.div}>
                        <label htmlFor="confirmPassword" className={styles.label}>Confirm Password:</label>
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            value={confirmPassword} 
                            className={styles.input}
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                        />
                    </div>
                )}
                {error && <p className={styles.error}>{error}</p>}
                <button 
                    type="submit" 
                    id={styles.login}
                    className={styles.button}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : newAccount ? 'Sign Up' : 'Log In'}
                </button>
            </form>
            <button 
                id={styles.toggleButton}
                className={styles.button}
                onClick={() => setNewAccount(!newAccount)}
            >
                {newAccount ? 'Already have an account? Log in' : 'Don\'t have an account? Sign up'}
            </button>
        </div>
    );
}
