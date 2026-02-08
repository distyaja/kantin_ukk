"use client"

import { BASE_API_URL } from "@/global"
import { post } from "@/lib/api-birdge"
import { getCookie } from "@/lib/client-cookie"
import { useRouter } from "next/navigation"
import { FormEvent, useRef, useState } from "react"
import { toast } from "react-toastify"
import Modal from "@/components/modal"
import Select from "@/components/select"
import FileInput from "@/components/fileInput"
import { InputGroupComponent } from "@/components/inputComponents"
import { ButtonSuccess, ButtonDanger } from "@/components/button"

type MenuForm = {
    nama_makanan: string
    jenis: string
    harga: number
    deskripsi: string
}

const AddMenu = () => {
    const [isShow, setIsShow] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const router = useRouter()

    const TOKEN = getCookie("token") || ""

    const [menu, setMenu] = useState<MenuForm>({
        nama_makanan: "",
        jenis: "",
        harga: 0,
        deskripsi: "",
    })

    const openModal = () => {
        setMenu({
            nama_makanan: "",
            jenis: "",
            harga: 0,
            deskripsi: "",
        })
        setFile(null)
        setIsShow(true)
        if (formRef.current) formRef.current.reset()
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        try {
            const url = `${BASE_API_URL}/tambahnmenu`

            const payload = new FormData()
            payload.append("nama_makanan", menu.nama_makanan)
            payload.append("jenis", menu.jenis)
            payload.append("harga", menu.harga.toString())
            payload.append("deskripsi", menu.deskripsi)
            if (file) payload.append("foto", file)

            const { data } = await post(url, payload, TOKEN)

            if (data?.status) {
                toast(data.message, {
                    containerId: "toastMenu",
                    type: "success",
                })
                setIsShow(false)
                setTimeout(() => router.refresh(), 800)
            } else {
                toast(data.message || "Gagal menambah menu", {
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
            <ButtonSuccess type="button" onClick={openModal}>
                + Tambah Menu
            </ButtonSuccess>

            <Modal isShow={isShow} onClose={setIsShow}>
                <form ref={formRef} onSubmit={handleSubmit}>
                    {/* HEADER */}
                    <div className="sticky top-0 bg-white px-5 pt-5 pb-3 shadow">
                        <div className="flex items-center">
                            <div>
                                <h2 className="text-2xl font-bold">Tambah Menu</h2>
                                <p className="text-sm text-slate-400">
                                    Tambahkan menu makanan / minuman stan
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
                    <div className="p-5 space-y-4">
                        <InputGroupComponent
                            id="nama_makanan"
                            label="Nama Makanan"
                            type="text"
                            required
                            value={menu.nama_makanan}
                            onChange={val => setMenu({ ...menu, nama_makanan: val })}
                        />


                        <Select
                            id="jenis"
                            label="Jenis"
                            required
                            value={menu.jenis}
                            onChange={val => setMenu({ ...menu, jenis: val })}
                        >
                            <option value="">-- Pilih Jenis --</option>
                            <option value="makanan">Makanan</option>
                            <option value="minuman">Minuman</option>
                        </Select>

                        <InputGroupComponent
                            id="harga"
                            label="Harga"
                            type="number"
                            required
                            value={menu.harga.toString()}
                            onChange={val => setMenu({ ...menu, harga: Number(val) })}
                        />

                        <InputGroupComponent
                            id="deskripsi"
                            label="Deskripsi"
                            type="text"
                            required
                            value={menu.deskripsi}
                            onChange={val => setMenu({ ...menu, deskripsi: val })}
                        />

                        <FileInput
                            id="foto"
                            label="Foto Menu"
                            acceptTypes={["image/png", "image/jpeg", "image/jpg"]}
                            onChange={f => setFile(f)}
                            required={true}
                        />
                    </div>

                    {/* FOOTER */}
                    <div className="p-5 flex justify-end gap-2 border-t">
                        <ButtonDanger type="button" onClick={() => setIsShow(false)}>
                            Batal
                        </ButtonDanger>
                        <ButtonSuccess type="submit">
                            Simpan
                        </ButtonSuccess>
                        
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default AddMenu
