import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface LoginFormProps {
  setCurrentView: (view: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ setCurrentView }) => {
  const [indicative, setIndicative] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!indicative.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API delay
    setTimeout(async () => {
      const success = await login(indicative.trim().toUpperCase(), password);
      
      if (success) {
        setCurrentView('home');
      } else {
        setError('Indicativo ou senha inválidos');
      }
      
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Faça login com seu indicativo e senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="indicative">Indicativo de Chamada</Label>
              <Input
                id="indicative"
                type="text"
                value={indicative}
                onChange={(e) => setIndicative(e.target.value)}
                placeholder="Ex: PY2ABC"
                maxLength={6}
                className="uppercase"
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                disabled={loading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">Não tem uma conta? </span>
            <button
              onClick={() => setCurrentView('register')}
              className="text-sm text-green-600 hover:text-green-500"
              disabled={loading}
            >
              Cadastre-se aqui
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;