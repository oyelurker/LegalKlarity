import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Video, VideoOff, Mic, MicOff, Phone, ScreenShare, Users, MessageSquare, Loader2 } from 'lucide-react';
import DailyIframe from '@daily-co/daily-js';
import api from '../../utils/baseApi';

const VideoAdvisor: React.FC = () => {
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(true);
  const [isSharingScreen, setIsSharingScreen] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [chatVisible, setChatVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Array<{id: number; text: string; sender: string; time: string}>>([]);
  const [participants, setParticipants] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [roomUrl, setRoomUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const dailyRef = useRef<any>(null);
  const callFrameRef = useRef<HTMLDivElement>(null);

  // Get a video advisor room from the backend
  useEffect(() => {
    const getVideoRoom = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await api.post('/api/v1/video-advisor/create-room');
        const { data } = response.data;
        
        setRoomUrl(data.room.url);
      } catch (err: any) {
        console.error('Error getting video room:', err);
        // Provide a fallback room URL in case the backend is not accessible
        if (err.code === 'ERR_NETWORK') {
          setError('Network error: Unable to connect to video advisor service. Please ensure the backend server is running on port 3000.');
        } else {
          setError('Failed to connect to advisor. Please try again later.');
        }
        // For development purposes, we can provide a mock room URL if needed
        // setRoomUrl('https://example.daily.co/mock-room');
      } finally {
        setIsLoading(false);
      }
    };

    getVideoRoom();

    return () => {
      if (dailyRef.current) {
        dailyRef.current.leave();
        dailyRef.current.destroy();
      }
    };
  }, []);

  // Initialize Daily.co video call
  const initializeCall = async () => {
    if (callFrameRef.current && roomUrl) {
      try {
        // Create Daily.co call frame
        dailyRef.current = DailyIframe.createFrame(callFrameRef.current, {
          iframeStyle: {
            position: 'absolute',
            top: '0px',
            left: '0px',
            width: '100%',
            height: '100%',
          },
          showLeaveButton: false,
        });

        // Join the room
        await dailyRef.current.join({
          url: roomUrl,
          userName: 'Legal User',
        });

        // Set up event listeners
        dailyRef.current.on('participants-updated', (event: any) => {
          const participants = dailyRef.current.participants();
          setParticipants(Object.keys(participants).length);
        });

        setIsConnected(true);
      } catch (error) {
        console.error('Error initializing video call:', error);
        setError('Failed to initialize video call. Please try again.');
        setIsLoading(false);
      }
    }
  };

  // Start the call when we have a room URL
  useEffect(() => {
    if (!isLoading && roomUrl) {
      initializeCall();
    }
  }, [isLoading, roomUrl]);

  const toggleVideo = () => {
    if (dailyRef.current) {
      dailyRef.current.setLocalVideo(!isVideoOn);
      setIsVideoOn(!isVideoOn);
    }
  };

  const toggleAudio = () => {
    if (dailyRef.current) {
      dailyRef.current.setLocalAudio(!isAudioOn);
      setIsAudioOn(!isAudioOn);
    }
  };

  const toggleScreenShare = () => {
    if (dailyRef.current) {
      if (!isSharingScreen) {
        dailyRef.current.startScreenShare();
        setIsSharingScreen(true);
      } else {
        dailyRef.current.stopScreenShare();
        setIsSharingScreen(false);
      }
    }
  };

  const endCall = async () => {
    if (dailyRef.current) {
      await dailyRef.current.leave();
      dailyRef.current.destroy();
      dailyRef.current = null;
      setIsConnected(false);
      setParticipants(1);
      
      // Notify backend that session has ended
      try {
        // Extract room ID from the room URL for the API call
        const roomId = roomUrl.split('/').pop() || '';
        if (roomId) {
          await api.post('/api/v1/video-advisor/end-session', { roomId });
        }
      } catch (error) {
        console.error('Error ending video session on backend:', error);
        // Don't show error to user as call was already ended
      }
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: 'You',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">1v1 Video Advisor</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Connect with legal experts in real-time for personalized guidance
          </p>
        </motion.div>

        {/* Video Call Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Video Area */}
          <div className="relative bg-gray-900 h-[60vh]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">Setting up your video call</h2>
                <p className="text-gray-300 mb-6">Preparing your secure session with a legal advisor...</p>
              </div>
            ) : (
              <div id="call-frame" ref={callFrameRef} className="w-full h-full" />
            )}
          </div>

          {/* Controls */}
          <div className="p-6 bg-gray-800">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-full ${isAudioOn ? 'bg-red-500' : 'bg-green-500'} hover:opacity-90 transition`}
                  aria-label={isAudioOn ? "Mute" : "Unmute"}
                >
                  {isAudioOn ? (
                    <Mic className="h-6 w-6 text-white" />
                  ) : (
                    <MicOff className="h-6 w-6 text-white" />
                  )}
                </button>
                
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full ${isVideoOn ? 'bg-red-500' : 'bg-green-500'} hover:opacity-90 transition`}
                  aria-label={isVideoOn ? "Stop Video" : "Start Video"}
                >
                  {isVideoOn ? (
                    <Video className="h-6 w-6 text-white" />
                  ) : (
                    <VideoOff className="h-6 w-6 text-white" />
                  )}
                </button>
                
                <button
                  onClick={toggleScreenShare}
                  className={`p-3 rounded-full ${isSharingScreen ? 'bg-blue-500' : 'bg-gray-700'} hover:opacity-90 transition`}
                  aria-label={isSharingScreen ? "Stop Screen Sharing" : "Start Screen Sharing"}
                >
                  <ScreenShare className="h-6 w-6 text-white" />
                </button>
                
                <button
                  onClick={() => setChatVisible(!chatVisible)}
                  className={`p-3 rounded-full ${chatVisible ? 'bg-blue-500' : 'bg-gray-700'} hover:opacity-90 transition`}
                  aria-label="Toggle Chat"
                >
                  <MessageSquare className="h-6 w-6 text-white" />
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-white">
                  <Users className="h-5 w-5 mr-1" />
                  <span>{participants} participant{participants !== 1 ? 's' : ''}</span>
                </div>
                
                <button
                  onClick={endCall}
                  className="p-3 bg-red-500 hover:bg-red-600 rounded-full transition flex items-center"
                  aria-label="End Call"
                >
                  <Phone className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Legal Document Review</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Share your legal documents directly with your advisor during the video call for real-time review and guidance.
            </p>
            <button className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Upload document for review
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Prepared Questions</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Here are some common questions other users ask during video consultations:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-gray-600 dark:text-gray-400">What are the key risks in this contract?</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-gray-600 dark:text-gray-400">How does this compare to standard practices?</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-gray-600 dark:text-gray-400">What alternatives do I have?</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Advisor Information</h3>
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                <span className="text-gray-700 dark:text-gray-300 font-medium">LA</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Sarah Johnson</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Legal Counsel, 12+ years experience</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Specializes in contract law, intellectual property, and corporate compliance.
            </p>
          </div>
        </div>

        {/* Chat Panel - Toggle visible based on state */}
        {chatVisible && (
          <motion.div 
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-4 bottom-24 top-24 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 border border-gray-200 dark:border-gray-700"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">Chat</h3>
            </div>
            <div className="h-[calc(100%-100px)] overflow-y-auto p-4">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div key={msg.id} className={`mb-3 ${msg.sender === 'You' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-3 rounded-lg max-w-xs ${msg.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'You' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No messages yet. Start the conversation!
                </p>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VideoAdvisor;