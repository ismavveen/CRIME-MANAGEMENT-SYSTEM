// Update this page (the content is just a fallback if you fail to update the page)

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Report a Crime</h1>
          
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Link to="/report/what-to-report">
              <Button variant="outline" className="w-full h-24 text-lg">
                What to Report
              </Button>
            </Link>
            <Link to="/report/how-to-report">
              <Button variant="outline" className="w-full h-24 text-lg">
                How to Report
              </Button>
            </Link>
            <Link to="/report/emergency-contacts">
              <Button variant="outline" className="w-full h-24 text-lg">
                Emergency Contacts
              </Button>
            </Link>
            <Link to="/report/faqs">
              <Button variant="outline" className="w-full h-24 text-lg">
                FAQs
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <Link to="/report/submit">
              <Button className="w-full md:w-auto px-8 py-6 text-xl">
                Submit a Report
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-center text-muted-foreground">
            <p>If this is an emergency, please call your local emergency number immediately.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
