import React, { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { RepeatersProvider } from '@/contexts/RepeatersContext';
import { Repeater } from '@/types';
import Header from '@/components/Header';
import HomePage from '@/components/HomePage';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import AddRepeaterForm from '@/components/AddRepeaterForm';

const queryClient = new QueryClient();

const App = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [editingRepeater, setEditingRepeater] = useState<Repeater | null>(null);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return <LoginForm setCurrentView={setCurrentView} />;
      case 'register':
        return <RegisterForm setCurrentView={setCurrentView} />;
      case 'add-repeater':
        return (
          <AddRepeaterForm 
            setCurrentView={setCurrentView} 
            editingRepeater={editingRepeater}
          />
        );
      case 'home':
      default:
        return (
          <>
            <Header currentView={currentView} setCurrentView={setCurrentView} />
            <HomePage 
              setCurrentView={setCurrentView} 
              setEditingRepeater={setEditingRepeater}
            />
          </>
        );
    }
  };

  // Reset editing repeater when view changes
  React.useEffect(() => {
    if (currentView !== 'add-repeater') {
      setEditingRepeater(null);
    }
  }, [currentView]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <RepeatersProvider>
            <div className="min-h-screen bg-white font-sans">
              <Toaster />
              {renderCurrentView()}
            </div>
          </RepeatersProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;