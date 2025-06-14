
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageCircle, Send, Bot, User, Shield, Clock, FileSearch, AlertTriangle } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const AIChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Welcome to DHQ Intelligence Support. I can help you track reports, understand our processes, and answer questions about national security protocols. How may I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Report tracking queries
    if (message.includes('track') || message.includes('status') || message.includes('report')) {
      return 'To track your report, please provide your Report ID (8-character code) that was given when you submitted. I can provide real-time status updates including: Submitted → Under Review → Investigation → Resolved.';
    }
    
    // Security clearance and access
    if (message.includes('clearance') || message.includes('access') || message.includes('login')) {
      return 'Security clearance levels are managed by DHQ Personnel Command. For access issues, contact your commanding officer or the DHQ IT Security Division at ext. 2847.';
    }
    
    // Emergency procedures
    if (message.includes('emergency') || message.includes('urgent') || message.includes('critical')) {
      return 'For immediate threats requiring emergency response, contact: Military Emergency: 199 | National Emergency: 112 | DHQ Operations Center: +234-9-523-XXXX. This chat is for non-emergency support.';
    }
    
    // Reporting procedures
    if (message.includes('how to report') || message.includes('submit') || message.includes('reporting')) {
      return 'DHQ accepts reports through multiple channels: Web Portal (secure), Mobile App, SMS (40404), Emergency Hotline (199/112), Secure Email (intel@dhq.mil.ng), or at any DHQ field office. All submissions are encrypted and can be anonymous.';
    }
    
    // Classification and handling
    if (message.includes('classified') || message.includes('confidential') || message.includes('secret')) {
      return 'All intelligence reports are automatically classified as CONFIDENTIAL until reviewed. Higher classifications (SECRET/TOP SECRET) are assigned by intelligence officers. Ensure proper handling according to DHQ Security Manual 2024.';
    }
    
    // AI and technology
    if (message.includes('ai') || message.includes('technology') || message.includes('system')) {
      return 'Our AI system provides: Voice transcription, Multi-language translation (Hausa, Yoruba, Igbo, English), Threat classification, Geographic prioritization, and Automated response routing. All AI decisions are reviewed by human analysts.';
    }
    
    // General DHQ information
    if (message.includes('dhq') || message.includes('defense') || message.includes('headquarters')) {
      return 'Defense Headquarters serves as the command center for Nigerian Armed Forces operations. Our Intelligence Portal processes over 10,000 reports monthly, coordinates with 36 state commands, and maintains 99.9% system uptime for national security.';
    }
    
    // Default responses based on keywords
    if (message.includes('help') || message.includes('support')) {
      return 'I can assist with: Report tracking, Security procedures, Emergency protocols, System navigation, Classification guidelines, and General DHQ information. What specific area would you like help with?';
    }
    
    // Fallback response
    return 'I understand you\'re asking about defense and security matters. For specific operational questions, please contact your unit commander or DHQ Operations at ext. 2200. For technical support, try rephrasing your question or use these keywords: track, report, emergency, security, clearance.';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getAIResponse(inputMessage),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const quickActions = [
    { label: 'Track My Report', query: 'How do I track my report status?' },
    { label: 'Emergency Protocols', query: 'What are the emergency reporting procedures?' },
    { label: 'Security Clearance', query: 'How do I check my security clearance level?' },
    { label: 'System Status', query: 'What is the current system status?' }
  ];

  return (
    <Card className="bg-gray-800/50 border-gray-700/50 flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center space-x-3 p-4 border-b border-gray-700/50">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold">DHQ Intelligence Assistant</h3>
          <p className="text-gray-400 text-sm">AI-Powered Support • Classification: UNCLASSIFIED</p>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-xs font-semibold">ONLINE</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(action.query)}
              className="text-xs px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors border border-gray-600/30 hover:border-gray-500/50"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-green-600' 
                  : 'bg-blue-600'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`px-4 py-3 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700/50 text-gray-200 border border-gray-600/30'
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex space-x-3 max-w-[80%]">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="px-4 py-3 bg-gray-700/50 border border-gray-600/30 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about reports, procedures, or system status..."
            className="bg-gray-900/50 border-gray-600 text-white flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 px-4"
            disabled={!inputMessage.trim() || isTyping}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          🔒 Secure AI Assistant • For classified matters, use official channels
        </p>
      </div>
    </Card>
  );
};

export default AIChatbot;
