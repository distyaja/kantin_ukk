"use client"

import { BASE_API_URL } from "@/global"
import { drop } from "@/lib/api-birdge"
import { getCookie } from "@/lib/client-cookie"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "react-toastify"
import Modal from "@/components/modal"
import { ButtonDanger, ButtonWarning } from "@/components/button"

type Menu = {
    id: number
    nama_makanan: string
}

const DeleteMenu = ({ selectedMenu }: { selectedMenu: Menu }) => {
    const [isShow, setIsShow] = useState(false)
    const [menu, setMenu] = useState<Menu>({ ...selectedMenu })
    const router = useRouter()
    const TOKEN = getCookie("token") || ""

    const openModal = () => {
        setMenu({ ...selectedMenu })
        setIsShow(true)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        try {
            const url = `${BASE_API_URL}/hapusmenu/${menu.id}`
            const { data } = await drop(url, TOKEN)

            if (data?.status) {
                toast(data.message, {
                    containerId: "toastMenu",
                    type: "success",
                })
                setIsShow(false)
                setTimeout(() => router.refresh(), 800)
            } else {
                toast(data.message || "Gagal menghapus menu", {
                    containerId: "toastMenu",
                    type: "warning",
                })
            }
        } catch (error) {
            console.error(error)
            toast("Terjadi kesalahan", {
                containerId: "toastMenu",
                type: "error",
            })
        }
    }

    return (
        <div>
            <ButtonDanger type="button" onClick={openModal}>
                Hapus
            </ButtonDanger>

            <Modal isShow={isShow} onClose={setIsShow}>
                <form onSubmit={handleSubmit}>
                    {/* HEADER */}
                    <div className="sticky top-0 bg-white px-5 pt-5 pb-3 shadow">
                        <div className="flex items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-red-600">
                                    Hapus Menu
                                </h2>
                                <p className="text-sm text-slate-400">
                                    Menu yang sudah terhapus tidak dapat dikembalikan
                                </p>
                            </div>
                            <button
                                type="button"
                                className="ml-auto text-slate-400"
                                onClick={() => setIsShow(false)}
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* BODY */}
                    <div className="p-5">
                        <p className="text-sm">
                            Apakah kamu yakin ingin menghapus menu{" "}
                            <strong className="text-red-600">
                                {menu.nama_makanan}
                            </strong>
                            ?
                        </p>
                    </div>

                    {/* FOOTER */}
                    <div className="p-5 flex justify-end gap-2 border-t">
                        <ButtonWarning type="button" onClick={() => setIsShow(false)}>
                            Batal
                        </ButtonWarning>
                        <ButtonDanger type="submit">
                            Ya, Hapus
                        </ButtonDanger>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default DeleteMenu
