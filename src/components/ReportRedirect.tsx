
import { useEffect } from 'react';

const ReportRedirect = () => {
  useEffect(() => {
    // Redirect to the external report portal
    window.location.href = 'https://report-crime.lovable.app';
  }, []);

  return (
    <div className="min-h-screen bg-dhq-dark-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Redirecting to Crime Reporting Portal...</p>
        <p className="text-gray-400 text-sm mt-2">If you are not redirected automatically, 
          <a href="https://report-crime.lovable.app" className="text-blue-400 hover:text-blue-300 underline ml-1">
            click here
          </a>
        </p>
      </div>
    </div>
  );
};

export default ReportRedirect;
