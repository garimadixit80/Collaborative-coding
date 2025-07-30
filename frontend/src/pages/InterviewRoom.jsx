import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Play, Copy, MessageSquare, Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import CodeEditor from '@/components/CodeEditor';

import WhiteboardPanel from '@/components/WhiteboardPanel';
import Timer from '@/components/Timer';
import ParticipantsList from '@/components/ParticipantsList';
import { toast } from '@/hooks/use-toast';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const InterviewRoom = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const participantName = searchParams.get('name');

  const [roomName, setRoomName] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [duration, setDuration] = useState(60);

  const [activeTab, setActiveTab] = useState('whiteboard'); // default to whiteboard
  const [feedback, setFeedback] = useState('');
  const [code, setCode] = useState('');
  const [codeOutput, setCodeOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/rooms/${roomId}`);
        const room = res.data;
        if (room) {
          setRoomName(room.roomName || 'Unnamed Interview');
          setLanguage(room.language || 'javascript');
          setDuration(room.duration || 60);
        }
      } catch (error) {
        console.error('Failed to fetch room details:', error);
        toast({
          title: 'Room Not Found',
          description: `Could not load details for room ${roomId}`,
          variant: 'destructive',
        });
      }
    };

    fetchRoomDetails();
  }, [roomId]);

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

  useEffect(() => {
    if (!roomId || !participantName) return;

    socket.emit('joinRoom', { name: participantName, roomId });

    socket.on('updateParticipants', (data) => {
      setParticipants(data);
    });

    return () => {
      socket.emit('leaveRoom');
      socket.off('updateParticipants');
    };
  }, [roomId, participantName]);

  // ✅ Load existing feedback when component mounts
  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/notes/${roomId}`);
        if (res.data?.feedback) {
          setFeedback(res.data.feedback);
        }
      } catch (err) {
        console.error("Failed to load interview notes", err);
      }
    };

    if (roomId) {
      loadFeedback();
    }
  }, [roomId]);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId || '');
    toast({
      title: "Room ID Copied!",
      description: "Share this with interview participants",
    });
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast({ title: "Code is empty!", description :  "Please write some code to execute." });
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

  // ✅ Save feedback to backend
  const saveFeedback = async () => {
    try {
      await axios.post(`http://localhost:5000/api/notes/save`, {
        roomId,
        feedback,
      });

      toast({
        title: "Feedback Saved",
        description: "Interview feedback has been saved successfully",
      });
    } catch (err) {
      console.error("Failed to save interview notes", err);
      toast({
        title: "Failed to Save",
        description: "There was an error saving your feedback.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen bg-midnight flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-midnight border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-bold text-lightSteel">{roomName}</h1>
              <div className="flex items-center space-x-3 mt-1">
                <Badge variant="outline" className="bg-lightSteel text-midnight border-blue-200 h-6">
                  Room: {roomId}
                </Badge>
                <Badge variant="outline" className="bg-lightSteel text-green-700 border-green-200 h-6">
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </Badge>
                <Button className="text-lightSteel bg-midnight" size="sm" variant="ghost" onClick={copyRoomId}>
                  <Copy className="h-3 w-3 mr-1 text-lightSteel" />
                  Copy ID
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Timer duration={duration} />
            <Separator orientation="vertical" className="h-8" />
            <ParticipantsList participants={participants} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col bg-white border-r border-gray-200">
          <div className="border-b border-gray-200 px-4 py-3 bg-lavender">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-midnight">Code Editor</h2>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  onClick={handleRunCode}
                  disabled={isExecuting}
                  className="bg-midnight hover:bg-forButton text-white"
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
        <div className="w-96 flex flex-col bg-lavender">
          <div className="border-b border-gray-200 flex">
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'whiteboard'
                  ? 'border-blue-500 text-mignight bg-lavender'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('whiteboard')}
            >
              <MessageSquare className="h-4 w-4 mr-2 inline" />
              Whiteboard
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <WhiteboardPanel />
          </div>

          <div className="border-t border-midnight p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-midnight">Write and Save Notes</h3>
              <Button size="sm" variant="outline" onClick={saveFeedback}>
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
            </div>
            <Textarea
              placeholder="Add your and notes here..."
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
