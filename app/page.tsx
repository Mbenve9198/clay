"use client"

import { useState } from "react"
import { SmartTable, type SmartColumn, type SmartTableItem } from "@/components/smart-table/smart-table"
import CSVImporter from "@/components/CSVImporter"
import { TableManager, type Table } from "@/components/TableManager"
import { v4 as uuidv4 } from 'uuid'

// Colonne di default per le nuove tabelle
const defaultColumns: SmartColumn[] = [
  {
    id: "name",
    type: "text",
    header: "Company Name",
    accessorKey: "name",
    size: 180,
  },
  {
    id: "website",
    type: "text",
    header: "Website",
    accessorKey: "website",
    size: 220,
  },
  {
    id: "email",
    type: "text",
    header: "Email",
    accessorKey: "email",
    size: 220,
  },
  {
    id: "reviews",
    type: "reviews",
    header: "Reviews",
    accessorKey: "reviews",
    size: 180,
  },
  {
    id: "websiteContent",
    type: "website-content",
    header: "Website Content",
    accessorKey: "websiteContent",
    size: 180,
  },
  {
    id: "aiEmail",
    type: "ai-email",
    header: "AI Email",
    accessorKey: "aiEmail",
    size: 180,
  },
]

export default function Home() {
  const [tables, setTables] = useState<Table[]>([])
  const [currentTable, setCurrentTable] = useState<Table | null>(null)

  const handleCreateTable = (name: string) => {
    const newTable: Table = {
      id: uuidv4(),
      name,
      data: [],
      columns: defaultColumns,
    }
    setTables([...tables, newTable])
    setCurrentTable(newTable)
  }

  const handleTableSelect = (table: Table) => {
    setCurrentTable(table)
  }

  const handleTableDuplicate = (table: Table) => {
    const duplicatedTable: Table = {
      id: uuidv4(),
      name: `${table.name} (copia)`,
      data: [...table.data],
      columns: [...table.columns],
    }
    setTables([...tables, duplicatedTable])
    setCurrentTable(duplicatedTable)
  }

  const handleDataImported = (csvData: any[]) => {
    if (!Array.isArray(csvData)) {
      console.error('I dati importati non sono un array valido')
      return
    }

    if (!currentTable) {
      console.error('Nessuna tabella selezionata')
      return
    }

    // Converti i dati CSV nel formato della tabella
    const newData = csvData.map((item, index) => {
      if (typeof item !== 'object' || item === null) {
        return {
          id: uuidv4(),
          name: '',
          website: '',
          email: '',
          reviews: [],
          websiteContent: '',
          aiEmail: '',
        }
      }

      return {
        id: uuidv4(),
        name: item.name || item.Name || item.NAME || '',
        website: item.website || item.Website || item.WEBSITE || '',
        email: item.email || item.Email || item.EMAIL || '',
        reviews: Array.isArray(item.reviews) ? item.reviews : [],
        websiteContent: typeof item.websiteContent === 'string' ? item.websiteContent : '',
        aiEmail: typeof item.aiEmail === 'string' ? item.aiEmail : '',
      }
    })

    const updatedTable = {
      ...currentTable,
      data: [...currentTable.data, ...newData],
    }

    setTables(tables.map(t => t.id === currentTable.id ? updatedTable : t))
    setCurrentTable(updatedTable)
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Data Enrichment Platform</h1>
          <p className="text-muted-foreground">
            Enrich your data with website content, reviews, and AI-generated emails.
          </p>
        </div>

        <TableManager
          tables={tables}
          onTableSelect={handleTableSelect}
          onTableCreate={handleCreateTable}
          onTableDuplicate={handleTableDuplicate}
        />

        {currentTable && (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Importa Dati CSV</h2>
              <CSVImporter onDataImported={handleDataImported} />
            </div>

            <SmartTable
              initialData={currentTable.data}
              initialColumns={currentTable.columns}
              onDataChange={(newData) => {
                const updatedTable = {
                  ...currentTable,
                  data: newData,
                }
                setTables(tables.map(t => t.id === currentTable.id ? updatedTable : t))
                setCurrentTable(updatedTable)
              }}
              onColumnsChange={(newColumns) => {
                const updatedTable = {
                  ...currentTable,
                  columns: newColumns,
                }
                setTables(tables.map(t => t.id === currentTable.id ? updatedTable : t))
                setCurrentTable(updatedTable)
              }}
            />
          </>
        )}
      </div>
    </main>
  )
}
