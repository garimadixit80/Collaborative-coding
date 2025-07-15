import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

// ⚠️ Connect to backend WebSocket
const socket = io('http://localhost:5000');

const CodeEditor = ({ language, code, setCode }) => {
  const { roomId } = useParams();
  const editorRef = useRef(null);

  function getDefaultCode(lang) {
    const templates = {
      javascript: `// Welcome to the collaborative coding interview!
// Feel free to start coding here

function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,
      python: `# Welcome to the collaborative coding interview!
# Feel free to start coding here

def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,
      java: `// Welcome to the collaborative coding interview!
// Feel free to start coding here

public class Main {
    public static void main(String[] args) {
        System.out.println(greet("World"));
    }

    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
}`,
      cpp: `// Welcome to the collaborative coding interview!
// Feel free to start coding here

#include <iostream>
#include <string>

std::string greet(const std::string& name) {
    return "Hello, " + name + "!";
}

int main() {
    std::cout << greet("World") << std::endl;
    return 0;
}`,
    };
    return templates[lang] || templates.javascript;
  }

  // Initialize with default code if empty
  useEffect(() => {
    if (!code?.trim()) {
      const defaultCode = getDefaultCode(language);
      setCode(defaultCode);
    }
  }, [language]);

  // Join room & listen for updates
  useEffect(() => {
    if (!roomId) return;

    socket.emit('join-room', roomId);
    socket.on('code-update', (incomingCode) => {
      if (incomingCode !== code) {
        setCode(incomingCode);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, code, setCode]);

  const handleCodeChange = (e) => {
    const updatedCode = e.target.value;
    setCode(updatedCode);
    socket.emit('code-change', { roomId, code: updatedCode });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Code Editor Area */}
      <div className="flex-1 relative">
        <textarea
          ref={editorRef}
          value={code}
          onChange={handleCodeChange}
          className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 border-none outline-none resize-none"
          style={{
            fontFamily: "'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
            lineHeight: '1.6',
            tabSize: 2,
          }}
          placeholder="Start coding here..."
        />

        {/* Fake collaborative cursors */}
        <div className="absolute top-16 left-20 pointer-events-none">
          <div className="flex items-center space-x-2">
            <div className="w-0.5 h-5 bg-blue-500 animate-pulse"></div>
            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
              Interviewer
            </div>
          </div>
        </div>
        <div className="absolute top-32 left-40 pointer-events-none">
          <div className="flex items-center space-x-2">
            <div className="w-0.5 h-5 bg-green-500 animate-pulse"></div>
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded">
              Candidate
            </div>
          </div>
        </div>
      </div>

      {/* Footer status bar */}
      <div className="bg-gray-800 text-gray-300 px-4 py-2 text-xs flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span>Line 1, Column 1</span>
          <span>•</span>
          <span className="capitalize">{language}</span>
          <span>•</span>
          <span className="text-green-400">● Connected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>2 collaborators</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
