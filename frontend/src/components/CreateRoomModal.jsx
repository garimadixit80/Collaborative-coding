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
  const [creatorName, setCreatorName] = useState("");
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

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast({
      title: "Room ID Copied!",
      description: "Share this ID with interview participants.",
    });
  };

  const handleCreateRoom = async () => {
    if (!creatorName.trim()) {
      toast({
        title: "Please enter your name",
        description: "This will help identify you in the room.",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/rooms/create", {
        roomId,
        roomName,
        language,
        duration,
        creatorName,
      });

      toast({
        title: "Room Created Successfully!",
        description: `Room ${roomId} is ready for your interview session.`,
      });

      onOpenChange(false);

      // ✅ Fixed: changed `creator=` to `creatorName=`
      navigate(
        `/interview/${roomId}?lang=${language}&duration=${duration}&name=${encodeURIComponent(
          roomName
        )}&creatorName=${encodeURIComponent(creatorName)}`
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
      <DialogContent className="sm:max-w-[500px] bg-lavender max-h-[90vh] overflow-y-auto text-midnight">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-midnight">
            Create Room
          </DialogTitle>
          <DialogDescription className="text-midnight">
            Set up your technical interview session with custom settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Room ID Display */}
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <Label className="text-sm font-medium text-midnight mb-2 block">
              Room ID
            </Label>
            <div className="flex items-center space-x-2">
              <code className="bg-lavender px-3 py-2 rounded border text-lg text-midnight font-mono text-blue-600 flex-1">
                {roomId}
              </code>
              <Button className="bg-lavender" size="sm" variant="outline" onClick={copyRoomId}>
                <Copy className="h-4 w-4 hover:text-white" />
              </Button>
            </div>
          </div>

          {/* Creator Name */}
          <div className="space-y-2">
            <Label htmlFor="creatorName" className="text-sm font-medium text-midnight">
              Your Name
            </Label>
            <Input
              id="creatorName"
              placeholder="e.g., Garima Dixit"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              className="h-11 bg-white"
            />
          </div>

          {/* Room Name */}
          <div className="space-y-2">
            <Label htmlFor="roomName" className="text-sm font-medium text-midnight">
              Room Name (Optional)
            </Label>
            <Input
              id="roomName"
              placeholder="e.g., Creating Room For fun"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="h-11 text-midnight"
            />
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-midnight">Programming Language</Label>
            <Select className="text-midnight" value={language} onValueChange={setLanguage}>
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
            <Label className="text-sm font-medium text-midnight">
              <Clock className="inline h-4 w-4 mr-1" />
              Duration
            </Label>
            <Select className="text-midnight" value={duration} onValueChange={setDuration}>
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

        <div className="flex justify-end space-x-3 pt-4 border-t sticky bottom-0 bg-lavender z-10">
          <Button className="text-midnight"variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateRoom}
            className="bg-midnight hover:bg-darkIndigo"
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
