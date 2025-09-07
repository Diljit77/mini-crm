import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../utils/api'
import { useThemeStore } from '../store/useThemeStore'
import { Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const { theme } = useThemeStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
        setIsLoading(true);
      const res = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard');
      setIsLoading(false);
      toast.success("Login successful!");
    } catch (err: any) {
      toast.error((err.response?.data?.message || 'Login failed'))
      setIsLoading(false);
    }
  }

  return (
    <div
      className="flex items-center justify-center h-screen bg-gradient-to-br from-base-200 via-base-300 to-base-200"
      data-theme={theme}
    >
      <div className="card w-full max-w-md bg-base-100/80 backdrop-blur-lg shadow-2xl rounded-2xl">
        <div className="card-body p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Welcome Back</h2>
          <p className="text-sm text-center text-base-content/70 mb-6">
            Login to your account
          </p>

      <form onSubmit={submit} className="space-y-4 w-full">
  <div className="form-control w-full">
    <label className="input input-bordered flex items-center gap-2 w-full">
      <Mail className="size-4 text-base-content/70" />
      <input
        type="email"
        className="grow"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
    </label>
  </div>

  <div className="form-control w-full">
    <label className="input input-bordered flex items-center gap-2 w-full">
      <Lock className="size-4 text-base-content/70" />
      <input
        type="password"
        className="grow"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
    </label>
  </div>

  <button className="btn btn-primary w-full" disabled={isLoading===true}>Login</button>
</form>


          <p className="mt-6 text-sm text-center">
            Don’t have an account?{' '}
            <Link to="/signup" className="link link-primary font-medium">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

