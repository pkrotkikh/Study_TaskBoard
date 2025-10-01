import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + '/api/register',
        { email, password },
        { withCredentials: true })

      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch (err) {
      alert('Register failed')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
        <button className="py-2 px-4 bg-green-600 text-white rounded">Register</button>
      </form>
    </div>
  )
}
