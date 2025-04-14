"use client"

import { useState } from "react"
import { SmartTable, type SmartColumn, type SmartTableItem } from "@/components/smart-table/smart-table"

// Sample initial data
const initialData: SmartTableItem[] = [
  {
    id: "1",
    name: "Acme Corporation",
    email: "contact@acmecorp.com",
    website: "https://acmecorp.com",
    location: "New York, USA",
    status: "Active",
  },
  {
    id: "2",
    name: "TechGiant Inc.",
    email: "info@techgiant.com",
    website: "https://techgiant.com",
    location: "San Francisco, USA",
    status: "Active",
  },
  {
    id: "3",
    name: "Global Solutions Ltd.",
    email: "hello@globalsolutions.com",
    website: "https://globalsolutions.com",
    location: "London, UK",
    status: "Inactive",
  },
  {
    id: "4",
    name: "Innovative Designs",
    email: "contact@innovativedesigns.com",
    website: "https://innovativedesigns.com",
    location: "Berlin, Germany",
    status: "Pending",
  },
  {
    id: "5",
    name: "Future Tech",
    email: "info@futuretech.io",
    website: "https://futuretech.io",
    location: "Tokyo, Japan",
    status: "Active",
  },
]

// Initial columns configuration
const initialColumns: SmartColumn[] = [
  {
    id: "name",
    type: "text",
    header: "Name",
    accessorKey: "name",
    size: 180,
  },
  {
    id: "email",
    type: "text",
    header: "Email",
    accessorKey: "email",
    size: 220,
  },
  {
    id: "website",
    type: "text",
    header: "Website",
    accessorKey: "website",
    size: 220,
  },
  {
    id: "location",
    type: "text",
    header: "Location",
    accessorKey: "location",
    size: 180,
  },
  {
    id: "status",
    type: "text",
    header: "Status",
    accessorKey: "status",
    size: 120,
  },
]

export default function Home() {
  const [data, setData] = useState<SmartTableItem[]>(initialData)
  const [columns, setColumns] = useState<SmartColumn[]>(initialColumns)

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Data Enrichment Platform</h1>
          <p className="text-muted-foreground">
            Enrich your data with website content, reviews, and AI-generated emails.
          </p>
        </div>

        <SmartTable initialData={data} initialColumns={columns} onDataChange={setData} onColumnsChange={setColumns} />
      </div>
    </main>
  )
}
