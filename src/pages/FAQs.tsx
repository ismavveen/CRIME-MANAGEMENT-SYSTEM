
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, Shield, Phone, FileText, Clock, Users } from 'lucide-react';
import Navigation from '@/components/Navigation';

const FAQs = () => {
  const faqCategories = [
    {
      title: "General Questions",
      icon: HelpCircle,
      faqs: [
        {
          question: "What is the Defence Headquarters Crime Reporting Portal?",
          answer: "This is a secure online platform where citizens can report crimes, suspicious activities, and security concerns directly to the Nigerian Armed Forces. It provides multiple reporting channels including web forms, hotlines, SMS, and email."
        },
        {
          question: "Who can use this portal?",
          answer: "Any citizen or resident of Nigeria can use this portal to report crimes or security concerns. The service is available 24/7 and supports both anonymous and identified reporting."
        },
        {
          question: "Is the service free to use?",
          answer: "Yes, all reporting services are completely free. There are no charges for submitting reports through any of our channels - web, phone, SMS, or email."
        }
      ]
    },
    {
      title: "Privacy & Security",
      icon: Shield,
      faqs: [
        {
          question: "Is my report anonymous?",
          answer: "Yes, you can choose to submit reports anonymously. When you select anonymous reporting, no personal information is collected or stored. Your identity remains completely protected."
        },
        {
          question: "How secure is my information?",
          answer: "All data is encrypted using military-grade security protocols. Your information is transmitted securely and stored on protected government servers. We follow strict data protection guidelines."
        },
        {
          question: "Will my identity be revealed to anyone?",
          answer: "If you choose anonymous reporting, your identity will never be revealed. For non-anonymous reports, your information is only shared with authorized security personnel on a need-to-know basis."
        },
        {
          question: "Can I delete my report after submission?",
          answer: "Once submitted, reports become part of official security records and cannot be deleted. However, you can contact us to update or clarify information in your report."
        }
      ]
    },
    {
      title: "Reporting Process",
      icon: FileText,
      faqs: [
        {
          question: "What types of incidents should I report?",
          answer: "Report any criminal activity including theft, assault, fraud, terrorism, drug trafficking, kidnapping, cybercrime, corruption, and any suspicious behavior that threatens public safety."
        },
        {
          question: "How detailed should my report be?",
          answer: "Provide as much detail as possible including date, time, location, description of what happened, people involved, and any evidence. More details help authorities respond more effectively."
        },
        {
          question: "Can I attach photos or videos to my report?",
          answer: "Yes, you can upload images, videos, audio recordings, and documents as evidence. Supported formats include JPG, PNG, MP4, MP3, PDF, and DOC files up to 10MB each."
        },
        {
          question: "What happens after I submit a report?",
          answer: "You'll receive a confirmation with a reference number. Your report is immediately reviewed by security analysts and forwarded to the appropriate response team based on priority and location."
        }
      ]
    },
    {
      title: "Emergency Situations",
      icon: Phone,
      faqs: [
        {
          question: "When should I call the emergency hotline instead of using the web form?",
          answer: "Call 199 immediately if you are in immediate danger, witnessing a crime in progress, or need urgent police/military response. Use the web form for non-urgent reports."
        },
        {
          question: "What if I'm in a situation where I can't speak on the phone?",
          answer: "You can send an SMS to 32123 with your location and 'EMERGENCY'. The web form also has an emergency option that alerts responders to your location if you enable location sharing."
        },
        {
          question: "How quickly do emergency responders arrive?",
          answer: "Response times vary by location and situation severity. Urban areas typically see responses within 5-15 minutes, while rural areas may take longer. Emergency calls are prioritized for fastest response."
        }
      ]
    },
    {
      title: "Follow-up & Updates",
      icon: Clock,
      faqs: [
        {
          question: "How can I check the status of my report?",
          answer: "Use your reference number on our status check page, or contact us via phone or email. For anonymous reports, the reference number is your only way to track progress."
        },
        {
          question: "Will I be contacted for additional information?",
          answer: "If you provided contact information and consented to follow-up, investigators may contact you for clarification or additional details. Anonymous reporters won't be contacted."
        },
        {
          question: "How long does it take to investigate a report?",
          answer: "Investigation timelines vary based on complexity and priority. Emergency situations get immediate attention, while other cases may take days to weeks for thorough investigation."
        },
        {
          question: "Can I provide additional information after submitting my report?",
          answer: "Yes, contact us with your reference number to provide additional information, evidence, or updates to your original report."
        }
      ]
    },
    {
      title: "Technical Support",
      icon: Users,
      faqs: [
        {
          question: "The website isn't working properly. What should I do?",
          answer: "Try refreshing the page or using a different browser. If problems persist, you can report via phone (199), SMS (32123), or email (reports@defencehq.gov.ng). Contact our technical support for assistance."
        },
        {
          question: "I'm having trouble uploading files. What file types are supported?",
          answer: "Supported formats: Images (JPG, PNG, GIF), Videos (MP4, AVI), Audio (MP3, WAV), Documents (PDF, DOC, DOCX). Maximum file size is 10MB per file, up to 5 files per report."
        },
        {
          question: "Can I use the portal on my mobile phone?",
          answer: "Yes, the portal is fully optimized for mobile devices. You can access all features including file uploads, location sharing, and form submission from your smartphone or tablet."
        },
        {
          question: "What if I don't have internet access?",
          answer: "You can report via phone (199), SMS (32123), or visit any military/police station in person. Internet access is not required for these alternative reporting methods."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <HelpCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-green-800 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-green-600 max-w-3xl mx-auto">
            Find answers to common questions about using the Defence Headquarters Crime Reporting Portal
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <Card key={category.title} className="border-green-200">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <category.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-800">{category.title}</h2>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem 
                      key={faqIndex} 
                      value={`${categoryIndex}-${faqIndex}`}
                      className="border-green-200"
                    >
                      <AccordionTrigger className="text-left text-green-800 hover:text-green-600">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-green-700 pt-2">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <Card className="max-w-4xl mx-auto mt-12 border-green-200 bg-green-50">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-green-800 mb-4">Still Have Questions?</h3>
            <p className="text-green-600 mb-6">
              If you can't find the answer you're looking for, don't hesitate to contact us directly.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Phone className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-green-800">Emergency Hotline</p>
                <p className="text-green-600">199</p>
              </div>
              <div className="text-center">
                <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-green-800">Email Support</p>
                <p className="text-green-600">reports@defencehq.gov.ng</p>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-green-800">SMS Reports</p>
                <p className="text-green-600">32123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQs;
