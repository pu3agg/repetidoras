import React, { useState } from 'react';
import { Repeater } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRepeaters } from '@/contexts/RepeatersContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Edit, Trash2, MapPin } from 'lucide-react';

interface RepeatersTableProps {
  onRepeaterSelect?: (repeater: Repeater) => void;
  onEditRepeater?: (repeater: Repeater) => void;
}

const RepeatersTable: React.FC<RepeatersTableProps> = ({ 
  onRepeaterSelect, 
  onEditRepeater 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { repeaters, searchRepeaters, deleteRepeater } = useRepeaters();
  const { currentUser, isAuthenticated } = useAuth();

  const filteredRepeaters = searchRepeaters(searchQuery);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Ativa':
        return 'default';
      case 'Inativa':
        return 'destructive';
      case 'Manutenção':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleDelete = (repeater: Repeater) => {
    if (window.confirm(`Tem certeza que deseja deletar a repetidora ${repeater.callsign}?`)) {
      deleteRepeater(repeater.id);
    }
  };

  const canEditOrDelete = () => {
    return isAuthenticated;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <i className="fas fa-list text-green-600"></i>
          Lista de Repetidoras
        </CardTitle>
        <CardDescription>
          {filteredRepeaters.length} repetidora{filteredRepeaters.length !== 1 ? 's' : ''} encontrada{filteredRepeaters.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar por indicativo, localização, frequência..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Indicativo</TableHead>
                <TableHead>Frequência</TableHead>
                <TableHead>Offset</TableHead>
                <TableHead>CTCSS</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Proprietário</TableHead>
                <TableHead>Última Alteração</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRepeaters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    {searchQuery ? 'Nenhuma repetidora encontrada' : 'Nenhuma repetidora cadastrada'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRepeaters.map((repeater) => (
                  <TableRow key={repeater.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{repeater.callsign}</TableCell>
                    <TableCell>{repeater.frequency} MHz</TableCell>
                    <TableCell>{repeater.offset} MHz</TableCell>
                    <TableCell>{repeater.ctcss} Hz</TableCell>
                    <TableCell>{repeater.location}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(repeater.status)}>
                        {repeater.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{repeater.owner}</TableCell>
                    <TableCell>
                      <div className="text-xs text-gray-500">
                        <div>{repeater.lastModifiedBy}</div>
                        <div>{new Date(repeater.updatedAt).toLocaleString('pt-BR')}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {onRepeaterSelect && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRepeaterSelect(repeater)}
                            title="Ver no mapa"
                          >
                            <MapPin className="h-4 w-4" />
                          </Button>
                        )}
                        {canEditOrDelete() && onEditRepeater && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditRepeater(repeater)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {canEditOrDelete() && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(repeater)}
                            title="Deletar"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RepeatersTable;