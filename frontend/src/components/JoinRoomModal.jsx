import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

const JoinRoomModal = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [language, setLanguage] = useState('javascript'); // still unused

  const handleJoinRoom = async () => {
    if (!roomId.trim()) {
      toast({
        title: "Room ID Required",
        description: "Please enter a valid room ID to join the interview.",
        variant: "destructive",
      });
      return;
    }

    if (!participantName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to join the interview.",
        variant: "destructive",
      });
      return;
    }

    try {
      // ✅ Check if room exists
      const res = await axios.get(`http://localhost:5000/api/rooms/${roomId.toUpperCase()}`);
      const roomData = res.data;

      if (!roomData || !roomData._id) {
        toast({
          title: "Room Not Found",
          description: `Room ${roomId.toUpperCase()} does not exist.`,
          variant: "destructive",
        });
        return;
      }

      const finalLanguage = roomData.language || 'javascript';

      // ✅ Send participant's actual name to backend
      await axios.post("http://localhost:5000/api/participant/join", {
        roomId: roomId.toUpperCase(),
        name: participantName.trim(), // ensures name is passed
        language: finalLanguage,
      });

      toast({
        title: "Joining Room...",
        description: `Connecting to room ${roomId.toUpperCase()}`,
      });

      onOpenChange(false);

      navigate(
        `/interview/${roomId.toUpperCase()}?name=${encodeURIComponent(participantName)}&language=${finalLanguage}`
      );
    } catch (error) {
      console.error("Join room error:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unexpected error occurred. Please try again.";

      toast({
        title: "Join Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleRoomIdChange = (e) => {
    const value = e.target.value.toUpperCase().slice(0, 8);
    setRoomId(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-lavender">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-midnight">
            Join Room
          </DialogTitle>
          <DialogDescription className="text-midnight">
            Enter the room ID provided by your interviewer to join the session.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="roomId" className="text-sm font-medium text-midnight">
              Room ID
            </Label>
            <Input
              id="roomId"
              placeholder="e.g., ABC123XY"
              value={roomId}
              onChange={handleRoomIdChange} 
              className="h-11 font-mono text-center text-lg text-midnight tracking-wider"
              maxLength={8}
            />
            <p className="text-xs text-midnight">
              Room ID should be 8 characters long (provided by room creator)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="participantName" className=" text-midnight text-sm font-medium">
              Your Name
            </Label>
            <Input
              id="participantName"
              placeholder="Enter your full name"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              className="h-11 text-midnight"
            />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-midnight mb-2">Before you join:</h4>
            <ul className="text-sm text-midnight space-y-1">
              <li>• Use a stable internet connection for best experience</li>
              <li>• Close unnecessary applications to improve performance</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button className="bg-white text-midnight"variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleJoinRoom}
            className="bg-midnight hover:bg-darkIndigo"
            disabled={!roomId.trim() || !participantName.trim()}
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Join Room
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinRoomModal;
