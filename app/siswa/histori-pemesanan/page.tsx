"use client";

import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global";
import { post } from "@/lib/api-birdge";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/navbarsiswa";

interface HistoriOrder {
  id: number;
  id_siswa: number;
  id_menu: number;
  jumlah: number;
  harga: number;
  status: string;
  tanggal: string;
  foto?: string;
  nama_makanan?: string;
}

export default function HistoriPemesananPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [orders, setOrders] = useState<HistoriOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with current month and year
  useEffect(() => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear().toString();
    setSelectedMonth(month);
    setSelectedYear(year);
  }, []);

  const getToken = useCallback(() => {
    return (
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1] || ""
    );
  }, []);

  useEffect(() => {
    if (!selectedMonth || !selectedYear) return;

    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const token = getToken();
        const dateParam = `${selectedYear}-${selectedMonth}`;
        const { data } = await post(
          `${BASE_API_URL}/showorderbymonthbysiswa/${dateParam}`,
          token,
          token
        );

        if (data?.status && Array.isArray(data.data)) {
          setOrders(data.data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [selectedMonth, selectedYear, getToken]);

  // Generate month and year options
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, "0"),
    label: new Date(2024, i).toLocaleString("id-ID", { month: "long" }),
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString(),
  }));

  const monthLabel =
    months.find((m) => m.value === selectedMonth)?.label || "";
  const formattedDate = `${monthLabel} ${selectedYear}`;

  // Calculate total from orders
  const total = orders.reduce((sum, order) => sum + order.harga * order.jumlah, 0);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f6f7fb] p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-700 mb-6">Histori Pemesanan</h1>

          {/* DATE SELECTOR */}
          <div className="bg-white rounded-xl p-6 mb-6 border-2 border-blue-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Bulan
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg text-blue-700 font-semibold focus:outline-none focus:border-blue-600"
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Tahun
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg text-blue-700 font-semibold focus:outline-none focus:border-blue-600"
                >
                  {years.map((year) => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="px-4 py-2 bg-yellow-300 rounded-lg text-blue-700 font-semibold text-center">
                  {formattedDate}
                </div>
              </div>
            </div>
          </div>

          {/* LOADING STATE */}
          {isLoading && (
            <div className="text-center py-12 text-blue-600">
              Loading pesanan...
            </div>
          )}

          {/* EMPTY STATE */}
          {!isLoading && orders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Tidak ada pesanan pada bulan {formattedDate}
            </div>
          )}

          {/* ORDERS LIST */}
          {!isLoading && orders.length > 0 && (
            <>
              <div className="space-y-4 mb-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl p-6 border-2 border-blue-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex gap-4">
                      {order.foto && (
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <Image
                            src={`${BASE_IMAGE_MENU}/${order.foto}`}
                            alt={order.nama_makanan || "Menu"}
                            fill
                            className="object-cover rounded-lg"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-blue-700 mb-2">
                          {order.nama_makanan || `Menu #${order.id_menu}`}
                        </h3>
                        <p className="text-blue-600 mb-1">
                          Jumlah: <span className="font-semibold">{order.jumlah} porsi</span>
                        </p>
                        <p className="text-blue-600 mb-1">
                          Harga Satuan: <span className="font-semibold">Rp {order.harga.toLocaleString("id-ID")}</span>
                        </p>
                        <p className="text-blue-600 mb-1">
                          Total: <span className="font-semibold">Rp {(order.harga * order.jumlah).toLocaleString("id-ID")}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Tanggal: {new Date(order.tanggal).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold text-sm">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* TOTAL SUMMARY */}
              <div className="bg-yellow-300 rounded-xl p-6 border-2 border-yellow-400">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-700">
                    Total Pengeluaran {formattedDate}:
                  </span>
                  <span className="text-2xl font-bold text-blue-700">
                    Rp {total.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
