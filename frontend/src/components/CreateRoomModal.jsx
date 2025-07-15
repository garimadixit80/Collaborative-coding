import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Users, Clock } from 'lucide-react';
import axios from "axios";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const CreateRoomModal = ({ open, onOpenChange }) => {
  const navigate = useNavigate();

  // === State for form inputs ===
  const [roomName, setRoomName] = useState("");
  const [duration, setDuration] = useState("60");
  const [language, setLanguage] = useState("javascript");
  const [roomId] = useState(() =>
    Math.random().toString(36).substr(2, 8).toUpperCase()
  );

  // === Dropdown options ===
  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "typescript", label: "TypeScript" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "php", label: "PHP" },
  ];

  const durations = [
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "1 hour" },
    { value: "90", label: "1.5 hours" },
    { value: "120", label: "2 hours" },
  ];

  // === Copy Room ID to clipboard ===
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast({
      title: "Room ID Copied!",
      description: "Share this ID with interview participants.",
    });
  };

  // === Create Room ===
  const handleCreateRoom = async () => {
    try {
      // 1. Send data to backend
      await axios.post("http://localhost:5000/api/rooms/create", {
        roomId,
        roomName,
        language,
        duration,
      });

      // 2. Show success toast
      toast({
        title: "Room Created Successfully!",
        description: `Room ${roomId} is ready for your interview session.`,
      });

      // 3. Close modal
      onOpenChange(false);

      // 4. Navigate to room
      navigate(
        `/interview/${roomId}?lang=${language}&duration=${duration}&name=${encodeURIComponent(
          roomName
        )}`
      );
    } catch (error) {
      console.error("Room creation error:", error);
      toast({
        title: "Error Creating Room",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[hsl(var(--background))]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Create Interview Room
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Set up your technical interview session with custom settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Room ID Display */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <Label className="text-sm font-medium text-blue-800 mb-2 block">
              Room ID
            </Label>
            <div className="flex items-center space-x-2">
              <code className="bg-white px-3 py-2 rounded border text-lg font-mono text-blue-600 flex-1">
                {roomId}
              </code>
              <Button size="sm" variant="outline" onClick={copyRoomId}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Room Name */}
          <div className="space-y-2">
            <Label htmlFor="roomName" className="text-sm font-medium">
              Room Name (Optional)
            </Label>
            <Input
              id="roomName"
              placeholder="e.g., Frontend Engineer Interview"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Programming Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              <Clock className="inline h-4 w-4 mr-1" />
              Interview Duration
            </Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {durations.map((dur) => (
                  <SelectItem key={dur.value} value={dur.value}>
                    {dur.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateRoom}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Users className="mr-2 h-4 w-4" />
            Create Room
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomModal;
