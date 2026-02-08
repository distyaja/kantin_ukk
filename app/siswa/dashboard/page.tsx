"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { IMenu } from "@/app/types";
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global";
import { post } from "@/lib/api-birdge";
import Search from "./search";
import Navbar from "@/components/navbarsiswa";

// ==================== TYPES ====================
type CartItem = IMenu & { qty: number; uniqueKey: string };
type Category = "Makanan" | "Minuman";

const CATEGORIES: Category[] = ["Makanan", "Minuman"];

// ==================== MAIN COMPONENT ====================
export default function DashboardPage() {
  // ========== STATE ==========
  const [menu, setMenu] = useState<(IMenu & { uniqueKey: string })[]>([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>("Makanan");

  // ========== HELPERS ==========
  const getToken = useCallback(() => {
    return (
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1] || ""
    );
  }, []);

  const getApiEndpoint = useCallback((category: Category) => {
    return category === "Makanan"
      ? `${BASE_API_URL}/getmenumakanan`
      : `${BASE_API_URL}/getmenuminuman`;
  }, []);

  // ========== FETCH MENU ==========
  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      try {
        const token = getToken();
        const endpoint = getApiEndpoint(selectedCategory);
        const { data } = await post(`${endpoint}?search=${search}`, search, token);

        if (data?.status && Array.isArray(data.data)) {
          const validMenu = data.data
            .filter((item: IMenu) => item.id != null)
            .map((item: IMenu, index: number) => ({
              ...item,
              uniqueKey: `${item.id}-${index}-${item.nama_makanan}`,
            }));

          setMenu(validMenu);
        }
      } catch (error) {
        console.error("Failed to fetch menu:", error);
        setMenu([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchMenu, 300);
    return () => clearTimeout(timeoutId);
  }, [search, selectedCategory, getToken, getApiEndpoint]);

  // ========== CART HANDLERS ==========
  const addItem = useCallback((item: IMenu & { uniqueKey: string }) => {
    setCart((prev) => {
      const existIndex = prev.findIndex((i) => i.uniqueKey === item.uniqueKey);

      if (existIndex !== -1) {
        const newCart = [...prev];
        newCart[existIndex] = {
          ...newCart[existIndex],
          qty: newCart[existIndex].qty + 1,
        };
        return newCart;
      }

      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const removeItem = useCallback((uniqueKey: string) => {
    setCart((prev) =>
      prev
        .map((i) => (i.uniqueKey === uniqueKey ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  // ========== MEMOIZED VALUES ==========
  const total = useMemo(
    () => cart.reduce((sum, i) => sum + i.harga * i.qty, 0),
    [cart]
  );

  const cartMap = useMemo(
    () => new Map(cart.map((item) => [item.uniqueKey, item.qty])),
    [cart]
  );

  // ========== RENDER ==========
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f6f7fb] p-6">
        {/* ========== SEARCH ========== */}
        <div className="mb-6 max-w-2xl">
          <div className="border border-blue-500 rounded-lg text-blue-600">
            <Search search={search} onSearch={setSearch} url="/siswa/dashboard" />
          </div>
        </div>

        {/* ========== CONTENT ========== */}
        <div className="grid grid-cols-12 gap-6">
          {/* ========== MENU LIST ========== */}
          <main className="col-span-12 lg:col-span-9">
            <h2 className="font-bold text-lg mb-3 text-blue-700">
              Jelajahi Menu
            </h2>

            {/* Category Tabs */}
            <div className="flex gap-3 mb-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-lg border-2 font-medium transition-colors ${selectedCategory === cat
                      ? "bg-yellow-300 text-blue-700 border-yellow-400"
                      : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <h3 className="font-semibold text-blue-700 mb-4">
              {selectedCategory} Tersedia
            </h3>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-8 text-blue-600">
                Loading {selectedCategory.toLowerCase()}...
              </div>
            )}

            {/* Empty State */}
            {!isLoading && menu.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Tidak ada menu {selectedCategory.toLowerCase()}
              </div>
            )}

            {/* Menu Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menu.map((item) => {
                const qty = cartMap.get(item.uniqueKey) || 0;

                return (
                  <MenuCard
                    key={item.uniqueKey}
                    item={item}
                    qty={qty}
                    onAdd={() => addItem(item)}
                    onRemove={() => removeItem(item.uniqueKey)}
                  />
                );
              })}
            </div>
          </main>

          {/* ========== ORDER PANEL ========== */}
          <aside className="col-span-12 lg:col-span-3 bg-white rounded-xl p-4 h-fit lg:sticky lg:top-6">
            <h3 className="font-bold text-blue-700 mb-3">Order Menu</h3>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8 text-sm">
                Keranjang kosong
              </p>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {cart.map((item) => (
                    <CartItem key={item.uniqueKey} item={item} />
                  ))}
                </div>

                {/* Total & Order Button */}
                <div className="border-t mt-4 pt-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-blue-700">Total</span>
                    <span className="font-bold text-blue-700 text-lg">
                      Rp {total.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <button className="w-full bg-yellow-300 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors">
                    Order Now
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}

// ==================== MENU CARD COMPONENT ====================
interface MenuCardProps {
  item: IMenu & { uniqueKey: string };
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
}

function MenuCard({ item, qty, onAdd, onRemove }: MenuCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 border hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative w-full aspect-square mb-2">
        <Image
          src={`${BASE_IMAGE_MENU}/${item.foto}`}
          alt={item.nama_makanan}
          fill
          className="object-cover rounded-lg"
          unoptimized
        />
      </div>

      {/* Title */}
      <h3 className="font-semibold mt-2 text-blue-700 line-clamp-2">
        {item.nama_makanan}
      </h3>

      {/* Price */}
      <p className="text-sm text-blue-600 font-medium mt-1">
        Rp {item.harga.toLocaleString("id-ID")}
      </p>

      {/* Quantity Controls */}
      <div className="flex items-center justify-between mt-3">
        <button
          onClick={onRemove}
          disabled={qty === 0}
          className="bg-yellow-200 px-3 py-1 rounded hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Kurangi jumlah"
        >
          −
        </button>

        <span className="font-bold text-blue-700 min-w-[2rem] text-center">
          {qty}
        </span>

        <button
          onClick={onAdd}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
          aria-label="Tambah jumlah"
        >
          +
        </button>
      </div>
    </div>
  );
}

// ==================== CART ITEM COMPONENT ====================
interface CartItemProps {
  item: CartItem;
}

function CartItem({ item }: CartItemProps) {
  return (
    <div className="flex items-center gap-3 border p-2 rounded-lg">
      {/* Image */}
      <div className="relative w-10 h-10 flex-shrink-0">
        <Image
          src={`${BASE_IMAGE_MENU}/${item.foto}`}
          alt={item.nama_makanan}
          fill
          className="object-cover rounded"
          unoptimized
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{item.nama_makanan}</p>
        <p className="text-xs text-blue-600">
          {item.qty} × Rp {item.harga.toLocaleString("id-ID")}
        </p>
      </div>

      {/* Subtotal */}
      <p className="font-semibold text-sm text-blue-700">
        Rp {(item.qty * item.harga).toLocaleString("id-ID")}
      </p>
    </div>
  );
}