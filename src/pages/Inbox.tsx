
import React from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Star, StarOff, Bookmark, AlertTriangle, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Inbox = () => {
  // Mock data for messages
  const messages = [
    {
      id: 1,
      sender: "Colonel Obasanjo",
      avatar: "CO",
      subject: "New intelligence briefing document",
      preview: "I've attached the latest intelligence briefing for the northern region operation...",
      time: "10:24 AM",
      starred: true,
      read: false,
      important: true,
      tags: ["operations", "intel"]
    },
    {
      id: 2,
      sender: "Major Ibrahim",
      avatar: "MI",
      subject: "Request for additional personnel",
      preview: "Due to the expanded scope of Operation Shield, we need to request additional personnel...",
      time: "Yesterday",
      starred: false,
      read: false,
      important: true,
      tags: ["personnel", "urgent"]
    },
    {
      id: 3,
      sender: "Captain Adeyemi",
      avatar: "CA",
      subject: "Weekly situation report - Eastern Command",
      preview: "Please find attached the weekly situation report for Eastern Command covering...",
      time: "Yesterday",
      starred: true,
      read: true,
      important: false,
      tags: ["reports"]
    },
    {
      id: 4,
      sender: "Lt. Commander Okoye",
      avatar: "LO",
      subject: "Equipment maintenance schedule",
      preview: "The quarterly maintenance for surveillance equipment has been scheduled for...",
      time: "Jan 20",
      starred: false,
      read: true,
      important: false,
      tags: ["maintenance"]
    },
    {
      id: 5,
      sender: "Dr. Nnamdi",
      avatar: "DN",
      subject: "Medical supplies for field operations",
      preview: "We have prepared the medical supply kits as requested. They will be ready for...",
      time: "Jan 19",
      starred: false,
      read: true,
      important: false,
      tags: ["medical", "supplies"]
    },
    {
      id: 6,
      sender: "Intel Analysis Team",
      avatar: "IAT",
      subject: "Threat assessment update - CONFIDENTIAL",
      preview: "The threat level in the southwestern region has been reassessed based on new intelligence...",
      time: "Jan 18",
      starred: true,
      read: true,
      important: true,
      tags: ["classified", "intel"]
    },
    {
      id: 7,
      sender: "Logistics Department",
      avatar: "LD",
      subject: "Vehicle deployment status",
      preview: "The armored vehicles requested for the joint task force have been deployed to...",
      time: "Jan 17",
      starred: false,
      read: true,
      important: false,
      tags: ["logistics", "vehicles"]
    }
  ];

  // Mock data for folders and tags
  const folders = [
    { name: "Inbox", count: 125, active: true },
    { name: "Starred", count: 18 },
    { name: "Important", count: 24 },
    { name: "Sent", count: 63 },
    { name: "Drafts", count: 8 },
    { name: "Archived", count: 217 }
  ];

  const tags = [
    { name: "Operations", color: "bg-dhq-blue" },
    { name: "Intel", color: "bg-purple-500" },
    { name: "Logistics", color: "bg-green-500" },
    { name: "Personnel", color: "bg-yellow-500" },
    { name: "Maintenance", color: "bg-gray-500" },
    { name: "Urgent", color: "bg-dhq-red" }
  ];

  const getTagColor = (tag: string) => {
    const foundTag = tags.find(t => t.name.toLowerCase() === tag.toLowerCase());
    return foundTag ? foundTag.color : "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-dhq-dark-bg">
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Message Center</h1>
              <p className="text-gray-400">
                Secure communications and messaging platform
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-dhq-blue"
                />
              </div>
              <button className="p-2 bg-gray-800/50 rounded-lg border border-gray-700">
                <Filter className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Inbox Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="bg-gray-800/30 rounded-lg p-4 h-[calc(100vh-10rem)]">
            <button className="w-full bg-dhq-blue text-white rounded-lg py-2 mb-6">
              + New Message
            </button>
            
            {/* Folders */}
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 px-2">Folders</h3>
              <ul>
                {folders.map(folder => (
                  <li key={folder.name}>
                    <button 
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left mb-1 ${
                        folder.active ? 'bg-gray-700/70 text-white' : 'text-gray-300 hover:bg-gray-700/30'
                      }`}
                    >
                      <span>{folder.name}</span>
                      <Badge variant="outline" className="text-gray-400 bg-transparent">
                        {folder.count}
                      </Badge>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Tags */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 px-2">Tags</h3>
              <ul>
                {tags.map(tag => (
                  <li key={tag.name} className="mb-1">
                    <button className="w-full flex items-center px-3 py-2 rounded-lg text-left text-gray-300 hover:bg-gray-700/30">
                      <span className={`w-3 h-3 rounded-full ${tag.color} mr-3`}></span>
                      <span>{tag.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Message List */}
          <div className="lg:col-span-3 bg-gray-800/30 rounded-lg shadow-lg h-[calc(100vh-10rem)] overflow-hidden flex flex-col">
            {/* Toolbar */}
            <div className="border-b border-gray-700 p-3 flex justify-between items-center">
              <div>
                <button className="text-gray-400 hover:text-white mr-4">
                  <input type="checkbox" className="rounded-sm bg-gray-700 border-gray-600 mr-1" />
                  Select All
                </button>
              </div>
              <div className="flex space-x-2">
                <button className="p-1 text-gray-400 hover:text-white">
                  <Star className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-white">
                  <Bookmark className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-white">
                  <AlertTriangle className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="overflow-y-auto flex-1">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`border-b border-gray-700 hover:bg-gray-700/30 cursor-pointer ${
                    !message.read ? 'bg-gray-700/10' : ''
                  }`}
                >
                  <div className="p-3 flex items-center">
                    <div className="mr-3">
                      <input type="checkbox" className="rounded-sm bg-gray-700 border-gray-600" />
                    </div>
                    <div className="flex items-center mr-3">
                      {message.starred ? (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <StarOff className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                    <div className="mr-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.avatar}`} />
                        <AvatarFallback>{message.avatar}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className={`font-medium truncate ${!message.read ? 'text-white' : 'text-gray-300'}`}>
                          {message.sender}
                        </h4>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                          {message.time}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${!message.read ? 'text-white font-medium' : 'text-gray-400'}`}>
                        {message.subject}
                      </p>
                      <div className="mt-1 flex items-center">
                        <p className="text-xs text-gray-400 truncate mr-2">{message.preview}</p>
                        <div className="flex gap-1">
                          {message.tags.map(tag => (
                            <span 
                              key={tag} 
                              className={`text-xs px-2 py-0.5 rounded-full ${getTagColor(tag)} text-white`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
