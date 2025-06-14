
import React, { useState } from 'react';
import CommanderLoginForm from '../components/CommanderLoginForm';
import CommanderDashboard from '../components/CommanderDashboard';

const CommanderPortal = () => {
  const [currentCommander, setCurrentCommander] = useState<any>(null);

  const handleLoginSuccess = (commander: any) => {
    setCurrentCommander(commander);
  };

  const handleLogout = () => {
    setCurrentCommander(null);
  };

  if (currentCommander) {
    return <CommanderDashboard commander={currentCommander} onLogout={handleLogout} />;
  }

  return <CommanderLoginForm onLoginSuccess={handleLoginSuccess} />;
};

export default CommanderPortal;
