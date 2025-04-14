import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SmartColumn, SmartTableItem } from "./smart-table/smart-table"

interface TableManagerProps {
  tables: Table[]
  onTableSelect: (table: Table) => void
  onTableCreate: (name: string) => void
  onTableDuplicate: (table: Table) => void
}

export interface Table {
  id: string
  name: string
  data: SmartTableItem[]
  columns: SmartColumn[]
}

export function TableManager({ tables, onTableSelect, onTableCreate, onTableDuplicate }: TableManagerProps) {
  const [newTableName, setNewTableName] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleCreateTable = () => {
    if (newTableName.trim()) {
      onTableCreate(newTableName.trim())
      setNewTableName("")
      setIsCreateDialogOpen(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gestione Tabelle</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Nuova Tabella</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crea Nuova Tabella</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nome tabella"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
              />
              <Button onClick={handleCreateTable}>Crea</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <div key={table.id} className="border rounded-lg p-4 space-y-2">
            <h3 className="font-medium">{table.name}</h3>
            <p className="text-sm text-muted-foreground">
              {table.data.length} righe, {table.columns.length} colonne
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onTableSelect(table)}>
                Seleziona
              </Button>
              <Button variant="outline" size="sm" onClick={() => onTableDuplicate(table)}>
                Duplica
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 