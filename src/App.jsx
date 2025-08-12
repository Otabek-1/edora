import React, { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { getSubjects, getThemes } from "./api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";

export default function Home() {
  const [latestUpdates, setLatestUpdates] = useState([]);
  const [featuredTopics, setFeaturedTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // So‘nggi yangiliklar (themes)
    getThemes().then((data) => {
      const themes = (data || [])
        .slice(-3)
        .reverse()
        .map((t) => ({
          id: t[0],
          title: t[2],
          content: t[3], // endi to‘liq markdown content
          date: new Date().toISOString(),
        }));
      setLatestUpdates(themes);
    });

    // Asosiy mavzular (subjects)
    getSubjects()
      .then((data) => {
        const icons = ["🧩", "📐", "⚛️", "💻", "📊", "📚", "🔬", "📝"];
        const subjects = (data || []).map((s, i) => ({
          id: s[0],
          name: s[1],
          icon: icons[i % icons.length],
        }));
        setFeaturedTopics(subjects);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-500 text-white py-20 px-6 text-center rounded-b-3xl shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Edora'ga Xush Kelibsiz!</h1>
        <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto">
          Qidiring, o'rganing, bilimingizni mustahkamlang.
        </p>
        <Link
          to="/topics"
          className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-full shadow hover:bg-gray-100 transition"
        >
          Mavzularni Ko‘rish
        </Link>
      </section>

      {/* Latest Updates */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">So‘nggi kontentlar</h2>
        {loading ? (
          <div className="text-center text-gray-500">Yuklanmoqda...</div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {latestUpdates.map(({ id, title, content, date }) => (
              <article
                key={id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
              >
                <h3 className="text-xl font-bold mb-2 text-blue-600">{title}</h3>
                {content?.trim().startsWith("<") ? (
                  <div
                    className="prose prose-indigo max-w-none mb-4"
                    dangerouslySetInnerHTML={{
                      __html: content.slice(0, 300) + (content.length > 300 ? "..." : ""),
                    }}
                  />
                ) : (
                  <div className="prose prose-indigo max-w-none mb-4">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content.slice(0, 300) + (content.length > 300 ? "..." : "")}
                    </ReactMarkdown>
                  </div>
                )}
                <time className="text-gray-400 text-sm">
                  {new Date(date).toLocaleDateString()}
                </time>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Featured Topics */}
      <section className="bg-white py-12 shadow-inner">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-10 text-center">
            Asosiy Mavzular
          </h2>
          {loading ? (
            <div className="text-center text-gray-500">Yuklanmoqda...</div>
          ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {featuredTopics.map(({ id, name, icon }) => (
                <div
                  key={id}
                  className="flex flex-col items-center bg-gray-100 hover:bg-gray-200 rounded-xl p-6 w-36 cursor-pointer transition transform hover:scale-105 shadow-sm"
                >
                  <span className="text-4xl mb-3">{icon}</span>
                  <h3 className="text-lg font-semibold text-gray-700">{name}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer preview */}
      <footer className="bg-gray-100 py-8 mt-20 text-center text-gray-600 text-sm min-w-full">
        © 2025 Edora. Barcha huquqlar himoyalangan.
        <Link to="/admin" className="hidden">Kirish</Link>
      </footer>
    </main>
  );
}
