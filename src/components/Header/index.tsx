'use client';

import React, { useState } from 'react';
// import './Header.css';

const Header = () => {
    const [searchInput, setSearchInput] = useState('');

    const handleSearch = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log('Search:', searchInput);
    };

    return (
        <div className="w-full bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-800">FlexiStore</h1>
            </div>

            {/* Search Bar */}
            <form className="flex-1 flex gap-2" onSubmit={handleSearch}>
                <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Search
                </button>
            </form>

            {/* Right Icons */}
            <div className="flex gap-4">
                {/* Menu Icon */}
                <button className="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Menu">
                ☰
                </button>

                {/* Cart Icon */}
                <button className="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Cart">
                🛍️
                </button>
            </div>
            </div>
        </div>
    );
};

export default Header;