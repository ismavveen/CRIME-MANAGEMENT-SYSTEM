
import React from 'react';
import { Clock, CircleCheck, CircleArrowUp } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'alert' | 'update' | 'resolved';
  priority: 'high' | 'medium' | 'low';
}

const NewsLiveFeed = () => {
  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'Security Operation Successful',
      description: 'Counter-terrorism operation in Borno State completed successfully. 15 suspects apprehended.',
      timestamp: '2 hours ago',
      type: 'resolved',
      priority: 'high'
    },
    {
      id: '2', 
      title: 'Border Patrol Alert',
      description: 'Increased activity detected near Chad border. Additional units deployed for monitoring.',
      timestamp: '5 hours ago',
      type: 'alert',
      priority: 'high'
    },
    {
      id: '3',
      title: 'Civil Protection Update',
      description: 'Evacuation procedures updated for high-risk areas in Delta region.',
      timestamp: '7 hours ago',
      type: 'update',
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Training Exercise Complete',
      description: 'Joint military-police training exercise concluded in Lagos State.',
      timestamp: '1 day ago',
      type: 'resolved',
      priority: 'low'
    },
    {
      id: '5',
      title: 'Intelligence Report',
      description: 'New threat assessment completed for northern corridor routes.',
      timestamp: '2 days ago',
      type: 'update',
      priority: 'medium'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <CircleArrowUp className="text-dhq-red" size={16} />;
      case 'resolved':
        return <CircleCheck className="text-green-400" size={16} />;
      case 'update':
        return <Clock className="text-dhq-blue" size={16} />;
      default:
        return <Clock className="text-gray-400" size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'alert':
        return 'border-l-red-500';
      case 'resolved':
        return 'border-l-green-500';
      case 'update':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <div className="dhq-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Live Updates</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm">Live</span>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {newsItems.map((item) => (
          <div 
            key={item.id}
            className={`border-l-4 ${getTypeColor(item.type)} pl-4 py-3 hover:bg-gray-800/30 transition-colors rounded-r-lg`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getTypeIcon(item.type)}
                <h4 className="text-white font-semibold text-sm">{item.title}</h4>
              </div>
              <span className="text-gray-400 text-xs">{item.timestamp}</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
            <div className="flex items-center justify-between mt-3">
              <span className={`text-xs px-2 py-1 rounded-full ${
                item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {item.priority.toUpperCase()}
              </span>
              <button className="text-dhq-blue hover:text-blue-400 text-xs">
                Read more
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsLiveFeed;
