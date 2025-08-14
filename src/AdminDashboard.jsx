import React, { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { getSubjects, addSubject, updateSubject, deleteSubject, getThemesBySubject, deleteTheme } from "./api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  // Subjects (topics)
  const [subjects, setSubjects] = useState([]);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  // Modal state for subject edit/add
  const [showModal, setShowModal] = useState(false);
  const [modalEditId, setModalEditId] = useState(null);
  const [modalName, setModalName] = useState("");
  const [modalTags, setModalTags] = useState("");

  // Themes (contents)
  const [themes, setThemes] = useState([]);
  const [themeSearch, setThemeSearch] = useState("");

  const navigate = useNavigate();

  // Subjects fetch
  useEffect(() => {
    getSubjects().then(data => {
      const arr = (data || []).map(s => ({
        id: s.id,
        name: s.name,
        tags: s.tags,
      }));
      setSubjects(arr);
      if (!selectedSubjectId && arr.length > 0) setSelectedSubjectId(arr[0].id);
    });
  }, []);

  // Themes fetch
  useEffect(() => {
    if (selectedSubjectId) {
      getThemesBySubject(selectedSubjectId).then(data => {
        setThemes(
          (data || []).map(t => ({
            id: t.id,
            subject_id: t.subject_id,
            title: t.title,
            tags: t.tags,
          }))
        );
     
      
      });
    } else {
      setThemes([]);
    }
  }, [selectedSubjectId]);

  // Subject CRUD
  const openModal = (subject = null) => {
    if (subject) {
      setModalEditId(subject.id);
      setModalName(subject.name);
      setModalTags(subject.tags);
    } else {
      setModalEditId(null);
      setModalName("");
      setModalTags("");
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalEditId(null);
    setModalName("");
    setModalTags("");
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!modalName.trim()) return;
    if (modalEditId) {
      await updateSubject(modalEditId, { name: modalName, tags: modalTags });
    } else {
      await addSubject({ name: modalName, tags: modalTags });
    }
    // Refresh subjects
    getSubjects().then(data => {
      const arr = (data || []).map(s => ({
        id: s.id,
        name: s.name,
        tags: s.tags,
      }));
      setSubjects(arr);
      if (!modalEditId && arr.length > 0) setSelectedSubjectId(arr[arr.length - 1].id);
    });
    closeModal();
  };

  const handleSubjectDelete = async (id) => {
    await deleteSubject(id);
    getSubjects().then(data => {
      const arr = (data || []).map(s => ({
        id: s.id,
        name: s.name,
        tags: s.tags,
      }));
      setSubjects(arr);
      if (arr.length > 0) setSelectedSubjectId(arr[0].id);
      else setSelectedSubjectId(null);
    });
  };

  // Theme CRUD
  const handleThemeDelete = async (id) => {
    await deleteTheme(id);
    if (selectedSubjectId) {
      getThemesBySubject(selectedSubjectId).then(data => {
        setThemes(
          (data || []).map(t => ({
            id: t[0],
            subject_id: t[1],
            title: t[2],
            tags: t[4],
          }))
        );
      });
    }
  };

  // Filtered lists
  const filteredSubjects = subjects.filter(
    ({ name, tags }) =>
      name.toLowerCase().includes(subjectSearch.toLowerCase()) ||
      tags.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  const filteredThemes = themes.filter(
    t =>
      t.title.toLowerCase().includes(themeSearch.toLowerCase()) ||
      t.tags.toLowerCase().includes(themeSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100">
      <Navbar />
      <main className="flex-grow max-w-5xl mx-auto px-4 py-12 pt-20 w-full">
        <h1 className="text-3xl font-extrabold text-indigo-800 mb-8 text-center">
          Admin Dashboard
        </h1>

        {/* Topics (Subjects) List */}
        <div className="bg-white rounded-xl shadow p-6 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Mavzu yoki teg bo'yicha qidiring..."
                value={subjectSearch}
                onChange={e => setSubjectSearch(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
              onClick={() => openModal()}
            >
              + Yangi mavzu
            </button>
          </div>
          <ul className="divide-y divide-blue-100">
            {filteredSubjects.map(subject => (
              <li
                key={subject.id}
                className={`flex items-center justify-between py-3 cursor-pointer rounded transition ${
                  selectedSubjectId === subject.id
                    ? "bg-indigo-50"
                    : "hover:bg-blue-50"
                }`}
                onClick={() => setSelectedSubjectId(subject.id)}
              >
                <div>
                  <span className="font-medium text-indigo-800">{subject.name}</span>
                  <span className="ml-3 text-xs text-gray-500">
                    {subject.tags.split(",").map((tag, idx) => (
                      <span key={idx} className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full mr-1">{tag.trim()}</span>
                    ))}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={e => {
                      e.stopPropagation();
                      openModal(subject);
                    }}
                  >
                    Tahrirlash
                  </button>
                  <button
                    className="text-red-600 hover:underline text-sm"
                    onClick={e => {
                      e.stopPropagation();
                      handleSubjectDelete(subject.id);
                    }}
                  >
                    O'chirish
                  </button>
                </div>
              </li>
            ))}
            {filteredSubjects.length === 0 && (
              <li className="text-gray-500 text-center py-4">Mavzular yo'q</li>
            )}
          </ul>
        </div>

        {/* Themes (Contents) List */}
        <div className="bg-white rounded-xl shadow p-6 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Bo'lim yoki teg bo'yicha qidiring..."
                value={themeSearch}
                onChange={e => setThemeSearch(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
              onClick={() => navigate(`/theme-edit/new?subject_id=${selectedSubjectId}`)}
            >
              + Yangi bo'lim
            </button>
          </div>
          <ul className="divide-y divide-blue-100">
            {filteredThemes.map(theme => (
              <li key={theme.id} className="flex items-center justify-between py-3">
                <div>
                  <span className="font-medium text-indigo-800">{theme.title}</span>
                  <span className="ml-3 text-xs text-gray-500">
                    {theme.tags.split(",").map((tag, idx) => (
                      <span key={idx} className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full mr-1">{tag.trim()}</span>
                    ))}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => navigate(`/theme-edit/${theme.id}`)}
                  >
                    Tahrirlash
                  </button>
                  <button
                    className="text-red-600 hover:underline text-sm"
                    onClick={() => handleThemeDelete(theme.id)}
                  >
                    O'chirish
                  </button>
                </div>
              </li>
            ))}
            {filteredThemes.length === 0 && (
              <li className="text-gray-500 text-center py-4">Bo'limlar yo'q</li>
            )}
          </ul>
        </div>
      </main>
      <Footer />

      {/* Modal for subject add/edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl"
              onClick={closeModal}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">{modalEditId ? "Mavzuni tahrirlash" : "Yangi mavzu qo'shish"}</h2>
            <form onSubmit={handleModalSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Mavzu nomi</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={modalName}
                  onChange={e => setModalName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Teglar (vergul bilan)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={modalTags}
                  onChange={e => setModalTags(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition w-full"
              >
                {modalEditId ? "Saqlash" : "Qo'shish"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
