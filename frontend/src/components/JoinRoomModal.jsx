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
      // Send join data to backend
      await axios.post("http://localhost:5000/api/participant/join", {
        roomId: roomId.toUpperCase(),
        name: participantName.trim(),
      });

      toast({
        title: "Joining Room...",
        description: `Connecting to room ${roomId.toUpperCase()}`,
      });

      onOpenChange(false);
      navigate(
        `/interview/${roomId.toUpperCase()}?participant=${encodeURIComponent(participantName)}`
      );
    } catch (error) {
      console.error("Error joining room:", error);
      toast({
        title: "Join Failed",
        description: "Could not join the room. Please try again.",
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
      <DialogContent className="sm:max-w-[450px] bg-[hsl(var(--background))]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Join Interview Room
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Enter the room ID provided by your interviewer to join the session.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Room ID Input */}
          <div className="space-y-2">
            <Label htmlFor="roomId" className="text-sm font-medium">
              Room ID
            </Label>
            <Input
              id="roomId"
              placeholder="e.g., ABC123XY"
              value={roomId}
              onChange={handleRoomIdChange}
              className="h-11 font-mono text-center text-lg tracking-wider"
              maxLength={8}
            />
            <p className="text-xs text-gray-500">
              Room ID should be 8 characters long (provided by room creator)
            </p>
          </div>

          {/* Participant Name */}
          <div className="space-y-2">
            <Label htmlFor="participantName" className="text-sm font-medium">
              Your Name
            </Label>
            <Input
              id="participantName"
              placeholder="Enter your full name"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Quick Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Before you join:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Make sure your microphone and camera are working</li>
              <li>• Use a stable internet connection for best experience</li>
              <li>• Close unnecessary applications to improve performance</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleJoinRoom}
            className="bg-blue-600 hover:bg-blue-700"
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
