"use client";

import { BASE_API_URL } from "@/global";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterStanPage = () => {
  const [namaStan, setNamaStan] = useState("");
  const [namaPemilik, setNamaPemilik] = useState("");
  const [telp, setTelp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const url = `${BASE_API_URL}/register_stan`;

      const formData = new FormData();
      formData.append("nama_stan", namaStan);
      formData.append("nama_pemilik", namaPemilik);
      formData.append("telp", telp);
      formData.append("username", username);
      formData.append("password", password);

      const { data } = await axios.post(url, formData, {
        headers: {"Content-Type":"application/json", "makerID": 1},
      });

      if (data.success) {
        toast.success("Register stan berhasil");
        setTimeout(() => {
          router.replace("/login");
        }, 1200);
      } else {
        toast.warning(data.message || "Register gagal");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat register");
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex items-center justify-center p-6">
      <ToastContainer />

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT */}
        <div className="p-10">
          <h1 className="text-3xl font-bold text-blue-400">
            Daftar Stan Kantin
          </h1>
          <p className="text-gray-500 mb-8">
            Isi data pemilik stan dengan benar ya!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-blue-400">
             <input
              type="text"
              placeholder="Nama Stan"
              value={namaStan}
              onChange={(e) => setNamaStan(e.target.value)}
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />
            <input
              type="text"
              placeholder="Nama Pemilik"
              value={namaPemilik}
              onChange={(e) => setNamaPemilik(e.target.value)}
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />

            <input
              type="text"
              placeholder="Nomor Telepon"
              value={telp}
              onChange={(e) => setTelp(e.target.value)}
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />

            <p className="text-center text-xs text-gray-400">udah?</p>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
            >
              SUBMIT
            </button>
          </form>
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center justify-center bg-blue-100">
          <Image
            src="/image/login-ill.png"
            alt="register stan illustration"
            width={420}
            height={420}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterStanPage;
