import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import HTMLEditor from "./Components/HTMLEditor";
import { getSubjects, getThemes, addTheme, updateTheme } from "./api";

export default function EditTheme() {
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { themeId } = useParams();
  const [searchParams] = useSearchParams();

  // Fetch subjects
  useEffect(() => {
    getSubjects().then((data) => {
      const arr = (data || []).map((s) => ({
        id: s.id,
        name: s.name,
      }));
      setSubjects(arr);

      // Default subjectId
      if (themeId === "new") {
        const qSubjectId = searchParams.get("subject_id");
        if (qSubjectId) setSubjectId(Number(qSubjectId));
        else if (arr.length > 0) setSubjectId(arr[0].id);
      }
    });
  }, [themeId, searchParams]);

  // Fetch theme data for editing
  useEffect(() => {
    if (themeId && themeId !== "new") {
      setLoading(true);
      getThemes().then((data) => {
        const theme = (data || []).find((t) => String(t.id) === String(themeId));
        if (theme) {
          setSubjectId(theme.subject_id);
          setTitle(theme.title);
          setContent(theme.content);
          setTags(theme.tags);
        }
        setLoading(false);
      });
    } else {
      setTitle("");
      setTags("");
      setContent("");
    }
  }, [themeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!title.trim() || !subjectId) {
        setError("Barcha maydonlarni to'ldiring.");
        setLoading(false);
        return;
      }
      const themeData = {
        subject_id: subjectId,
        title,
        content,
        tags,
      };
      if (themeId === "new") {
        await addTheme(themeData);
      } else {
        await updateTheme(themeId, themeData);
      }
      navigate("/dashboard");
    } catch (err) {
      setError("Saqlashda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">
        {themeId === "new" ? "Yangi bo'lim qo'shish" : "Bo'limni tahrirlash"}
      </h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="text-red-600 text-sm mb-2">{error}</div>
        )}
        <div>
          <label htmlFor="subject" className="block text-gray-700 mb-1">
            Mavzu (kategoriya)
          </label>
          <select
            id="subject"
            value={subjectId}
            onChange={(e) => setSubjectId(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block text-gray-700 mb-1">
            Mavzu nomi
          </label>
          <input
            id="title"
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-gray-700 mb-1">
            Teglar
          </label>
          <input
            id="tags"
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Kontent (Editor)</label>
          <HTMLEditor content={content} setContent={setContent} />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          disabled={loading}
        >
          {loading ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </form>
    </div>
  );
}