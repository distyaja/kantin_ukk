'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '../icon';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <nav className="bg-yellow-300 sticky top-0 z-20 border-b border-yellow-400">
            <div className="w-full px-8 flex flex-wrap items-center justify-between mx-auto p-4">

                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2">
                    <Icon size={28} color="#2563eb" />
                    <span className="text-xl font-bold text-blue-600">
                        IniKantin
                    </span>
                </Link>

                {/* MOBILE BUTTON */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden inline-flex items-center justify-center p-2 w-10 h-10 text-blue-600 rounded-lg hover:bg-yellow-200 focus:ring-2 focus:ring-blue-400"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* MENU */}
                <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`}>
                    <ul className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 mt-4 md:mt-0 bg-yellow-300 md:bg-transparent rounded-lg p-4 md:p-0">

                        <li>
                            <Link
                                href="/"
                                className="font-semibold text-blue-600 hover:text-blue-800"
                            >
                                Home
                            </Link>
                        </li>

                        {/* DROPDOWN MENU STAN */}
                        <li className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800"
                            >
                                Stan
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" d="m6 9 6 6 6-6" />
                                </svg>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute mt-2 w-48 bg-yellow-200 rounded-lg shadow-lg border border-yellow-400">
                                    <ul className="py-2 text-sm text-blue-700 font-medium">
                                        <li>
                                            <Link
                                                href="/stan/dashboard"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="block px-4 py-2 hover:bg-yellow-300 hover:text-blue-800"
                                            >
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/stan/menu"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="block px-4 py-2 hover:bg-yellow-300 hover:text-blue-800"
                                            >
                                                Menu
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>

                        <li>
                            <Link
                                href="/services"
                                className="font-semibold text-blue-600 hover:text-blue-800"
                            >
                                Services
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/pricing"
                                className="font-semibold text-blue-600 hover:text-blue-800"
                            >
                                Pricing
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/contact"
                                className="font-semibold text-blue-600 hover:text-blue-800"
                            >
                                Contact
                            </Link>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    );
}
