import React, { useState } from 'react';
import { useRepeaters } from '@/contexts/RepeatersContext';
import { Repeater } from '@/types';
import RepeatersMap from './RepeatersMap';
import RepeatersTable from './RepeatersTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HomePageProps {
  setCurrentView: (view: string) => void;
  setEditingRepeater: (repeater: Repeater | null) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentView, setEditingRepeater }) => {
  const [selectedRepeater, setSelectedRepeater] = useState<Repeater | null>(null);
  const { repeaters } = useRepeaters();

  const handleRepeaterSelect = (repeater: Repeater) => {
    setSelectedRepeater(repeater);
  };

  const handleEditRepeater = (repeater: Repeater) => {
    setEditingRepeater(repeater);
    setCurrentView('add-repeater');
  };

  const activeRepeaters = repeaters.filter(r => r.status === 'Ativa').length;
  const inactiveRepeaters = repeaters.filter(r => r.status === 'Inativa').length;
  const maintenanceRepeaters = repeaters.filter(r => r.status === 'Manutenção').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Monitor de Repetidoras
          </h1>
          <p className="text-xl mb-8">
            Sistema de monitoramento de repetidoras de radioamadorismo do Brasil
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold">{repeaters.length}</div>
              <div className="text-sm">Total de Repetidoras</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold text-green-300">{activeRepeaters}</div>
              <div className="text-sm">Ativas</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold text-red-300">{inactiveRepeaters}</div>
              <div className="text-sm">Inativas</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold text-yellow-300">{maintenanceRepeaters}</div>
              <div className="text-sm">Em Manutenção</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="map" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map">
              <i className="fas fa-map-marker-alt mr-2"></i>
              Mapa
            </TabsTrigger>
            <TabsTrigger value="list">
              <i className="fas fa-list mr-2"></i>
              Lista
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-6">
            <RepeatersMap
              repeaters={repeaters}
              selectedRepeater={selectedRepeater}
              onRepeaterSelect={handleRepeaterSelect}
            />
            
            {selectedRepeater && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Detalhes da Repetidora</span>
                    <button
                      onClick={() => setSelectedRepeater(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{selectedRepeater.callsign}</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Frequência:</strong> {selectedRepeater.frequency} MHz</p>
                        <p><strong>Offset:</strong> {selectedRepeater.offset} MHz</p>
                        <p><strong>CTCSS:</strong> {selectedRepeater.ctcss} Hz</p>
                        <p><strong>Potência:</strong> {selectedRepeater.power}</p>
                        <p><strong>Cobertura:</strong> {selectedRepeater.coverage}</p>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-2 text-sm">
                        <p><strong>Local:</strong> {selectedRepeater.location}</p>
                        <p><strong>Coordenadas:</strong> {selectedRepeater.latitude.toFixed(4)}, {selectedRepeater.longitude.toFixed(4)}</p>
                        <p><strong>Status:</strong> 
                          <span className={`ml-2 px-2 py-1 rounded text-white text-xs ${
                            selectedRepeater.status === 'Ativa' ? 'bg-green-500' :
                            selectedRepeater.status === 'Inativa' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}>
                            {selectedRepeater.status}
                          </span>
                        </p>
                        <p><strong>Proprietário:</strong> {selectedRepeater.owner}</p>
                        <p><strong>Criado por:</strong> {selectedRepeater.createdBy}</p>
                        <p><strong>Data de criação:</strong> {new Date(selectedRepeater.createdAt).toLocaleString('pt-BR')}</p>
                        <p><strong>Última alteração:</strong> {selectedRepeater.lastModifiedBy} em {new Date(selectedRepeater.updatedAt).toLocaleString('pt-BR')}</p>
                        {selectedRepeater.notes && (
                          <p><strong>Observações:</strong> {selectedRepeater.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="list">
            <RepeatersTable
              onRepeaterSelect={handleRepeaterSelect}
              onEditRepeater={handleEditRepeater}
            />
          </TabsContent>
        </Tabs>

        {/* About Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Sobre o Sistema</CardTitle>
              <CardDescription>
                Informações sobre o Monitor de Repetidoras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-3">
                    <i className="fas fa-info-circle text-blue-500 mr-2"></i>
                    O que são Repetidoras?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Repetidoras são estações de radioamadorismo que recebem sinais em uma frequência 
                    e os retransmitem em outra, ampliando significativamente o alcance das comunicações 
                    entre radioamadores. Elas operam geralmente em VHF e UHF, permitindo comunicação 
                    local e regional.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">
                    <i className="fas fa-users text-green-500 mr-2"></i>
                    Como Usar este Sistema
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Este sistema permite que radioamadores cadastrem e monitorem repetidoras em todo 
                    o Brasil. Após fazer login com seu indicativo de chamada, você pode adicionar 
                    novas repetidoras, visualizá-las no mapa interativo e manter as informações 
                    sempre atualizadas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;