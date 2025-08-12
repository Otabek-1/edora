import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { marked } from "marked";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { getSubjects, getThemes, addTheme, updateTheme } from "./api";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

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
        id: s[0],
        name: s[1],
      }));
      setSubjects(arr);

      // Default subjectId
      if (themeId === "new") {
        // Agar queryda subject_id bo'lsa, uni tanlash
        const qSubjectId = searchParams.get("subject_id");
        if (qSubjectId) setSubjectId(Number(qSubjectId));
        else if (arr.length > 0) setSubjectId(arr[0].id);
      }
    });
  }, [themeId, searchParams]);

  // Agar update bo'lsa, theme ma'lumotlarini olish
  useEffect(() => {
    if (themeId && themeId !== "new") {
      setLoading(true);
      getThemes().then((data) => {
        const theme = (data || []).find((t) => String(t[0]) === String(themeId));
        if (theme) {
          setSubjectId(theme[1]);
          setTitle(theme[2]);
          setContent(theme[3]);
          setTags(theme[4]);
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

  const getMarkdownAsHtml = () => {
    return { __html: marked(content || "", { gfm: true, breaks: true }) };
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
          <CKEditor
            editor={ClassicEditor}
            data={content}
            onChange={(event, editor) => {
              const data = editor.getData();
              setContent(data);
            }}
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          disabled={loading}
        >
          {loading ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </form>

      <div className="mt-10 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Markdown Preview (ReactMarkdown)</h2>
          <div className="prose prose-indigo bg-white rounded-xl p-6 border shadow-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Markdown Preview (HTML)</h2>
          <div
            className="prose prose-indigo bg-white rounded-xl p-6 border shadow-sm"
            dangerouslySetInnerHTML={getMarkdownAsHtml()}
          />
        </div>
      </div>
    </div>
  );
}
