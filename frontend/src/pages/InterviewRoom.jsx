import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Play, Square, Copy, Users, Mic, MicOff,
  Video, VideoOff, Settings, MessageSquare, Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import CodeEditor from '@/components/CodeEditor';
import VideoPanel from '@/components/VideoPanel';
import WhiteboardPanel from '@/components/WhiteboardPanel';
import Timer from '@/components/Timer';
import ParticipantsList from '@/components/ParticipantsList';
import { toast } from '@/hooks/use-toast';

const InterviewRoom = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();

  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [activeTab, setActiveTab] = useState('video');
  const [feedback, setFeedback] = useState('');
  const [code, setCode] = useState(''); // ✅ Holds source code
  const [codeOutput, setCodeOutput] = useState(''); // ✅ Holds output from Judge0
  const [isExecuting, setIsExecuting] = useState(false);

  const roomName = searchParams.get('name') || 'Unnamed Interview';
  const language = searchParams.get('lang') || 'javascript';
  const duration = parseInt(searchParams.get('duration') || '60');
  const participantName = searchParams.get('participant');

  useEffect(() => {
    if (participantName) {
      toast({
        title: "Welcome to the Interview!",
        description: `You've successfully joined room ${roomId}`,
      });
    } else {
      toast({
        title: "Interview Room Created",
        description: `Room ${roomId} is now active and ready for participants`,
      });
    }
  }, [roomId, participantName]);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId || '');
    toast({
      title: "Room ID Copied!",
      description: "Share this with interview participants",
    });
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast({ title: "Code is empty!", description: "Please write some code to execute." });
      return;
    }

    setIsExecuting(true);
    setCodeOutput('// Running code...');

    try {
      const res = await axios.post('http://localhost:5000/api/judge', {
        sourceCode: code,
        language,
        stdin: '',
      });

      const { output, stderr } = res.data;

      if (stderr) {
        setCodeOutput(`// ❌ Error:\n${stderr}`);
      } else {
        setCodeOutput(output || '// No Output');
      }
    } catch (err) {
      console.error(err);
      setCodeOutput('// ❌ Failed to run code. Please try again.');
    }

    setIsExecuting(false);
  };

  const saveFeedback = () => {
    toast({
      title: "Feedback Saved",
      description: "Interview feedback has been saved successfully",
    });
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{roomName}</h1>
              <div className="flex items-center space-x-3 mt-1">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Room: {roomId}
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </Badge>
                <Button size="sm" variant="ghost" onClick={copyRoomId}>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy ID
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Timer duration={duration} />
            <Separator orientation="vertical" className="h-8" />
            <ParticipantsList />
            <Button
              size="sm"
              variant={isRecording ? "destructive" : "outline"}
              onClick={() => setIsRecording(!isRecording)}
            >
              {isRecording ? <Square className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {isRecording ? 'Stop' : 'Record'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col bg-white border-r border-gray-200">
          <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Code Editor</h2>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
                <Button
                  size="sm"
                  onClick={handleRunCode}
                  disabled={isExecuting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isExecuting ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-1 border-2 border-white border-t-transparent rounded-full"></div>
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Run Code
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <CodeEditor language={language} code={code} setCode={setCode} />
          </div>
          {codeOutput && (
            <div className="border-t border-gray-200 bg-gray-900 text-green-400 p-4 max-h-48 overflow-y-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap">{codeOutput}</pre>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-96 flex flex-col bg-white">
          <div className="border-b border-gray-200 flex">
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'video'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('video')}
            >
              <Video className="h-4 w-4 mr-2 inline" />
              Video Call
            </button>
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'whiteboard'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('whiteboard')}
            >
              <MessageSquare className="h-4 w-4 mr-2 inline" />
              Whiteboard
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === 'video' ? <VideoPanel /> : <WhiteboardPanel />}
          </div>

          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex justify-center space-x-3">
              <Button
                size="sm"
                variant={isMuted ? "destructive" : "outline"}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant={isVideoOff ? "destructive" : "outline"}
                onClick={() => setIsVideoOff(!isVideoOff)}
              >
                {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Interview Notes</h3>
              <Button size="sm" variant="outline" onClick={saveFeedback}>
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
            </div>
            <Textarea
              placeholder="Add your feedback and notes here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[120px] text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;
