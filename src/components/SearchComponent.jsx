import React, { useState } from 'react';
import { useMap } from 'react-leaflet';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify'


const SearchComponent = () => {
    const map = useMap();
    const [searchQuery, setSearchQuery] = useState('');


    const handleSearch = async (e) => {

        e.preventDefault();

        if (!searchQuery) return;

        try {
            // Use Nominatim API to fetch coordinates for the search query
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                map.setView([parseFloat(lat), parseFloat(lon)], 13); // Move the map to the searched location
            } else {
                toast.error('Location not found.', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
            }
        } catch (error) {
            console.error('Error fetching location:', error);
            
            toast.error('An error occurred while searching for the location.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        }
    };

    return (<>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition:Bounce
        />

        <form onSubmit={handleSearch} className="flex gap-3">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter place name"
                className="border p-2 rounded border-black w-[173px]"
            />
            <button
                type="submit"
                className="items-center pb-1 bg-blue-600 hover:bg-blue-700 text-base text-white p-2 w-20 h-9 rounded"
            >
                Search
            </button>
        </form>


    </>

    );
};

export default SearchComponent;