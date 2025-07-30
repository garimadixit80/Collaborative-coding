import { useRef, useState, useEffect } from 'react';
import { Pen, Eraser, Square, Circle, Type, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const WhiteboardPanel = () => {
  const [selectedTool, setSelectedTool] = useState('pen');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(2);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const tools = [
    { id: 'pen', icon: Pen, label: 'Pen' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'text', icon: Type, label: 'Text' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.moveTo(getX(e), getY(e));
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = ctxRef.current;
    ctx.strokeStyle = selectedTool === 'eraser' ? '#ffffff' : selectedColor;
    ctx.lineWidth = brushSize;
    ctx.lineTo(getX(e), getY(e));
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    ctxRef.current.closePath();
  };

  const getX = (e) => e.nativeEvent.offsetX;
  const getY = (e) => e.nativeEvent.offsetY;

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-midnight p-3 bg-lavender">
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
                {[
                  { name: 'Black', value: '#000000' },
                  { name: 'Red', value: '#ef4444' },
                  { name: 'Blue', value: '#3b82f6' },
                  { name: 'Green', value: '#22c55e' },
                ].map((colorObj) => (
                  <button
                    key={colorObj.value}
                    onClick={() => setSelectedColor(colorObj.value)}
                    className={`w-5 h-5 rounded-full border-2`}
                    style={{
                      backgroundColor: colorObj.value,
                      borderColor: selectedColor === colorObj.value ? '#333' : '#ccc',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button size="sm" variant="ghost" onClick={handleClear}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative bg-white">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />

        
      </div>

      
    </div>
  );
};

export default WhiteboardPanel;
