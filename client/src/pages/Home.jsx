import React from 'react'
import { useNavigate } from 'react-router-dom'

export const Home = () => {
    const navigate = useNavigate()
  return (
    <div>
        <div className="flex flex-col gap-2 min-h-screen items-center justify-center bg-gray-950 text-4xl font-bold tracking-tight text-indigo-400">Repo2Post
          <div>
            <h1 className="bg-gray-950 text-2xl font-bold tracking-tight text-indigo-950" onClick={()=>navigate('/login')}>Click To Login</h1>
          </div>
        </div>
    </div>
  )
}
