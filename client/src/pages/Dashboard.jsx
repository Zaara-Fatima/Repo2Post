import React, { useState } from 'react'
import { api } from '../api/apiInstance'
import { RepositoryResult } from '../components/RepositoryResult'

export const Dashboard = () => {
  const [url, setUrl]= useState("")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const [error, setError] = useState("")

  const handleSubmit = async(e)=>{
    e.preventDefault()
    if (!url.trim()) {
    setError("GitHub URL is required");
    return;
}
    setError("")
    setLoading(true)

    try {
      const response = await api.post("/repositories/analyze",{ url})
      console.log("REPOSITORY:", response.data);
      setData(response.data.repo)
      console.log("API RESPONSE:", response);

    } catch (error) {
      setError(error.response?.data?.message || "Github Calling Failed")
    }finally{
      setLoading(false)
    }
  }
  return (
    <div className='min-h-screen bg-gray-950 px-4 py-10 text-white'>
    <div className='mx-auto flex w-full max-w-5xl flex-col gap-6'>
      <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>

      {error && <div className='rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400'>{error}</div>}
      <form onSubmit={handleSubmit} className='rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl'>
      <label className='mb-2 block text-sm font-semibold text-gray-300'> Github Repository URL</label>
        <input name='text'
        placeholder='Repository URL'
        className='w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-gray-200 outline-none transition placeholder:text-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
        type='text'
        value={url}
        onChange={(e)=>setUrl(e.target.value)}/>
        <button type='submit' disabled={loading} className='mt-4 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50'>
          {loading ? "Analyzing..." : "Analyze Repository"}
        </button>
       

      </form>
      {data.name && <RepositoryResult repository={data}/>}
      </div>
    </div>
  )
}
