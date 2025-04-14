"use client"

import { useState } from "react"
import { SmartTable, type SmartColumn, type SmartTableItem } from "@/components/smart-table/smart-table"
import CSVImporter from "@/components/CSVImporter"

// Sample initial data
const initialData: SmartTableItem[] = [
  {
    id: "1",
    name: "Acme Inc",
    website: "https://acme.com",
    email: "contact@acme.com",
    reviews: [],
    websiteContent: "",
    aiEmail: "",
  },
  {
    id: "2",
    name: "Globex Corp",
    website: "https://globex.com",
    email: "info@globex.com",
    reviews: [],
    websiteContent: "",
    aiEmail: "",
  },
]

// Sample initial columns
const initialColumns: SmartColumn[] = [
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
  const [data, setData] = useState<SmartTableItem[]>(initialData)
  const [columns, setColumns] = useState<SmartColumn[]>(initialColumns)

  const handleDataImported = (csvData: any[]) => {
    // Converti i dati CSV nel formato della tabella
    const newData = csvData.map((item, index) => ({
      id: (data.length + index + 1).toString(),
      name: item.name || item.Name || item.NAME || "",
      website: item.website || item.Website || item.WEBSITE || "",
      email: item.email || item.Email || item.EMAIL || "",
      reviews: [],
      websiteContent: "",
      aiEmail: "",
    }))
    
    // Aggiorna i dati della tabella
    setData([...data, ...newData])
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

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Importa Dati CSV</h2>
          <CSVImporter onDataImported={handleDataImported} />
        </div>

        <SmartTable 
          initialData={data} 
          initialColumns={columns} 
          onDataChange={setData} 
          onColumnsChange={setColumns} 
        />
      </div>
    </main>
  )
}
