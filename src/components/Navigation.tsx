
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
      title: 'Report a Crime',
      icon: FileText,
      items: [
        { title: 'New Report', href: '/report', icon: FileText },
        { title: 'Anonymous Reporting', href: '/report?anonymous=true', icon: Shield },
      ]
    },
    {
      title: 'Emergency Assistance',
      icon: AlertTriangle,
      items: [
        { title: 'Hotline Numbers', href: '/emergency-contacts', icon: Phone },
        { title: 'Request Immediate Help', href: '/emergency-help', icon: MapPin },
      ]
    },
    {
      title: 'Guidelines',
      icon: Shield,
      items: [
        { title: 'How to Report', href: '/how-to-report', icon: FileText },
        { title: 'What to Report', href: '/what-to-report', icon: AlertTriangle },
      ]
    },
    {
      title: 'Contact & Feedback',
      icon: MessageSquare,
      items: [
        { title: 'Feedback', href: '/feedback', icon: MessageSquare },
        { title: 'Contact Defense HQ', href: '/contact', icon: Phone },
      ]
    },
    {
      title: 'Safety Resources',
      icon: Download,
      items: [
        { title: 'Downloads', href: '/downloads', icon: Download },
      ]
    },
    {
      title: 'FAQs',
      icon: HelpCircle,
      href: '/faqs'
    }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-green-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/0300e6fb-5eb3-4bee-9542-d2935a35734c.png" 
              alt="Defence Headquarters Logo" 
              className="h-10 w-10 object-contain"
            />
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-green-800">Defence Headquarters</h1>
              <p className="text-xs text-green-600">Crime Reporting Portal</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              item.items ? (
                <DropdownMenu key={item.title}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-green-700 hover:text-green-800 hover:bg-green-50">
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.title}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {item.items.map((subItem) => (
                      <DropdownMenuItem key={subItem.title} asChild>
                        <Link to={subItem.href} className="flex items-center">
                          <subItem.icon className="h-4 w-4 mr-2" />
                          {subItem.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button key={item.title} variant="ghost" asChild className="text-green-700 hover:text-green-800 hover:bg-green-50">
                  <Link to={item.href!}>
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.title}
                  </Link>
                </Button>
              )
            ))}
          </div>

          {/* Emergency Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="hidden md:flex border-red-600 text-red-600 hover:bg-red-50">
              <Phone className="mr-2 h-4 w-4" />
              Emergency: 199
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
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
