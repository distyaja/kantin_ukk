"use client";

import { BASE_API_URL } from "../../global";
import { storeCookie } from "../../lib/client-cookie";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try { 
      const url = `${BASE_API_URL}/login_siswa`;

      const payload = {
        username,
        password,
      };

      const { data } = await axios.post(url, payload, {
        headers: {"Content-Type":"application/json", "makerID": 1},
      });

      if (data.access_token) {
        toast(data.message, {
          containerId: "toastLogin",
          type: "success",
        });

        storeCookie("token", data.access_token);
        storeCookie("id", data.user.id);
        storeCookie("username", data.user.username);
        storeCookie("role", data.user.role);

        if (data.user.role === "siswa") {
          router.replace("/siswa/dashboard");
        } else {
          router.replace("/stan/dashboard");
        }
      } else {
        toast(data.message, {
          containerId: "toastLogin",
          type: "warning",
        });
      }
    } catch (error) {
      toast("Login gagal", {
        containerId: "toastLogin",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex items-center justify-center p-6">
      <ToastContainer containerId="toastLogin" />
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* LEFT */}
        <div className="p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">
            Loh Balik Lagi? Gas
          </h1>
          <p className="text-gray-500 mb-8">
            Kasih detail kamu biar bisa login
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
              />
            </div>

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

export default LoginPage;
