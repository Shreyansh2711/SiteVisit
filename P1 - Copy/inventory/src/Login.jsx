import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        login_id: loginId,
        password: password
      });

      if (res.data.message === 'Login successful' && res.data.user) {
        const { id, role } = res.data.user;

        // Save to localStorage
        localStorage.setItem('user_id', id);
        localStorage.setItem('user_role', role); // ✅ Correct key

        onLogin(); // ✅ Refresh login state in App

        alert(res.data.message);

        // Navigate after login
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/site-visit');
        }
      } else {
        alert('Login failed. Please try again.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Login ID"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          required
          className="w-full p-3 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border rounded-lg"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition">
          Login
        </button>
        <p className="text-sm text-right text-blue-600 cursor-pointer hover:underline">Forgot password?</p>
      </form>
    </div>
  );
};

export default Login;
