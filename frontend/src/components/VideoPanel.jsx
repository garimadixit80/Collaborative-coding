import { useEffect, useRef } from 'react';
import { Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const VideoPanel = ({ isMuted, isVideoOff, roomId }) => {
  const localVideoRef = useRef(null);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;

          // Mute/unmute logic
          stream.getAudioTracks().forEach(track => {
            track.enabled = !isMuted;
          });

          // Video on/off logic
          stream.getVideoTracks().forEach(track => {
            track.enabled = !isVideoOff;
          });
        }
      } catch (err) {
        console.error("Failed to access media devices", err);
      }
    };

    getMedia();
  }, [isMuted, isVideoOff]);

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      {/* Local Video Card */}
      <div className="grid grid-cols-1 gap-4 flex-1">
        <Card className="relative overflow-hidden bg-black border-gray-700">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover aspect-video"
          />

          {/* Overlay controls */}
          <div className="absolute top-2 right-2">
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white px-3 py-2">
            <p className="text-sm font-medium truncate">You ({roomId})</p>
          </div>
        </Card>
      </div>

      {/* Status */}
      <div className="text-center text-sm text-gray-500">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Video call connected</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPanel;
