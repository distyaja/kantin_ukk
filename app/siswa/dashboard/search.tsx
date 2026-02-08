import React from 'react';

interface SearchProps {
    url: string;
    search: string;
    onSearch: (value: string) => void;
}

const Search: React.FC<SearchProps> = ({ url, search, onSearch }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(event.target.value);
    };

    return (
        <input
            type="text"
            value={search}
            onChange={handleChange}
            placeholder="Search..."
            className="border p-2 rounded-md w-full"
        />
    );
};

export default Search;