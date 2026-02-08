"use client";

import React, { useState, useEffect, useCallback } from "react";
import { post, get } from "@/lib/api-birdge"; // sesuaikan dengan axios config kam
import { BASE_API_URL } from "@/global";

interface Diskon {
  id: number;
  nama_diskon: string;
  persentase_diskon: number;
  tanggal_awal: string;
  tanggal_akhir: string;
}

interface FormData {
  nama_diskon: string;
  persentase_diskon: string;
  tanggal_awal: string;
  tanggal_akhir: string;
}

export default function DiskonPage() {
  const getToken = useCallback(() => {
    return (
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1] || ""
    );
  }, []);
  const [diskons, setDiskons] = useState<Diskon[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nama_diskon: "",
    persentase_diskon: "",
    tanggal_awal: "",
    tanggal_akhir: "",
  });

  // Fetch diskon list
  // Fetch diskon list
  const fetchDiskons = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("search", search);
      const token = getToken();

      const { data } = await post(
        `${BASE_API_URL}/showdiskon`,
        formData,
        token,
      );

      // Debug dulu, cek struktur response-nya
      console.log("Response data:", data);

      // Sesuaikan dengan struktur response API kamu
      // Kemungkinan data.data, data.diskons, atau data langsung array
      if (Array.isArray(data)) {
        setDiskons(data);
      } else if (Array.isArray(data?.data)) {
        setDiskons(data.data);
      } else if (Array.isArray(data?.diskons)) {
        setDiskons(data.diskons);
      } else {
        setDiskons([]);
      }
    } catch (error) {
      console.error("Error fetching diskons:", error);
      setDiskons([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };
  // Fetch detail diskon for edit
  const fetchDetailDiskon = async (id: number) => {
    try {
      const token = getToken();
      const { data } = await get(`${BASE_API_URL}/detaildiskon/${id}`, token);
      setFormData({
        nama_diskon: data.nama_diskon,
        persentase_diskon: data.persentase_diskon.toString(),
        tanggal_awal: data.tanggal_awal,
        tanggal_akhir: data.tanggal_akhir,
      });
    } catch (error) {
      console.error("Error fetching detail:", error);
    }
  };

  // Handle create diskon
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nama_diskon", formData.nama_diskon);
      formDataToSend.append("persentase_diskon", formData.persentase_diskon);
      formDataToSend.append("tanggal_awal", formData.tanggal_awal);
      formDataToSend.append("tanggal_akhir", formData.tanggal_akhir);
      const token = getToken();

      await post(`${BASE_API_URL}/tambahdiskon`, formDataToSend, token);

      alert("Diskon berhasil ditambahkan!");
      setShowModal(false);
      resetForm();
      fetchDiskons();
    } catch (error) {
      console.error("Error creating diskon:", error);
      alert("Gagal menambahkan diskon!");
    } finally {
      setLoading(false);
    }
  };

  // Handle update diskon
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nama_diskon", formData.nama_diskon);
      formDataToSend.append("persentase_diskon", formData.persentase_diskon);
      formDataToSend.append("tanggal_awal", formData.tanggal_awal);
      formDataToSend.append("tanggal_akhir", formData.tanggal_akhir);
      const token = getToken();

      await post(
        `${BASE_API_URL}/updatediskon/${selectedId}`,
        formDataToSend,
        token,
      );

      alert("Diskon berhasil diupdate!");
      setShowModal(false);
      resetForm();
      fetchDiskons();
    } catch (error) {
      console.error("Error updating diskon:", error);
      alert("Gagal mengupdate diskon!");
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      nama_diskon: "",
      persentase_diskon: "",
      tanggal_awal: "",
      tanggal_akhir: "",
    });
    setEditMode(false);
    setSelectedId(null);
  };

  // Open modal for create
  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Open modal for edit
  const openEditModal = async (id: number) => {
    setSelectedId(id);
    setEditMode(true);
    await fetchDetailDiskon(id);
    setShowModal(true);
  };

  // Initial fetch
  useEffect(() => {
    fetchDiskons();
  }, []);

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDiskons();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Kelola Diskon</h1>

        {/* Search & Add Button */}
        <div className="flex gap-4 mb-4">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <input
              type="text"
              placeholder="Cari diskon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Cari
            </button>
          </form>
          <button
            onClick={openCreateModal}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            + Tambah Diskon
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Diskon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Persentase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Awal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Akhir
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : diskons.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada data diskon
                  </td>
                </tr>
              ) : (
                diskons.map((diskon, index) => (
                  <tr key={diskon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {diskon.nama_diskon}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {diskon.persentase_diskon}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {diskon.tanggal_awal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {diskon.tanggal_akhir}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditModal(diskon.id)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Yakin ingin menghapus diskon ini?")) {
                            // Implement delete if you have the endpoint
                            console.log("Delete", diskon.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editMode ? "Edit Diskon" : "Tambah Diskon"}
            </h2>
            <form onSubmit={editMode ? handleUpdate : handleCreate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Diskon
                </label>
                <input
                  type="text"
                  value={formData.nama_diskon}
                  onChange={(e) =>
                    setFormData({ ...formData, nama_diskon: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Persentase Diskon (%)
                </label>
                <input
                  type="number"
                  value={formData.persentase_diskon}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      persentase_diskon: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  max="100"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Awal
                </label>
                <input
                  type="date"
                  value={formData.tanggal_awal}
                  onChange={(e) =>
                    setFormData({ ...formData, tanggal_awal: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Akhir
                </label>
                <input
                  type="date"
                  value={formData.tanggal_akhir}
                  onChange={(e) =>
                    setFormData({ ...formData, tanggal_akhir: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                >
                  {loading ? "Loading..." : editMode ? "Update" : "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
