import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/apiInstance'

export const Register = () => {

    const navigate = useNavigate()

    const [formData, setFormData]= useState({
        name:"",
        email:"",
        password:""
    })

    const [error, setError] =useState("")

    const [loading, setLoading] = useState(false)

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError("")
        setLoading(true)
        try {
            await api.post("/auth/register",formData)
            navigate("/login")
        } catch (error) {
            setError(
                error.response?.data?.message || "Registration failed"
            )
        }finally{
            setLoading(false)
        }
    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
    <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 text-white shadow-2xl">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">Create Account</h1>
        {error && <p className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type='text' name='name'
            placeholder='Name'
            className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-gray-200 outline-none transition placeholder:text-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            value={formData.name}
            onChange={handleChange}
             />
            <input type='email' name='email'
            placeholder='Email'
            className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-gray-200 outline-none transition placeholder:text-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            value={formData.email}
            onChange={handleChange}
             />
            <input type='password' name='password'
            placeholder='Password'
            className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-gray-200 outline-none transition placeholder:text-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            value={formData.password}
            onChange={handleChange}
             />

            <button type='submit' disabled={loading} className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
                {loading?"Creating...":"Register"}
            </button>
        </form>

        <button onClick={()=>navigate("/login")} className="mt-6 w-full text-center text-sm text-gray-400 transition hover:text-indigo-400">
            Already have an account? Login
        </button>
    </div>
    </div>
  )
}
