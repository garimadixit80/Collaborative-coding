import { useEffect, useRef, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const CodeEditor = ({ language, code, setCode }) => {
  const { roomId } = useParams();
  const location = useLocation();
  const editorRef = useRef(null);
  const [participants, setParticipants] = useState([]);
  const [cursors, setCursors] = useState({});

  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get('name');

  function getDefaultCode(lang) {
    const templates = {
      javascript: `// Start coding`,
      python: `# Start coding`,
      java: `// Start coding`,
      cpp: `// Start coding`,
    };
    return templates[lang] || templates.javascript;
  }

  useEffect(() => {
    if (!code?.trim()) {
      const defaultCode = getDefaultCode(language);
      setCode(defaultCode);
    }
  }, [language]);

  useEffect(() => {
    if (!roomId || !name) return;

    socket.emit('join-room', { roomId, name });

    socket.on('code-update', (incomingCode) => {
      if (incomingCode !== code) {
        setCode(incomingCode);
      }
    });

    socket.on('participants-update', (updated) => {
      setParticipants(updated);
    });

    socket.on('cursor-update', ({ socketId, name, cursor }) => {
      setCursors((prev) => ({
        ...prev,
        [socketId]: { name, cursor },
      }));
    });

    return () => {
      socket.off('code-update');
      socket.off('participants-update');
      socket.off('cursor-update');
    };
  }, [roomId, name]);

  const handleCodeChange = (e) => {
    const updatedCode = e.target.value;
    setCode(updatedCode);
    socket.emit('code-change', { roomId, code: updatedCode });
  };

  const handleCursorMove = (e) => {
    const position = e.target.selectionStart;
    const text = e.target.value.substring(0, position);
    const lines = text.split('\n');
    const row = lines.length;
    const col = lines[lines.length - 1].length + 1;

    const cursor = { row, col };
    socket.emit('cursor-move', { roomId, cursor });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative">
        <textarea
          ref={editorRef}
          value={code}
          onChange={handleCodeChange}
          onKeyUp={handleCursorMove}
          onClick={handleCursorMove}
          className="w-full h-full p-4 font-mono text-sm bg-midnight text-gray-100 border-none outline-none resize-none"
          style={{
            fontFamily: "'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
            lineHeight: '1.6',
            tabSize: 2,
          }}
          placeholder="Start coding..."
        />

        {/* Render Cursors */}
        {Object.entries(cursors).map(([id, { name, cursor }], index) => (
          <div
            key={id}
            className="absolute"
            style={{
              top: 20 * (cursor.row - 1) + 10,
              left: 10 + cursor.col * 8,
              pointerEvents: 'none',
            }}
          >
            <div className="flex items-center space-x-1">
              <div className="w-0.5 h-5 bg-pink-500 animate-pulse"></div>
              <div className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded">
                {name}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-midnight text-white px-4 py-2 text-xs flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="capitalize">{language}</span>
          <span className="text-green-400">● Connected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>{participants.length} collaborators</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;