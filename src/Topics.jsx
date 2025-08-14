import React, { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { Link } from "react-router-dom";
import { getSubjects } from "./api";

export default function Topics() {
    const [subjects, setSubjects] = useState([]);
    const [search, setSearch] = useState(""); // search uchun state qo'shildi
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSubjects()
            .then(data => {
                // data: [ [id, name, tags], ... ]
                setSubjects(
                    (data || []).map(s => ({
                        id: s.id,
                        name: s.name,
                        tags: s.tags,
                    }))
                );
                // console.log(data[0].id);
                
            })
            .finally(() => setLoading(false));
    }, []);

    // Qidiruv natijasini hisoblash
    const filteredSubjects = subjects.filter(
        ({ name, tags }) =>
            name.toLowerCase().includes(search.toLowerCase()) ||
            tags.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-8 py-12 pt-20 w-full">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-12 text-center">
                    Mavzular Ro'yxati
                </h1>

                {/* Search bar */}
                <div className="flex justify-center mb-10">
                    <input
                        type="text"
                        placeholder="Mavzu yoki teg bo'yicha qidiring..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                    />
                </div>

                {loading ? (
                    <div className="text-center text-gray-500">Yuklanmoqda...</div>
                ) : (
                    <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredSubjects.map(({ id, name, tags }) => (
                            <Link
                                to={`/topics/${id}`}
                                key={id}
                                className="relative rounded-xl p-6 cursor-pointer overflow-hidden transform transition-transform duration-300 hover:scale-105"
                                style={{
                                    background: `linear-gradient(135deg, #5b72e6 0%, #6a54c5 100%)`,
                                    color: "white",
                                    minHeight: "160px",
                                }}
                            >
                                <div className="absolute bottom-4 left-4">
                                    <h2 className="text-2xl font-bold drop-shadow-lg">{name}</h2>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {tags.split(",").map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-white bg-opacity-25 text-blue-600 text-xs font-semibold px-3 py-1 rounded backdrop-blur-sm"
                                            >
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
