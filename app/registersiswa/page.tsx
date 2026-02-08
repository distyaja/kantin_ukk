"use client"

import { BASE_API_URL } from "@/global"
import { storeCookie } from "@/lib/client-cookie"
import axios from "axios"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const RegisterPage = () => {
  const [name, setName] = useState("")
  const [alamat, setAlamat] = useState("")
  const [telp, setTelp] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const url = `${BASE_API_URL}/register_siswa`
      const formData = new FormData()
      formData.append("nama_siswa", name)
      formData.append("alamat", alamat)
      formData.append("telp", telp)
      formData.append("username", username)
      formData.append("password", password)

      const { data } = await axios.post(url, formData, {
        headers: { makerID: "1" }
      })

      if (data.success) {
        toast.success("Register berhasil")
        setTimeout(() => router.replace("/login"), 1200)
      } else {
        toast.warning(data.message || "Register gagal")
      }
    } catch (err) {
      toast.error("Terjadi kesalahan")
    }
  }

  return (
    <div className="min-h-screen bg-yellow-100 flex items-center justify-center p-6">
      <ToastContainer />

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        {/* LEFT - FORM */}
        <div className="p-10">
          <h1 className="text-3xl font-bold text-blue-400">
            Halo, Warga Kantin
          </h1>
          <p className="text-gray-500 mb-8">
            Masukkan data dirimu ya!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-blue-400">
            <input
              type="text"
              placeholder="Nama"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="text"
              placeholder="Alamat"
              value={alamat}
              onChange={e => setAlamat(e.target.value)}
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />

            <input
              type="text"
              placeholder="Telepon"
              value={telp}
              onChange={e => setTelp(e.target.value)}
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />

            {/* Upload Foto */}
            <div className="border rounded-md px-4 py-2 text-sm text-gray-500">
              <label className="cursor-pointer">
                📷 pilih foto profil
                <input type="file" className="hidden" />
              </label>
            </div>

            <p className="text-center text-xs text-gray-400">udah?</p>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
            >
              SUBMIT
            </button>
          </form>
        </div>

        {/* RIGHT - IMAGE */}
        <div className="hidden md:flex items-center justify-center bg-blue-100">
          <Image
            src="/image/login-ill.png"
            alt="register illustration"
            width={420}
            height={420}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
