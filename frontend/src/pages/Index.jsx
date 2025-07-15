import { useState } from 'react';
import { Plus, Users, Clock, Code2, Video, MessageSquare, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import CreateRoomModal from '@/components/CreateRoomModal';
import JoinRoomModal from '@/components/JoinRoomModal';

const Index = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const features = [
    {
      icon: Code2,
      title: "Real-time Collaboration",
      description: "Code together with synchronized editing and live cursors"
    },
    {
      icon: Video,
      title: "Video Interviews",
      description: "Face-to-face technical interviews with screen sharing"
    },
    {
      icon: MessageSquare,
      title: "Interactive Whiteboard",
      description: "Sketch algorithms and explain concepts visually"
    },
    {
      icon: Zap,
      title: "Code Execution",
      description: "Run and test code in multiple programming languages"
    },
    {
      icon: Clock,
      title: "Session Timer",
      description: "Track interview time with built-in timer controls"
    },
    {
      icon: Users,
      title: "Feedback System",
      description: "Real-time notes and structured interview feedback"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Collaborative Coding &
            <span className="text-blue-600"> Live Interviews</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            The ultimate platform for technical interviews and pair programming sessions. 
            Code together, communicate seamlessly, and make better hiring decisions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg"
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Interview Room
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => setShowJoinModal(true)}
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Users className="mr-2 h-5 w-5" />
              Join Interview
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white/60 backdrop-blur-sm py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
              <div className="text-gray-600">Programming Languages</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50ms</div>
              <div className="text-gray-600">Real-time Latency</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime Reliability</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <CreateRoomModal open={showCreateModal} onOpenChange={setShowCreateModal} />
      <JoinRoomModal open={showJoinModal} onOpenChange={setShowJoinModal} />
    </div>
  );
};

export default Index;
