import React, { useState } from 'react';
import { useRepeaters } from '@/contexts/RepeatersContext';
import { useAuth } from '@/contexts/AuthContext';
import { Repeater } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface AddRepeaterFormProps {
  setCurrentView: (view: string) => void;
  editingRepeater?: Repeater | null;
}

const AddRepeaterForm: React.FC<AddRepeaterFormProps> = ({ 
  setCurrentView, 
  editingRepeater 
}) => {
  const [formData, setFormData] = useState({
    callsign: editingRepeater?.callsign || '',
    frequency: editingRepeater?.frequency || '',
    offset: editingRepeater?.offset || '',
    ctcss: editingRepeater?.ctcss || '',
    location: editingRepeater?.location || '',
    latitude: editingRepeater?.latitude?.toString() || '',
    longitude: editingRepeater?.longitude?.toString() || '',
    power: editingRepeater?.power || '',
    coverage: editingRepeater?.coverage || '',
    status: editingRepeater?.status || 'Ativa',
    notes: editingRepeater?.notes || ''
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { addRepeater, updateRepeater } = useRepeaters();
  const { currentUser } = useAuth();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.callsign.trim()) {
      newErrors.callsign = 'Indicativo é obrigatório';
    }

    if (!formData.frequency.trim()) {
      newErrors.frequency = 'Frequência é obrigatória';
    } else if (isNaN(Number(formData.frequency))) {
      newErrors.frequency = 'Frequência deve ser um número';
    }

    if (!formData.offset.trim()) {
      newErrors.offset = 'Offset é obrigatório';
    }

    if (!formData.ctcss.trim()) {
      newErrors.ctcss = 'CTCSS é obrigatório';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Localização é obrigatória';
    }

    // Latitude e longitude são opcionais
    if (formData.latitude.trim() && isNaN(Number(formData.latitude))) {
      newErrors.latitude = 'Latitude deve ser um número';
    }

    if (formData.longitude.trim() && isNaN(Number(formData.longitude))) {
      newErrors.longitude = 'Longitude deve ser um número';
    }

    // Potência e cobertura são opcionais

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const repeaterData = {
        callsign: formData.callsign.trim().toUpperCase(),
        frequency: formData.frequency.trim(),
        offset: formData.offset.trim(),
        ctcss: formData.ctcss.trim(),
        location: formData.location.trim(),
        latitude: formData.latitude.trim() ? Number(formData.latitude) : 0,
        longitude: formData.longitude.trim() ? Number(formData.longitude) : 0,
        power: formData.power.trim(),
        coverage: formData.coverage.trim(),
        status: formData.status as 'Ativa' | 'Inativa' | 'Manutenção',
        owner: currentUser?.indicative || '',
        notes: formData.notes.trim()
      };

      if (editingRepeater) {
        updateRepeater(editingRepeater.id, repeaterData);
      } else {
        addRepeater(repeaterData);
      }

      setSuccess(true);
      setTimeout(() => {
        setCurrentView('home');
      }, 1500);

      setLoading(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert>
              <AlertDescription>
                {editingRepeater ? 'Repetidora atualizada' : 'Repetidora cadastrada'} com sucesso! Redirecionando...
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {editingRepeater ? 'Editar Repetidora' : 'Adicionar Nova Repetidora'}
            </CardTitle>
            <CardDescription className="text-center">
              Preencha os dados da repetidora
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="callsign">Indicativo/Nome</Label>
                  <Input
                    id="callsign"
                    type="text"
                    value={formData.callsign}
                    onChange={(e) => handleInputChange('callsign', e.target.value.toUpperCase())}
                    placeholder="Ex: PY2ABC/REPETIDORA SP"
                    className={errors.callsign ? 'border-red-500' : ''}
                    disabled={loading}
                  />
                  {errors.callsign && <p className="text-red-500 text-sm mt-1">{errors.callsign}</p>}
                </div>

                <div>
                  <Label htmlFor="frequency">Frequência (MHz)</Label>
                  <Input
                    id="frequency"
                    type="text"
                    value={formData.frequency}
                    onChange={(e) => handleInputChange('frequency', e.target.value)}
                    placeholder="Ex: 145.750"
                    className={errors.frequency ? 'border-red-500' : ''}
                    disabled={loading}
                  />
                  {errors.frequency && <p className="text-red-500 text-sm mt-1">{errors.frequency}</p>}
                </div>

                <div>
                  <Label htmlFor="offset">Offset (MHz)</Label>
                  <Input
                    id="offset"
                    type="text"
                    value={formData.offset}
                    onChange={(e) => handleInputChange('offset', e.target.value)}
                    placeholder="Ex: -0.600"
                    className={errors.offset ? 'border-red-500' : ''}
                    disabled={loading}
                  />
                  {errors.offset && <p className="text-red-500 text-sm mt-1">{errors.offset}</p>}
                </div>

                <div>
                  <Label htmlFor="ctcss">CTCSS (Hz)</Label>
                  <Select value={formData.ctcss} onValueChange={(value) => handleInputChange('ctcss', value)}>
                    <SelectTrigger className={errors.ctcss ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o CTCSS" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NÃO TEM">NÃO TEM</SelectItem>
                      <SelectItem value="67.0">67.0</SelectItem>
                      <SelectItem value="71.9">71.9</SelectItem>
                      <SelectItem value="74.4">74.4</SelectItem>
                      <SelectItem value="77.0">77.0</SelectItem>
                      <SelectItem value="79.7">79.7</SelectItem>
                      <SelectItem value="82.5">82.5</SelectItem>
                      <SelectItem value="85.4">85.4</SelectItem>
                      <SelectItem value="88.5">88.5</SelectItem>
                      <SelectItem value="91.5">91.5</SelectItem>
                      <SelectItem value="94.8">94.8</SelectItem>
                      <SelectItem value="97.4">97.4</SelectItem>
                      <SelectItem value="100.0">100.0</SelectItem>
                      <SelectItem value="103.5">103.5</SelectItem>
                      <SelectItem value="107.2">107.2</SelectItem>
                      <SelectItem value="110.9">110.9</SelectItem>
                      <SelectItem value="114.8">114.8</SelectItem>
                      <SelectItem value="118.8">118.8</SelectItem>
                      <SelectItem value="123.0">123.0</SelectItem>
                      <SelectItem value="127.3">127.3</SelectItem>
                      <SelectItem value="131.8">131.8</SelectItem>
                      <SelectItem value="136.5">136.5</SelectItem>
                      <SelectItem value="141.3">141.3</SelectItem>
                      <SelectItem value="146.2">146.2</SelectItem>
                      <SelectItem value="151.4">151.4</SelectItem>
                      <SelectItem value="156.7">156.7</SelectItem>
                      <SelectItem value="162.2">162.2</SelectItem>
                      <SelectItem value="167.9">167.9</SelectItem>
                      <SelectItem value="173.8">173.8</SelectItem>
                      <SelectItem value="179.9">179.9</SelectItem>
                      <SelectItem value="186.2">186.2</SelectItem>
                      <SelectItem value="192.8">192.8</SelectItem>
                      <SelectItem value="203.5">203.5</SelectItem>
                      <SelectItem value="210.7">210.7</SelectItem>
                      <SelectItem value="218.1">218.1</SelectItem>
                      <SelectItem value="225.7">225.7</SelectItem>
                      <SelectItem value="233.6">233.6</SelectItem>
                      <SelectItem value="241.8">241.8</SelectItem>
                      <SelectItem value="250.3">250.3</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.ctcss && <p className="text-red-500 text-sm mt-1">{errors.ctcss}</p>}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Ex: São Paulo, SP"
                    className={errors.location ? 'border-red-500' : ''}
                    disabled={loading}
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                <div>
                  <Label htmlFor="latitude">Latitude (opcional)</Label>
                  <Input
                    id="latitude"
                    type="text"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    placeholder="Ex: -23.5505"
                    className={errors.latitude ? 'border-red-500' : ''}
                    disabled={loading}
                  />
                  {errors.latitude && <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>}
                </div>

                <div>
                  <Label htmlFor="longitude">Longitude (opcional)</Label>
                  <Input
                    id="longitude"
                    type="text"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                    placeholder="Ex: -46.6333"
                    className={errors.longitude ? 'border-red-500' : ''}
                    disabled={loading}
                  />
                  {errors.longitude && <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>}
                </div>

                <div>
                  <Label htmlFor="power">Potência (opcional)</Label>
                  <Input
                    id="power"
                    type="text"
                    value={formData.power}
                    onChange={(e) => handleInputChange('power', e.target.value)}
                    placeholder="Ex: 25W"
                    className={errors.power ? 'border-red-500' : ''}
                    disabled={loading}
                  />
                  {errors.power && <p className="text-red-500 text-sm mt-1">{errors.power}</p>}
                </div>

                <div>
                  <Label htmlFor="coverage">Cobertura (opcional)</Label>
                  <Input
                    id="coverage"
                    type="text"
                    value={formData.coverage}
                    onChange={(e) => handleInputChange('coverage', e.target.value)}
                    placeholder="Ex: 50km"
                    className={errors.coverage ? 'border-red-500' : ''}
                    disabled={loading}
                  />
                  {errors.coverage && <p className="text-red-500 text-sm mt-1">{errors.coverage}</p>}
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativa">Ativa</SelectItem>
                      <SelectItem value="Inativa">Inativa</SelectItem>
                      <SelectItem value="Manutenção">Manutenção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="notes">Observações (opcional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Informações adicionais sobre a repetidora..."
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentView('home')}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingRepeater ? 'Atualizando...' : 'Salvando...'}
                    </>
                  ) : (
                    editingRepeater ? 'Atualizar Repetidora' : 'Salvar Repetidora'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddRepeaterForm;