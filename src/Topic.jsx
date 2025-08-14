import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { getThemesBySubject } from "./api";

export default function Topic() {
  const { subjectId } = useParams();
  const [themes, setThemes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subjectId) {
      getThemesBySubject(Number(subjectId)).then((data) => {
        setThemes(
          (data || []).map((t) => ({
            id: t.id,
            subject_id: t.subject_id,
            title: t.title,
            tags: t.tags,
          }))
        );
        setLoading(false);
      });
    }
  }, [subjectId]);

  const filteredThemes = themes.filter(
    ({ title, tags }) =>
      title.toLowerCase().includes(search.toLowerCase()) ||
      tags.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto px-4 py-12 pt-20 w-full">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-blue-600 to-purple-700 mb-10 text-center drop-shadow-lg">
          Mavzu bo'limlari
        </h1>

        {/* Search bar */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Bo'lim yoki teg bo'yicha qidiring..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 border-2 border-blue-200 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Yuklanmoqda...</div>
        ) : filteredThemes.length === 0 ? (
          <div className="text-center text-gray-500">Bo'limlar topilmadi.</div>
        ) : (
          <ul className="divide-y divide-blue-100 bg-white rounded-xl shadow">
            {filteredThemes.map(({ id, title, tags }) => (
              <li key={id}>
                <Link
                  to={`/topics/${subjectId}/${id}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-blue-50 transition group"
                >
                  <span className="text-lg font-medium text-indigo-800 group-hover:text-purple-700 transition">
                    {title}
                  </span>
                  <span className="flex flex-wrap gap-2">
                    {tags.split(",").map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Footer />
    </div>
  );
}
