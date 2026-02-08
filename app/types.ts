export interface IMenu {
    id: number
    nama_makanan: string
    harga: number
    jenis: "makanan" | "minuman"
    foto: string
    deskripsi: string
    createdAt: string
    id_stan: number
    maker_id: number
    updatedAt: string
}

export interface SearchProps {
    url: string;
    search: string;
    onSearch?: (value: string) => void;
}


export interface IUser {
    id: number;
    uuid: string;
    name: string,
    email: string,
    password: string,
    role: string,
    profile_picture: string,
    createdAt: string,
    updatedAt: string
 }
  