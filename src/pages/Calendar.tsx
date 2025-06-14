
import React, { useState } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, Clock, MapPin } from "lucide-react";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Mock events data
  const events = [
    {
      id: 1,
      title: "Security Briefing",
      date: new Date(),
      startTime: "09:00",
      endTime: "10:00",
      location: "DHQ Conference Room A",
      attendees: 12,
      type: "meeting",
    },
    {
      id: 2,
      title: "Field Operation Planning",
      date: new Date(),
      startTime: "11:30",
      endTime: "13:00",
      location: "Operations Center",
      attendees: 8,
      type: "operation",
    },
    {
      id: 3,
      title: "Intelligence Review",
      date: new Date(),
      startTime: "14:00",
      endTime: "15:30",
      location: "Secure Briefing Room",
      attendees: 6,
      type: "intel",
    },
    {
      id: 4,
      title: "Emergency Response Drill",
      date: new Date(Date.now() + 86400000), // Tomorrow
      startTime: "10:00",
      endTime: "12:00",
      location: "Training Grounds",
      attendees: 25,
      type: "training",
    }
  ];
  
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-dhq-blue text-white";
      case "operation":
        return "bg-orange-500 text-white";
      case "intel":
        return "bg-purple-500 text-white";
      case "training":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  
  // Filter events for today
  const todayEvents = events.filter(
    event => event.date.toDateString() === new Date().toDateString()
  );

  return (
    <div className="min-h-screen bg-dhq-dark-bg">
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Calendar & Schedules</h1>
              <p className="text-gray-400">
                Track operations, briefings, and training schedules
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-dhq-blue text-white rounded-lg hover:bg-blue-700 transition-colors">
                + Add Event
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Widget */}
          <div className="bg-gray-800/30 rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-white">
                  <CalendarIcon className="inline-block mr-2 h-5 w-5" />
                  Calendar
                </h2>
                <div className="flex space-x-1">
                  <button className="p-1 rounded hover:bg-gray-700">
                    <ChevronLeft className="h-5 w-5 text-gray-400" />
                  </button>
                  <button className="p-1 rounded hover:bg-gray-700">
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="border-gray-700"
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">EVENT TYPES</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-dhq-blue rounded-full mr-2"></span>
                  <span className="text-gray-300">Meetings</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                  <span className="text-gray-300">Operations</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                  <span className="text-gray-300">Intelligence</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-gray-300">Training</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Event Details */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/30 rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-white">Today's Schedule</h2>
                <div>
                  <button className="text-xs text-gray-400 hover:text-white transition-colors">
                    View All
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {todayEvents.length > 0 ? (
                  todayEvents.map(event => (
                    <div key={event.id} className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white">{event.title}</h3>
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center text-gray-400">
                          <Clock className="h-4 w-4 mr-2" />
                          <span className="text-sm">{event.startTime} - {event.endTime}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <User className="h-4 w-4 mr-2" />
                          <span className="text-sm">{event.attendees} attendees</span>
                        </div>
                        <div className="flex items-center text-gray-400 col-span-2">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-sm">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-400">No events scheduled for today</p>
                    <button className="mt-2 text-dhq-blue hover:underline">
                      + Schedule an event
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Upcoming Events */}
            <div className="bg-gray-800/30 rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-medium text-white mb-4">Upcoming Events</h2>
              <div className="space-y-2">
                {events
                  .filter(event => event.date > new Date())
                  .slice(0, 3)
                  .map(event => (
                    <div key={event.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/40 transition-colors">
                      <div>
                        <h4 className="text-white">{event.title}</h4>
                        <div className="text-sm text-gray-400">
                          {event.date.toLocaleDateString()} • {event.startTime} - {event.endTime}
                        </div>
                      </div>
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
