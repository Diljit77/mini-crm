import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../utils/api'
import { useThemeStore } from '../store/useThemeStore'
import { User, Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignUp() {
  const { theme } = useThemeStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true);
    if (password !== confirm)  {
        toast.error("Passwords do not match");
        setIsLoading(false);
        return;

    }
    try {
      const res = await API.post('/auth/register', { name, email, password })
      localStorage.setItem('token', res.data.token)
toast.success("Signup successful!");
      setIsLoading(false);
      navigate('/dashboard')
    } catch (err: any) {
      toast.error((err.response?.data?.message || 'Signup failed'));
      setIsLoading(false);
    }
  }

  return (
    <div
      className="flex items-center justify-center h-screen bg-gradient-to-br from-base-200 via-base-300 to-base-200"
      data-theme={theme}
    >
      <div className="card w-full max-w-md bg-base-100/90 backdrop-blur-lg shadow-2xl rounded-2xl">
        <div className="card-body p-8">
          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-2">Create Account</h2>
          <p className="text-sm text-center text-base-content/70 mb-6">
            Join us and manage your CRM with ease
          </p>

          {/* Form */}
          <form onSubmit={submit} className="space-y-4 w-full">
            <div className="form-control w-full">
              <label className="input input-bordered flex items-center gap-2 w-full">
                <User className="size-4 text-base-content/70" />
                <input
                  type="text"
                  className="grow"
                  placeholder="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </label>
            </div>

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

            <div className="form-control w-full">
              <label className="input input-bordered flex items-center gap-2 w-full">
                <Lock className="size-4 text-base-content/70" />
                <input
                  type="password"
                  className="grow"
                  placeholder="Confirm Password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                />
              </label>
            </div>

            <button className="btn btn-primary w-full mt-4" disabled={isLoading===true}>Sign Up</button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-sm text-center">
            Already have an account?{' '}
            <Link to="/" className="link link-primary font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
