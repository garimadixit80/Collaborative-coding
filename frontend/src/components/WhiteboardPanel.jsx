import { useState } from 'react';
import { Pen, Eraser, Square, Circle, Type, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const WhiteboardPanel = () => {
  const [selectedTool, setSelectedTool] = useState('pen');
  const [isDrawing, setIsDrawing] = useState(false);

  const tools = [
    { id: 'pen', icon: Pen, label: 'Pen' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'text', icon: Type, label: 'Text' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Whiteboard Toolbar */}
      <div className="border-b border-gray-200 p-3 bg-gray-50">
        <div className="flex items-center space-x-2 mb-3">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              size="sm"
              variant={selectedTool === tool.id ? 'default' : 'outline'}
              onClick={() => setSelectedTool(tool.id)}
              className="flex-1"
            >
              <tool.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-600">Color:</span>
              <div className="flex space-x-1">
                {['bg-black', 'bg-red-500', 'bg-blue-500', 'bg-green-500'].map((color) => (
                  <button
                    key={color}
                    className={`w-5 h-5 rounded-full border-2 ${color} ${
                      color === 'bg-black' ? 'border-gray-400' : 'border-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button size="sm" variant="ghost">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Whiteboard Canvas */}
      <div className="flex-1 relative bg-white">
        <canvas
          className="w-full h-full cursor-crosshair"
          onMouseDown={() => setIsDrawing(true)}
          onMouseUp={() => setIsDrawing(false)}
          onMouseLeave={() => setIsDrawing(false)}
        />

        {/* Placeholder content */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-gray-400 text-center">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-sm">Start drawing or writing</p>
            <p className="text-xs text-gray-300 mt-1">Collaborate visually with your interview partner</p>
          </div>
        </div>

        {/* Sample drawings for demo */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <circle
            cx="100"
            cy="80"
            r="30"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.3"
          />
          <rect
            x="150"
            y="60"
            width="80"
            height="40"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.3"
          />
          <text
            x="50"
            y="150"
            fontSize="14"
            fill="#10b981"
            opacity="0.4"
          >
            Algorithm steps:
          </text>
        </svg>
      </div>

      {/* Collaboration Status */}
      <div className="border-t border-gray-200 px-3 py-2 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Real-time collaboration active</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>2 users drawing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardPanel;
