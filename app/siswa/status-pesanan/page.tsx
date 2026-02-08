"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global";
import { post } from "@/lib/api-birdge";
import Navbar from "@/components/navbarsiswa";

// ==================== TYPES ====================
type OrderStatus = "belumdikonfirm" | "dimasak" | "diantar" | "sampai";

interface OrderItem {
  id: number;
  id_siswa: number;
  id_menu: number;
  jumlah: number;
  harga: number;
  status: OrderStatus;
  tanggal: string;
  foto?: string;
  nama_makanan?: string;
}

interface StatusConfig {
  value: OrderStatus;
  label: string;
  bgColor: string;
  badgeColor: string;
}

// ==================== CONSTANTS ====================
const STATUS_CONFIG: StatusConfig[] = [
  {
    value: "belumdikonfirm",
    label: "Belum Dikonfirmasi",
    bgColor: "bg-gray-100",
    badgeColor: "bg-gray-600",
  },
  {
    value: "dimasak",
    label: "Sedang Dimasak",
    bgColor: "bg-blue-100",
    badgeColor: "bg-blue-600",
  },
  {
    value: "diantar",
    label: "Sedang Diantar",
    bgColor: "bg-yellow-100",
    badgeColor: "bg-yellow-600",
  },
  {
    value: "sampai",
    label: "Sampai Tujuan",
    bgColor: "bg-green-100",
    badgeColor: "bg-green-600",
  },
];

// ==================== MAIN COMPONENT ====================
export default function StatusPesananPage() {
  // ========== STATE ==========
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("belumdikonfirm");
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ========== HELPERS ==========
  const getToken = useCallback(() => {
    return (
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1] || ""
    );
  }, []);

  const currentStatusInfo = STATUS_CONFIG.find((s) => s.value === selectedStatus);

  // ========== FETCH ORDERS ==========
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const token = getToken();
        const { data } = await post(
          `${BASE_API_URL}/showorder/${selectedStatus}`,
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
  }, [selectedStatus, getToken]);

  // ========== RENDER ==========
  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-[#f6f7fb] p-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <h1 className="text-3xl font-bold text-blue-700 mb-6">
            Status Pesanan
          </h1>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            {STATUS_CONFIG.map((status) => (
              <StatusTab
                key={status.value}
                status={status}
                isActive={selectedStatus === status.value}
                onClick={() => setSelectedStatus(status.value)}
              />
            ))}
          </div>

          {/* Loading State */}
          {isLoading && (
            <LoadingState />
          )}

          {/* Empty State */}
          {!isLoading && orders.length === 0 && (
            <EmptyState statusLabel={currentStatusInfo?.label} />
          )}

          {/* Orders List */}
          {!isLoading && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  statusInfo={currentStatusInfo}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ==================== STATUS TAB COMPONENT ====================
interface StatusTabProps {
  status: StatusConfig;
  isActive: boolean;
  onClick: () => void;
}

function StatusTab({ status, isActive, onClick }: StatusTabProps) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-lg font-semibold transition-all border-2 ${
        isActive
          ? "bg-yellow-300 text-blue-700 border-yellow-400"
          : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
      }`}
    >
      {status.label}
    </button>
  );
}

// ==================== ORDER CARD COMPONENT ====================
interface OrderCardProps {
  order: OrderItem;
  statusInfo?: StatusConfig;
}

function OrderCard({ order, statusInfo }: OrderCardProps) {
  const total = order.harga * order.jumlah;

  return (
    <div
      className={`${statusInfo?.bgColor} rounded-xl p-6 border-2 border-blue-200`}
    >
      <div className="flex gap-4">
        {/* Menu Image */}
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

        {/* Order Details */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-blue-700 mb-2">
            {order.nama_makanan || `Menu #${order.id_menu}`}
          </h3>

          <OrderDetail label="Jumlah" value={`${order.jumlah} porsi`} />
          <OrderDetail label="Harga" value={`Rp ${order.harga.toLocaleString("id-ID")}`} />
          <OrderDetail label="Total" value={`Rp ${total.toLocaleString("id-ID")}`} />

          <p className="text-sm text-gray-600 mt-2">
            Tanggal: {new Date(order.tanggal).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center">
          <span
            className={`px-4 py-2 rounded-lg font-semibold text-white ${statusInfo?.badgeColor}`}
          >
            {statusInfo?.label}
          </span>
        </div>
      </div>
    </div>
  );
}

// ==================== ORDER DETAIL COMPONENT ====================
interface OrderDetailProps {
  label: string;
  value: string;
}

function OrderDetail({ label, value }: OrderDetailProps) {
  return (
    <p className="text-blue-600 mb-1">
      {label}: <span className="font-semibold">{value}</span>
    </p>
  );
}

// ==================== LOADING STATE COMPONENT ====================
function LoadingState() {
  return (
    <div className="text-center py-12 text-blue-600">
      Loading pesanan...
    </div>
  );
}

// ==================== EMPTY STATE COMPONENT ====================
interface EmptyStateProps {
  statusLabel?: string;
}

function EmptyState({ statusLabel }: EmptyStateProps) {
  return (
    <div className="text-center py-12 text-gray-500">
      Tidak ada pesanan dengan status {statusLabel?.toLowerCase()}
    </div>
  );
}