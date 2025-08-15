import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { getThemes, views } from "./api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Theme() {
  const { subjectId, themeId } = useParams();
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  getThemes().then((data) => {

    const found = (data || []).find(
      (t) =>
        String(t.id) === String(themeId) &&
        String(t.subject_id) === String(subjectId)
    );

    if (found) {
      views(found.id)
      setTheme({
        id: found.id,
        subject_id: found.subject_id,
        title: found.title,
        content: found.content,
        tags: found.tags,
        views:found.views,
      });
    }
    setLoading(false);
  });
}, [subjectId, themeId]);


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto px-4 py-12 pt-20 w-full">
        {loading ? (
          <div className="text-center text-gray-500">Yuklanmoqda...</div>
        ) : theme ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-extrabold text-indigo-800 mb-4">{theme.title}</h1>
            <div className="flex flex-wrap gap-2 mb-6">
              {theme.tags.split(",").map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
            <div className="prose max-w-none text-gray-800 text-lg leading-relaxed mb-8">
              {theme.content?.trim().startsWith("<") ? (
                <div dangerouslySetInnerHTML={{ __html: theme.content }} />
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{theme.content}</ReactMarkdown>
              )}
              <div className="flex items-center my-3">
                <span className="text-slate-500 text-md flex items-center gap-2">
                  <FaEye /> {theme.views}
                </span>
              </div>
            </div>
            <Link
              to={`/topics/${subjectId}`}
              className="inline-block text-blue-600 hover:underline text-sm"
            >
              ← Orqaga qaytish
            </Link>
          </div>
        ) : (
          <div className="text-center text-gray-500">Mavzu topilmadi.</div>
        )}
      </main>

      <Footer />
    </div>
  );
}
