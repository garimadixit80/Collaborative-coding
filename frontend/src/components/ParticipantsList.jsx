import React, { useEffect, useState } from 'react';
import {
  Users,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import io from 'socket.io-client';
import { useSearchParams } from 'react-router-dom';

const socket = io('http://localhost:5000'); // Adjust for production

const ParticipantsList = () => {
  const [participants, setParticipants] = useState([]);
  const [searchParams] = useSearchParams();

  // ✅ Unified name handling — supports both creator and participant
  const name =
    searchParams.get('name') ||
    searchParams.get('creatorName') ||
    searchParams.get('participantName') ||
    'Guest';

  const roomId = searchParams.get('roomId') || 'default-room';

  useEffect(() => {
    socket.emit('joinRoom', { name, roomId });

    socket.on('updateParticipants', (list) => {
      setParticipants(list);
    });

    return () => {
      socket.emit('leaveRoom', { name, roomId });
      socket.off('updateParticipants');
    };
  }, [name, roomId]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4 mr-2" />
          {participants.length} Participants
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4 bg-glass" align="end" bg->
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-midnight">Participants</h3>
            <Badge variant="secondary">{participants.length} online</Badge>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {participants.map((participant, index) => (
              <div
                key={participant.socketId || index}
                className="flex items-center gap-3 rounded-md bg-forButton px-3 py-2"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-midnight text-lightSteel font-semibold">
                      {participant.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-0.5 -right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-lightSteel truncate">
                      {participant.name}
                    </p>
                    {index === 0 && (
                      <Crown className="h-4 w-4 text-lightSteel" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-lightSteel">
                    <span>{index === 0 ? 'Host' : 'Participant'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                </div>
              </div>
            ))}
          </div>

          
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ParticipantsList;
