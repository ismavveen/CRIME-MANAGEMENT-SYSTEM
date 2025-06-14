
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  Phone, 
  FileText, 
  AlertTriangle, 
  Shield, 
  MessageSquare, 
  Download, 
  HelpCircle,
  ChevronDown,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      title: 'Report Crime',
      icon: FileText,
      items: [
        { title: 'New Report', href: '/report', icon: FileText },
        { title: 'Anonymous Report', href: '/report?anonymous=true', icon: Shield },
        { title: 'Track Report', href: '/track-report', icon: MapPin },
      ]
    },
    {
      title: 'Emergency',
      icon: AlertTriangle,
      items: [
        { title: 'Emergency Services', href: '/emergency', icon: AlertTriangle },
        { title: 'Hotline Numbers', href: '/emergency-contacts', icon: Phone },
      ]
    },
    {
      title: 'Guidelines',
      icon: Shield,
      items: [
        { title: 'Reporting Guidelines', href: '/guidelines', icon: Shield },
        { title: 'How to Report', href: '/how-to-report', icon: FileText },
        { title: 'What to Report', href: '/what-to-report', icon: AlertTriangle },
      ]
    },
    {
      title: 'Contact',
      icon: MessageSquare,
      items: [
        { title: 'Contact DHQ', href: '/contact', icon: MessageSquare },
        { title: 'Emergency Contacts', href: '/emergency-contacts', icon: Phone },
      ]
    },
    {
      title: 'Resources',
      icon: Download,
      items: [
        { title: 'Downloads & Resources', href: '/resources', icon: Download },
      ]
    },
    {
      title: 'FAQs',
      icon: HelpCircle,
      href: '/faqs'
    }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-green-200 relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <img 
              src="/lovable-uploads/0300e6fb-5eb3-4bee-9542-d2935a35734c.png" 
              alt="Defence Headquarters Logo" 
              className="h-10 w-10 object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-green-800">Defence HQ</h1>
              <p className="text-xs text-green-600">Crime Portal</p>
            </div>
          </Link>

          {/* Desktop Navigation - Compact */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center max-w-4xl">
            {navigationItems.map((item) => (
              item.items ? (
                <DropdownMenu key={item.title}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-800 hover:bg-green-50 px-3 py-2 text-sm">
                      <item.icon className="h-4 w-4 mr-1" />
                      {item.title}
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 z-50 bg-white">
                    {item.items.map((subItem) => (
                      <DropdownMenuItem key={subItem.title} asChild>
                        <Link to={subItem.href} className="flex items-center text-sm">
                          <subItem.icon className="h-4 w-4 mr-2" />
                          {subItem.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button key={item.title} variant="ghost" size="sm" asChild className="text-green-700 hover:text-green-800 hover:bg-green-50 px-3 py-2 text-sm">
                  <Link to={item.href!}>
                    <item.icon className="h-4 w-4 mr-1" />
                    {item.title}
                  </Link>
                </Button>
              )
            ))}
          </div>

          {/* Emergency Button & Mobile Menu */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button variant="outline" size="sm" className="hidden md:flex border-red-600 text-red-600 hover:bg-red-50 px-3 py-2 text-sm">
              <Phone className="mr-1 h-4 w-4" />
              199
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 z-50 bg-white">
                <div className="py-6">
                  <div className="space-y-4">
                    {navigationItems.map((item) => (
                      <div key={item.title} className="space-y-2">
                        {item.items ? (
                          <>
                            <div className="flex items-center text-green-800 font-medium">
                              <item.icon className="h-4 w-4 mr-2" />
                              {item.title}
                            </div>
                            <div className="ml-6 space-y-2">
                              {item.items.map((subItem) => (
                                <Link
                                  key={subItem.title}
                                  to={subItem.href}
                                  className="flex items-center text-green-600 hover:text-green-800 py-1"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  <subItem.icon className="h-4 w-4 mr-2" />
                                  {subItem.title}
                                </Link>
                              ))}
                            </div>
                          </>
                        ) : (
                          <Link
                            to={item.href!}
                            className="flex items-center text-green-700 hover:text-green-800 font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <item.icon className="h-4 w-4 mr-2" />
                            {item.title}
                          </Link>
                        )}
                      </div>
                    ))}
                    <div className="pt-4 border-t border-green-200">
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                        <Phone className="mr-2 h-4 w-4" />
                        Emergency: 199
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
