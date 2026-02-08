"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { IMenu } from '@/app/types'
import { BASE_API_URL, BASE_IMAGE_MENU } from '@/global'
import { get } from '@/lib/api-birdge'
import { getCookie } from '@/lib/client-cookie'
import Image from 'next/image'

export default function DetailMenu() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [menu, setMenu] = useState<IMenu | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const getMenuDetail = async () => {
            setIsLoading(true)
            setError(null)
            
            try {
                const token = getCookie("token") || ""
                const url = `${BASE_API_URL}/detail_menu/${id}`
                
                const { data } = await get(url, token)

                if (data?.status && data.data) {
                    setMenu(data.data)
                } else {
                    setError("Menu tidak ditemukan")
                }
            } catch (err) {
                console.error("Failed to fetch menu detail:", err)
                setError("Gagal memuat detail menu")
            } finally {
                setIsLoading(false)
            }
        }

        if (id) {
            getMenuDetail()
        }
    }, [id])

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-blue-600">Loading menu detail...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error || !menu) {
        return (
            <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center p-6">
                <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Oops!</h2>
                    <p className="text-gray-600 mb-6">{error || "Menu tidak ditemukan"}</p>
                    <button
                        onClick={() => router.back()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        )
    }

    // Category badge
    const categoryBadge = () => {
        if (menu.jenis === "makanan") {
            return (
                <span className="bg-orange-100 text-orange-700 text-sm font-semibold px-3 py-1 rounded-full">
                    Makanan
                </span>
            )
        }
        return (
            <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
                Minuman
            </span>
        )
    }

    return (
        <div className="min-h-screen bg-[#f6f7fb] p-6">
            <div className="max-w-4xl mx-auto">
                {/* Back button */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                    >
                        <path 
                            fillRule="evenodd" 
                            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                            clipRule="evenodd" 
                        />
                    </svg>
                    Kembali
                </button>

                {/* Detail Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Image Section */}
                        <div className="relative aspect-square md:aspect-auto md:h-full">
                            <Image
                                src={`${BASE_IMAGE_MENU}/${menu.foto}`}
                                alt={menu.nama_makanan}
                                fill
                                className="object-cover"
                                unoptimized
                                priority
                            />
                        </div>

                        {/* Info Section */}
                        <div className="p-6 md:p-8 flex flex-col justify-between">
                            <div>
                                {/* Category Badge */}
                                <div className="mb-4">
                                    {categoryBadge()}
                                </div>

                                {/* Menu Name */}
                                <h1 className="text-3xl font-bold text-blue-700 mb-4">
                                    {menu.nama_makanan}
                                </h1>

                                {/* Price */}
                                <div className="mb-6">
                                    <p className="text-sm text-gray-500 mb-1">Harga</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        Rp {menu.harga.toLocaleString("id-ID")}
                                    </p>
                                </div>

                                {/* Description */}
                                <div className="mb-6">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">
                                        Deskripsi
                                    </p>
                                    <p className="text-gray-600 leading-relaxed">
                                        {menu.deskripsi || "Tidak ada deskripsi"}
                                    </p>
                                </div>

                                {/* Additional Info */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">ID Menu</p>
                                        <p className="font-semibold text-gray-700">#{menu.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Jenis</p>
                                        <p className="font-semibold text-gray-700 capitalize">
                                            {menu.jenis}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 space-y-3">
                                <button className="w-full bg-yellow-300 text-blue-700 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors">
                                    Tambah ke Keranjang
                                </button>
                                <button 
                                    onClick={() => router.back()}
                                    className="w-full bg-white border border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                                >
                                    Kembali ke Menu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}