import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const { currentUser, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-black text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <i className="fas fa-broadcast-tower text-green-500 text-2xl"></i>
          <h1 className="text-xl font-bold">Monitor de Repetidoras</h1>
        </div>
        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <button
                onClick={() => setCurrentView('home')}
                className={`hover:text-green-400 transition ${currentView === 'home' ? 'text-green-400' : ''}`}
              >
                Início
              </button>
            </li>
            {!isAuthenticated && (
              <>
                <li>
                  <button
                    onClick={() => setCurrentView('login')}
                    className={`hover:text-green-400 transition ${currentView === 'login' ? 'text-green-400' : ''}`}
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView('register')}
                    className={`hover:text-green-400 transition ${currentView === 'register' ? 'text-green-400' : ''}`}
                  >
                    Cadastrar
                  </button>
                </li>
              </>
            )}
            {isAuthenticated && (
              <>
                <li>
                  <button
                    onClick={() => setCurrentView('add-repeater')}
                    className={`hover:text-green-400 transition ${currentView === 'add-repeater' ? 'text-green-400' : ''}`}
                  >
                    Adicionar Repetidora
                  </button>
                </li>
                <li>
                  <span className="text-green-400">
                    Olá, {currentUser?.name} ({currentUser?.indicative})
                  </span>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                      setCurrentView('home');
                    }}
                    className="hover:text-green-400 transition"
                  >
                    Sair
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;