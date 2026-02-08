"use client";

import { BASE_API_URL } from "../../global";
import { storeCookie } from "../../lib/client-cookie";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginStanPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const url = `${BASE_API_URL}/login_stan`;

      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const { data } = await axios.post(url, formData, {
        headers: {"Content-Type": "multipart/form-data", makerID: "1",},
      });

      // sesuaikan dengan response backend kamu
      if (data.logged || data.token || data.access_token) {
        toast.success(data.message || "Login berhasil");

        storeCookie("token", data.token || data.access_token);
        storeCookie("id", data.data?.id || data.user?.id);
        storeCookie("username", data.data?.username || data.user?.username);
        storeCookie("role", "stan");

        setTimeout(() => {
          router.replace("/stan/dashboard");
        }, 1200);
      } else {
        toast.warning(data.message || "Login gagal");
      }
    } catch (error) {
      toast.error("Login gagal");
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex items-center justify-center p-6">
      <ToastContainer />

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* LEFT */}
        <div className="p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">
            Login Stan Kantin
          </h1>
          <p className="text-gray-500 mb-8">
            Masuk untuk mengelola stan kamu 🍱
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-blue-400">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-md border focus:ring-2 focus:ring-blue-200 text-blue-400 focus:outline-none"
                placeholder="Masukkan username"
                required
              />
            </div>

            <div>
              <label className="text-sm text-blue-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-md border focus:ring-2 focus:ring-blue-200 text-blue-400 focus:outline-none"
                placeholder="Masukkan password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
            >
              LOGIN
            </button>
          </form>
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center justify-center bg-blue-100">
          <Image
            src="/image/login-ill.png"
            alt="login illustration"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginStanPage;
