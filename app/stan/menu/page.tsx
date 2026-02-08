"use client"

import { IMenu } from "@/app/types"
import { useState, useEffect } from "react"
import { getCookie } from "@/lib/client-cookie"
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global"
import { get } from "@/lib/api-birdge"
import { AlertInfo } from "@/components/alert"
import Search from "./search"
import Image from "next/image"
import AddMenu from "./addMenu"
import UpdateMenu from "./updateMenu"
import DeleteMenu from "./deleteMenu"

/* ================= PAGE ================= */
const MenuPage = () => {
    const [search, setSearch] = useState("")
    const [menu, setMenu] = useState<IMenu[]>([])
    const [isLoading, setIsLoading] = useState(true)

    /* ================= GET MENU ================= */
    useEffect(() => {
        const getMenu = async () => {
            setIsLoading(true)
            try {
                const TOKEN = getCookie("token") || ""
                const url = `${BASE_API_URL}/showmenu?search=${search}`
                const { data } = await get(url, TOKEN)

                if (data?.status) {
                    const filteredMenu = data.data.filter(
                        (item: IMenu) =>
                            item.jenis === "makanan" || item.jenis === "minuman"
                    )
                    setMenu(filteredMenu)
                } else {
                    setMenu([])
                }
            } catch (error) {
                console.log(error)
                setMenu([])
            } finally {
                setIsLoading(false)
            }
        }

        // Debounce search
        const timeoutId = setTimeout(() => {
            getMenu()
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [search])

    /* ================= CATEGORY BADGE ================= */
    const categoryBadge = (cat: string) => {
        if (cat === "makanan") {
            return (
                <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded-full">
                    Makanan
                </span>
            )
        }

        return (
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                Minuman
            </span>
        )
    }

    return (
        <div className="m-5 bg-white rounded-lg p-5 border-t-4 border-blue-500 shadow-md text-blue-900">

            {/* ===== HEADER ===== */}
            <h4 className="text-xl font-bold mb-1">Data Menu</h4>
            <p className="text-sm text-gray-500 mb-4">
                Kelola menu makanan dan minuman (tambah, edit, hapus)
            </p>

            {/* ===== SEARCH & ADD ===== */}
            <div className="flex justify-between items-center mb-4">
                <div className="w-full max-w-md">
                    <Search
                        url="/detail_menu"
                        search={search}
                        onSearch={setSearch}
                    />
                </div>
                <AddMenu />
            </div>

            {/* ===== LOADING STATE ===== */}
            {isLoading && (
                <div className="text-center py-8 text-blue-600">
                    Loading menu...
                </div>
            )}

            {/* ===== CONTENT ===== */}
            {!isLoading && menu.length === 0 ? (
                <AlertInfo title="Informasi">Menu belum tersedia</AlertInfo>
            ) : (
                !isLoading && (
                    <div className="space-y-3">
                        {menu.map((data, index) => (
                            <div
                                key={data.id ?? `menu-${index}`}
                                className="flex flex-wrap items-center bg-white rounded-lg p-3 shadow border"
                            >
                                {/* FOTO */}
                                <div className="w-full md:w-1/12 p-2">
                                    <small className="font-semibold text-gray-500">Foto</small>
                                    <Image
                                        src={`${BASE_IMAGE_MENU}/${data.foto}`}
                                        width={50}
                                        height={50}
                                        className="rounded-md mt-1"
                                        alt={data.nama_makanan}
                                        unoptimized
                                    />
                                </div>

                                {/* NAMA */}
                                <div className="w-full md:w-2/12 p-2">
                                    <small className="font-semibold text-gray-500">Nama</small>
                                    <p>{data.nama_makanan}</p>
                                </div>

                                {/* HARGA */}
                                <div className="w-full md:w-1/12 p-2">
                                    <small className="font-semibold text-gray-500">Harga</small>
                                    <p>Rp {data.harga.toLocaleString("id-ID")}</p>
                                </div>

                                {/* DESKRIPSI */}
                                <div className="w-full md:w-4/12 p-2">
                                    <small className="font-semibold text-gray-500">
                                        Deskripsi
                                    </small>
                                    <p className="text-sm">{data.deskripsi}</p>
                                </div>

                                {/* JENIS */}
                                <div className="w-full md:w-1/12 p-2">
                                    <small className="font-semibold text-gray-500">Jenis</small>
                                    <div className="mt-1">{categoryBadge(data.jenis)}</div>
                                </div>

                                {/* ACTION */}
                                <div className="w-full md:w-2/12 p-2">
                                    <small className="font-semibold text-gray-500">Aksi</small>
                                    <div className="flex gap-2 mt-1">
                                        <UpdateMenu selectedMenu={data} />
                                        <DeleteMenu selectedMenu={data} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    )
}

export default MenuPage