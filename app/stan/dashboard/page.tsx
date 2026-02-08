"use client";

import { IMenu } from "@/app/types";
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global";
import { post } from "@/lib/api-birdge";
import Search from "./search";
import Image from "next/image";
import { useEffect, useState, useCallback, useMemo } from "react";

type CartItem = IMenu & { qty: number; uniqueKey: string };

const categories = ["Makanan", "Minuman"] as const;
type Category = typeof categories[number];

export default function DashboardPage() {
    const [menu, setMenu] = useState<(IMenu & { uniqueKey: string })[]>([]);
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category>("Makanan");

    // Get token once and memoize it
    const getToken = useCallback(() => {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1] || "";
    }, []);

    // Get API endpoint based on category
    const getApiEndpoint = useCallback((category: Category) => {
        if (category === "Makanan") {
            return `${BASE_API_URL}/getmenumakanan`;
        }
        return `${BASE_API_URL}/getmenuminuman`;
    }, []);

    // Fetch menu with debounce and loading state
    useEffect(() => {
        const fetchMenu = async () => {
            setIsLoading(true);
            try {
                const token = getToken();
                const endpoint = getApiEndpoint(selectedCategory);
            
                const { data } = await post(
                    `${endpoint}?search=${search}`,
                    search,
                    token
                );

                if (data?.status && Array.isArray(data.data)) {
                    // Filter valid items dan tambahkan unique key untuk handle duplicate IDs
                    const validMenu = data.data
                        .filter((item: IMenu) => item.id != null)
                        .map((item: IMenu, index: number) => ({
                            ...item,
                            // Generate unique key combining ID and index to handle duplicates
                            uniqueKey: `${item.id}-${index}-${item.nama_makanan}`
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

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchMenu();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, selectedCategory, getToken, getApiEndpoint]);

    // Handle category change
    const handleCategoryChange = (category: Category) => {
        setSelectedCategory(category);
        // Optionally reset search when changing category
        // setSearch("");
    };

    return (
        <div className="min-h-screen bg-[#f6f7fb] p-6">
            {/* ===== SEARCH & FILTER ===== */}
            <div className="flex gap-2 mb-6 max-w-2xl">
                <div className="border border-blue-500 rounded-lg flex-1 text-blue-600">
                    <Search
                        search={search}
                        onSearch={setSearch}
                        url="/siswa/dashboard"
                    />
                </div>
                <button className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Filter
                </button>
            </div>

            {/* ===== CONTENT ===== */}
            <div className="">
                {/* ===== MENU LIST ===== */}
                <main className="col-span-12 lg:col-span-9">
                    <h2 className="font-bold text-lg mb-3 text-blue-700">
                        Jelajahi Menu
                    </h2>

                    {/* CATEGORY */}
                    <div className="flex gap-3 mb-4">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                                    selectedCategory === cat
                                        ? "bg-yellow-300 text-blue-700"
                                        : "bg-white text-blue-600 hover:bg-gray-50"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <h3 className="font-semibold text-blue-700 mb-3">
                        Menu Tersedia - {selectedCategory}
                    </h3>

                    {/* LOADING STATE */}
                    {isLoading && (
                        <div className="text-center py-8 text-blue-600">
                            Loading {selectedCategory.toLowerCase()}...
                        </div>
                    )}

                    {/* EMPTY STATE */}
                    {!isLoading && menu.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No {selectedCategory.toLowerCase()} items found
                        </div>
                    )}

                    {/* MENU GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {menu.map((item) => {

                            return (
                                <div
                                    key={item.uniqueKey}
                                    className="bg-white rounded-xl p-4 border hover:shadow-lg transition-shadow"
                                >
                                    <div className="relative w-full aspect-square mb-2">
                                        <Image
                                            src={`${BASE_IMAGE_MENU}/${item.foto}`}
                                            alt={item.nama_makanan}
                                            fill
                                            className="object-cover rounded-lg"
                                            unoptimized
                                        />
                                    </div>

                                    <h3 className="font-semibold mt-2 text-blue-700 line-clamp-2">
                                        {item.nama_makanan}
                                    </h3>

                                    <p className="text-sm text-blue-600 font-medium mt-1">
                                        Rp {item.harga.toLocaleString("id-ID")}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>
        </div>
    );
}