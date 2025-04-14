import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Copy } from 'lucide-react';
import { SmartColumn, SmartTableItem } from "./smart-table/smart-table"

export interface Table {
  id: string;
  name: string;
  data: any[];
  columns: any[];
}

interface TableManagerProps {
  tables: Table[];
  currentTable: Table | null;
  onTableSelect: (table: Table) => void;
  onTableCreate: (table: Table) => void;
  onTableDuplicate: (table: Table) => void;
}

export function TableManager({
  tables,
  currentTable,
  onTableSelect,
  onTableCreate,
  onTableDuplicate,
}: TableManagerProps) {
  const [newTableName, setNewTableName] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateTable = () => {
    if (!newTableName.trim()) return;

    const newTable: Table = {
      id: crypto.randomUUID(),
      name: newTableName,
      data: [],
      columns: [
        { id: 'name', name: 'Nome' },
        { id: 'email', name: 'Email' },
        { id: 'phone', name: 'Telefono' },
      ],
    };

    onTableCreate(newTable);
    setNewTableName('');
    setIsCreateDialogOpen(false);
  };

  const handleDuplicateTable = (table: Table) => {
    const duplicatedTable: Table = {
      ...table,
      id: crypto.randomUUID(),
      name: `${table.name} (Copia)`,
    };
    onTableDuplicate(duplicatedTable);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tabelle</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Nuova Tabella
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crea Nuova Tabella</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Nome tabella"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateTable();
                  }
                }}
              />
              <Button onClick={handleCreateTable} className="w-full">
                Crea
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
              currentTable?.id === table.id ? 'bg-accent' : 'hover:bg-accent/50'
            }`}
          >
            <div
              className="flex-1"
              onClick={() => onTableSelect(table)}
            >
              {table.name}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDuplicateTable(table)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 