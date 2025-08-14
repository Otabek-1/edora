import { useRef, useEffect, useState } from 'react';

const HTMLEditor = ({ content, setContent }) => {
  const [showYouTubeInput, setShowYouTubeInput] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize editor content on mount or when content prop changes
  useEffect(() => {
    if (editorRef.current) {
      // Only set initial content if content prop is empty or undefined
      if (!content) {
        editorRef.current.innerHTML = `
          <h1>Salom Dunyo!</h1>
          <p>Bu yerda <b>qalin</b> va <i>qiya</i> matn yozishingiz mumkin.</p>
          <p>Shuningdek <code>kod</code> ham qo'shishingiz mumkin.</p>
        `;
        setContent(editorRef.current.innerHTML);
      } else {
        editorRef.current.innerHTML = content;
      }
    }
  }, [content, setContent]);

  const formatText = (command) => {
    if (editorRef.current) {
      editorRef.current.focus();
      try {
        if (['h1', 'h2', 'h3', 'p'].includes(command)) {
          document.execCommand('formatBlock', false, command);
        } else if (command === 'bold') {
          document.execCommand('bold', false, null);
        } else if (command === 'italic') {
          document.execCommand('italic', false, null);
        } else if (command === 'code') {
          const selection = window.getSelection();
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const selectedText = range.toString();
            if (selectedText) {
              const codeElement = document.createElement('code');
              codeElement.textContent = selectedText;
              range.deleteContents();
              range.insertNode(codeElement);
              selection.removeAllRanges();
            }
          }
        }
        updatePreview();
      } catch (error) {
        console.error('Error executing command:', error);
      }
    }
  };

  const insertLink = () => {
    const url = prompt('Havola URL ni kiriting:');
    if (url) {
      try {
        document.execCommand('createLink', false, url);
        updatePreview();
      } catch (error) {
        console.error('Error inserting link:', error);
      }
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';

        if (editorRef.current) {
          editorRef.current.focus();
          const selection = window.getSelection();
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.insertNode(img);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
          }
          updatePreview();
        }
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  const insertYouTube = () => {
    setShowYouTubeInput(true);
  };

  const embedYouTube = () => {
    if (youtubeUrl) {
      let videoId = '';
      if (youtubeUrl.includes('youtube.com/watch?v=')) {
        videoId = youtubeUrl.split('v=')[1].split('&')[0];
      } else if (youtubeUrl.includes('youtu.be/')) {
        videoId = youtubeUrl.split('youtu.be/')[1].split('?')[0];
      } else if (youtubeUrl.includes('youtube.com/embed/')) {
        videoId = youtubeUrl.split('embed/')[1].split('?')[0];
      }

      if (videoId) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        iframe.width = '100%';
        iframe.height = '315';
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;

        if (editorRef.current) {
          editorRef.current.focus();
          editorRef.current.appendChild(iframe);
          updatePreview();
        }
        cancelYouTube();
      } else {
        alert("Noto'g'ri YouTube URL. Iltimos, to'g'ri URL kiriting.");
      }
    }
  };

  const cancelYouTube = () => {
    setShowYouTubeInput(false);
    setYoutubeUrl('');
  };

  const updatePreview = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
    }
  };

  const copyHTML = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch((error) => {
      console.error('Error copying HTML:', error);
    });
  };

  const handleEditorInput = () => {
    console.log('Editor input event triggered');
    updatePreview();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      try {
        document.execCommand('insertHTML', false, '<br><br>');
      } catch (error) {
        console.error('Error inserting line break:', error);
      }
    }
  };

  const ToolbarButton = ({ onClick, children, tooltip }) => (
    <button
      className="toolbar-btn relative p-3 rounded-lg hover:bg-gray-100"
      onClick={onClick}
    >
      {children}
      <div className="tooltip">{tooltip}</div>
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            <ToolbarButton onClick={() => formatText('h1')} tooltip="Sarlavha 1 — <h1>">
              <span className="text-lg font-bold">H1</span>
            </ToolbarButton>
            <ToolbarButton onClick={() => formatText('h2')} tooltip="Sarlavha 2 — <h2>">
              <span className="text-base font-bold">H2</span>
            </ToolbarButton>
            <ToolbarButton onClick={() => formatText('h3')} tooltip="Sarlavha 3 — <h3>">
              <span className="text-sm font-bold">H3</span>
            </ToolbarButton>
            <div className="w-px h-8 bg-gray-300 mx-2"></div>
            <ToolbarButton onClick={() => formatText('p')} tooltip="Paragraf — <p>">
              <span className="text-sm">P</span>
            </ToolbarButton>
            <div className="w-px h-8 bg-gray-300 mx-2"></div>
            <ToolbarButton onClick={() => formatText('bold')} tooltip="Qalin — <b>">
              <span className="font-bold">B</span>
            </ToolbarButton>
            <ToolbarButton onClick={() => formatText('italic')} tooltip="Qiya — <i>">
              <span className="italic">I</span>
            </ToolbarButton>
            <ToolbarButton onClick={() => formatText('code')} tooltip="Kod — <code>">
              <span className="font-mono text-sm">&lt;/&gt;</span>
            </ToolbarButton>
            <div className="w-px h-8 bg-gray-300 mx-2"></div>
            <ToolbarButton onClick={insertLink} tooltip="Havola — <a>">
              <span className="text-blue-600">🔗</span>
            </ToolbarButton>
            <ToolbarButton onClick={() => fileInputRef.current?.click()} tooltip="Rasm — <img>">
              <span>📷</span>
            </ToolbarButton>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <ToolbarButton onClick={insertYouTube} tooltip="YouTube Video — <iframe>">
              <span className="text-red-600">📺</span>
            </ToolbarButton>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-0">
          <div className="p-6 border-r border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Muharrir</h3>
            <div
              ref={editorRef}
              className="editor-content border border-gray-300 rounded-lg p-4 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              contentEditable="true"
              onInput={handleEditorInput}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Jonli Ko'rinish</h3>
            <div
              className="border border-gray-300 rounded-lg p-4 bg-white min-h-[300px]"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>

        {showYouTubeInput && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="YouTube video URL ni kiriting..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
              <button
                onClick={embedYouTube}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Qo'shish
              </button>
              <button
                onClick={cancelYouTube}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">HTML Kodi</h3>
        <textarea
          value={content}
          readOnly
          className="w-full h-32 p-4 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm resize-none"
        />
        <button
          onClick={copyHTML}
          className={`mt-3 px-4 py-2 rounded-lg transition-colors ${
            copySuccess
              ? 'bg-green-700 text-white'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {copySuccess ? 'Nusxalandi!' : 'HTML ni nusxalash'}
        </button>
      </div>
    </div>
  );
};

export default HTMLEditor;