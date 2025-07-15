import {
  Users,
  Crown,
  Mic,
  MicOff,
  Video,
  VideoOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const ParticipantsList = () => {
  const participants = [
    {
      id: 1,
      name: 'John Smith',
      role: 'Interviewer',
      isHost: true,
      isMuted: false,
      hasVideo: true,
      isTyping: false,
      avatar: 'JS'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'Candidate',
      isHost: false,
      isMuted: false,
      hasVideo: true,
      isTyping: true,
      avatar: 'SJ'
    }
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4 mr-2" />
          {participants.length} Participants
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Participants</h3>
            <Badge variant="secondary">{participants.length} online</Badge>
          </div>

          {/* Participant List */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center gap-3 rounded-md bg-gray-50 px-3 py-2"
              >
                {/* Avatar + Status */}
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                      {participant.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {participant.name}
                    </p>
                    {participant.isHost && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>{participant.role}</span>
                    {participant.isTyping && (
                      <span className="text-blue-600 italic">typing…</span>
                    )}
                  </div>
                </div>

                {/* Media status */}
                <div className="flex items-center gap-1">
                  {participant.isMuted ? (
                    <MicOff className="h-4 w-4 text-red-500" />
                  ) : (
                    <Mic className="h-4 w-4 text-green-500" />
                  )}
                  {participant.hasVideo ? (
                    <Video className="h-4 w-4 text-green-500" />
                  ) : (
                    <VideoOff className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center"
            >
              <Users className="h-4 w-4 mr-2" />
              Invite More Participants
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ParticipantsList;
