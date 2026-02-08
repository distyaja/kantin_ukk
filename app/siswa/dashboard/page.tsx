"use client";

import { IMenu } from "@/app/types";
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global";
import { get } from "@/lib/api-birdge";
import Search from "./search";
import Image from "next/image";
import { useEffect, useState } from "react";

type CartItem = IMenu & { qty: number };

const categories = ["Makanan", "Minuman"];

export default function DashboardPage() {
  const [menu, setMenu] = useState<IMenu[]>([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchMenu = async () => {
      const token =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1] || "";

      const { data } = await get(
        `${BASE_API_URL}/getmenufood?search=${search}`,
        token
      );

      if (data?.status) setMenu(data.data);
    };

    fetchMenu();
  }, [search]);

  /* ================= CART ================= */
  const addItem = (item: IMenu) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.id === item.id);
      if (exist)
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeItem = (id: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const total = cart.reduce((sum, i) => sum + i.harga * i.qty, 0);

  return (
    <div className="min-h-screen bg-[#f6f7fb] border-2 border-blue p-6">
      {/* ===== SEARCH & FILTER ===== */}
      <div className="flex gap-2 mb-6 w-1/2">
        <div className="border border-blue-500 rounded-lg flex-1 text-blue-600">
          <Search
            search={search}
            onSearch={setSearch}
            url="/siswa/dashboard"
          />
        </div>
        <button className="bg-blue-600 text-white px-4 rounded-lg">
          Filter
        </button>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="grid grid-cols-12 gap-6">
        {/* ===== MENU LIST ===== */}
        <main className="col-span-9">
          <h2 className="font-bold text-lg mb-3 text-blue-700">
            Jelajahi Menu
          </h2>

          {/* CATEGORY */}
          <div className="flex gap-3 mb-4">
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-lg border font-medium ${i === 0
                    ? "bg-yellow-300 text-blue-700"
                    : "bg-white text-blue-600"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <h3 className="font-semibold text-blue-700 mb-3">
            Menu Tersedia
          </h3>

          {/* MENU GRID */}
          <div className="grid grid-cols-3 gap-4">
            {menu.map((item) => {
              const qty =
                cart.find((c) => c.id === item.id)?.qty || 0;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 border"
                >
                  <Image
                    src={`${BASE_IMAGE_MENU}/${item.foto}`}
                    alt={item.nama_makanan}
                    width={120}
                    height={120}
                    className="mx-auto"
                    unoptimized
                  />

                  <h3 className="font-semibold mt-2 text-blue-700">
                    {item.nama_makanan}
                  </h3>

                  <p className="text-sm text-blue-600">
                    Rp {item.harga.toLocaleString()}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="bg-yellow-200 px-3 py-1 rounded"
                    >
                      −
                    </button>

                    <span className="font-bold text-blue-700">
                      {qty}
                    </span>

                    <button
                      onClick={() => addItem(item)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* ===== ORDER PANEL ===== */}
        <aside className="col-span-3 bg-white rounded-xl p-4">
          <h3 className="font-bold text-blue-700 mb-3">Order Menu</h3>

          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 border p-2 rounded-lg"
              >
                <Image
                  src={`${BASE_IMAGE_MENU}/${item.foto}`}
                  alt={item.nama_makanan}
                  width={40}
                  height={40}
                  unoptimized
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm">
                    {item.nama_makanan}
                  </p>
                  <p className="text-xs text-blue-600">
                    {item.qty} × Rp {item.harga.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-3">
            <p className="font-bold text-blue-700">
              Total = Rp {total.toLocaleString()}
            </p>

            <button className="mt-3 w-full bg-yellow-300 py-2 rounded-lg font-bold">
              Order
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
