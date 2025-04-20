import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
    return emailRegex.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!validateEmail(email)) {
      toast.error('Invalid email format.');
      return;
    }
  
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }
  
    try {
      await axios.post('http://localhost:8000/signup', {
        username,
        password,
        email_id: email,
      });
      toast.success('Signup successful!');
      navigate('/login'); // Redirect to Login after signup
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Signup failed. Please try again.');
      console.error('Signup failed:', error.response?.data);
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen flex items-center justify-center">
      <div className="form-container bg-gray-900 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <ToastContainer />
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-400">Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition duration-300"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>

  );
};

export default Signup;
