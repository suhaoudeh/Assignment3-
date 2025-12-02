import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setForm({ ...form, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form)
            })

            if (!response.ok) {
                let err = { message: response.statusText };
                try { err = await response.json(); } catch (e) { }
                throw new Error(err.message || 'Failed to login');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.username);
            if (setUser) {
                setUser({ username: data.user.username });
            }
            navigate('/');

        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div className='container mt-4'>
            <h1 className='text-center'>Login</h1>
            {error && <div className='alert alert-danger'>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor='email'>Email</label>
                    <input type='text' id='email' name='email' value={form.email} onChange={handleChange} className='form-control' required />
                </div>
                <div className="form-group">
                    <label htmlFor='password'>Password</label>
                    <input type='password' id='password' name='password' value={form.password} onChange={handleChange} className='form-control' required />
                </div>
                <button type='submit' className='btn btn-primary'>Login</button>
            </form>
        </div>
    )
}

export default Login;
