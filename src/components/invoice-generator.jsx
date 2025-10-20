"use client"

import { useState, useEffect } from "react"
import { InvoiceForm } from "./invoice-form"
import { Dialog, Button, Flex, Text, Box, Heading } from "@radix-ui/themes"
import { FileText, Download, Save } from "lucide-react"
import { InvoicePreview } from "./invoice-preview"

const STORAGE_KEYS = {
  INVOICE_DATA: "invoice_generator_data",
  DEFAULT_LINE_ITEMS: "invoice_default_line_items",
  FIRST_TIME_POPUP_SHOWN: "invoice_first_time_popup_shown",
}

export function InvoiceGenerator() {
  const [showFirstTimePopup, setShowFirstTimePopup] = useState(false)

  const [invoiceData, setInvoiceData] = useState({
    invoiceHeading: "Employee Monthly Expenses Sheet",
    showInvoiceHeading: true,
    companyName: "",
    companyLogo: "",
    showCompanyInPDF: false,
    showInvoiceNumber: true,
    project: {
      name: "",
      address: "",
      city: "",
      province: "",
      country: "Canada",
    },
    from: {
      name: "",
      address: "",
      city: "",
      province: "",
      country: "Canada",
      phone: "",
      email: "",
    },
    to: {
      name: "",
      address: "",
      city: "",
      province: "",
      country: "Canada",
      phone: "",
      email: "",
    },
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    lineItems: [
      {
        id: "initial",
        itemName: "",
        date: "",
        price: 0,
      },
    ],
    columns: [
      { id: "serialNumber", label: "S.No", enabled: true, type: "auto" },
      { id: "itemName", label: "Item Name", enabled: true, type: "text" },
      { id: "date", label: "Date", enabled: true, type: "date" },
      { id: "price", label: "Price", enabled: true, type: "number" },
    ],
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentDate = new Date().toISOString().split("T")[0]

      const savedData = localStorage.getItem(STORAGE_KEYS.INVOICE_DATA)

      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          setInvoiceData(parsed)
        } catch (e) {
          console.error("Failed to load saved invoice data:", e)
        }
      } else {
        setInvoiceData((prev) => ({
          ...prev,
          invoiceDate: currentDate,
          lineItems: prev.lineItems.map((item) => ({
            ...item,
            date: currentDate,
            id: Date.now().toString(),
          })),
        }))
      }
    }
  }, [])

  const handleSaveInvoice = () => {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(STORAGE_KEYS.INVOICE_DATA, JSON.stringify(invoiceData))

      setShowFirstTimePopup(true)
    } catch (e) {
      console.error("Failed to save invoice:", e)
      alert("Failed to save invoice")
    }
  }


  return (
    <Box className="container mx-auto py-8 px-4 max-w-7xl">
      <Box mb="8">
        <Flex align="center" gap="3" mb="2">
          <FileText className="h-8 w-8" style={{ color: "var(--accent-9)" }} />
          <Heading size="8">Invoice Generator</Heading>
        </Flex>
        <Text size="4" color="gray">
          Create professional invoices with customizable fields and export to PDF
        </Text>
      </Box>

      <div className="grid lg:grid-cols-2 gap-8">
        <Box>
          <Flex gap="2" mb="6">
            <Button onClick={handleSaveInvoice} variant="soft" style={{ flex: 1 }}>
              <Save className="h-4 w-4" />
              Save Invoice
            </Button>
          </Flex>

          <InvoiceForm invoiceData={invoiceData} setInvoiceData={setInvoiceData} />
        </Box>

        <Box>
          <Flex align="center" justify="between" mb="6">
            <Heading size="6">Preview</Heading>
            <Button>
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </Flex>
          <InvoicePreview invoiceData={invoiceData} />
        </Box>
      </div>

      <Dialog.Root open={showFirstTimePopup} onOpenChange={setShowFirstTimePopup}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Invoice Saved Locally</Dialog.Title>

          <div className="space-y-3 mt-4 mb-4">
            <Text as="div" size="2">
              Your invoice has been saved successfully to your browser's local storage.
            </Text>
            <Text as="div" size="2" weight="medium">
              Important: Your data is stored locally on your device only. We do not save any information to our servers
              or database.
            </Text>
            <Text as="div" size="2">
              Your invoice will be automatically loaded when you return to this page.
            </Text>
          </div>

          <Flex gap="3" justify="end">
            <Dialog.Close>
              <Button>Got it!</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  )
}
