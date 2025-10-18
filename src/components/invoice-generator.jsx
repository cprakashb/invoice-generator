"use client"

import { InvoiceForm } from "./invoice-form"
import { FileText } from "lucide-react"

export function InvoiceGenerator() {

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">Invoice Generator</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Create professional invoices and export to PDF
        </p>
      </header>

      <div>
          <InvoiceForm />
      </div>
    </div>
  )
}
