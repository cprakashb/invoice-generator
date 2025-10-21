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

    const handleGeneratePDF = async () => {
    try {
      const jsPDF = (await import("jspdf")).default

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pageWidth = 210
      const pageHeight = 297
      const margin = 20
      let yPos = margin

      const addText = (text, x, y, options = {}) => {
        pdf.setFontSize(options.fontSize || 10)
        pdf.setFont("helvetica", options.fontStyle || "normal")
        pdf.setTextColor(options.color || "#000000")
        pdf.text(text, x, y, options.align ? { align: options.align } : undefined)
      }

      if (invoiceData.showInvoiceHeading && invoiceData.invoiceHeading) {
        addText(invoiceData.invoiceHeading, margin, yPos, { fontSize: 16, fontStyle: "bold", color: "#1e40af" })
        yPos += 10
      }

      if (invoiceData.showCompanyInPDF && invoiceData.companyLogo) {
        try {
          pdf.addImage(invoiceData.companyLogo, "PNG", margin, yPos, 40, 20)
          yPos += 25
        } catch (e) {
          console.log("Could not add logo to PDF")
        }
      }

      if (invoiceData.showCompanyInPDF && invoiceData.companyName) {
        addText(invoiceData.companyName, margin, yPos, { fontSize: 14, fontStyle: "bold", color: "#000000" })
        yPos += 8
      }

      if (invoiceData.showInvoiceNumber && invoiceData.invoiceNumber) {
        addText(`Invoice #${invoiceData.invoiceNumber}`, margin, yPos, { fontSize: 10, color: "#71717a" })
        yPos += 10
      }

      addText(`Date: ${invoiceData.invoiceDate || "N/A"}`, pageWidth - margin, margin, {
        fontSize: 10,
        fontStyle: "bold",
        align: "right",
      })
      if (invoiceData.dueDate) {
        addText(`Due: ${invoiceData.dueDate}`, pageWidth - margin, margin + 5, {
          fontSize: 10,
          color: "#71717a",
          align: "right",
        })
      }

      if (invoiceData.project && invoiceData.project.name) {
        yPos += 5
        pdf.setFillColor(240, 240, 240)
        pdf.rect(margin, yPos - 5, pageWidth - 2 * margin, 25, "F")
        addText("PROJECT", margin + 5, yPos, { fontSize: 9, fontStyle: "bold", color: "#71717a" })
        yPos += 6
        addText(invoiceData.project.name, margin + 5, yPos, { fontSize: 11, fontStyle: "bold" })
        yPos += 5
        const projectAddress = [
          invoiceData.project.address,
          invoiceData.project.city,
          invoiceData.project.province,
          invoiceData.project.country,
        ]
          .filter(Boolean)
          .join(", ")
        if (projectAddress) {
          addText(projectAddress, margin + 5, yPos, { fontSize: 9, color: "#71717a" })
        }
        yPos += 15
      }

      const colWidth = (pageWidth - 2 * margin) / 2
      const col2X = margin + colWidth + 10

      addText("FROM", margin, yPos, { fontSize: 9, fontStyle: "bold", color: "#71717a" })
      yPos += 5
      addText(invoiceData.from.name || "Your Name", margin, yPos, { fontSize: 10, fontStyle: "bold" })
      yPos += 5
      const fromAddress = [
        invoiceData.from.address,
        invoiceData.from.city,
        invoiceData.from.province,
        invoiceData.from.country,
      ]
        .filter(Boolean)
        .join(", ")
      if (fromAddress) {
        addText(fromAddress, margin, yPos, { fontSize: 9, color: "#71717a" })
      }
      let fromY = yPos + 5
      if (invoiceData.from.phone) {
        addText(invoiceData.from.phone, margin, fromY, { fontSize: 9, color: "#71717a" })
        fromY += 5
      }
      if (invoiceData.from.email) {
        addText(invoiceData.from.email, margin, fromY, { fontSize: 9, color: "#71717a" })
        fromY += 5
      }

      let toY = yPos - 10
      addText("BILL TO", col2X, toY, { fontSize: 9, fontStyle: "bold", color: "#71717a" })
      toY += 5
      addText(invoiceData.to.name || "Client Name", col2X, toY, { fontSize: 10, fontStyle: "bold" })
      toY += 5
      const toAddress = [invoiceData.to.address, invoiceData.to.city, invoiceData.to.province, invoiceData.to.country]
        .filter(Boolean)
        .join(", ")
      if (toAddress) {
        addText(toAddress, col2X, toY, { fontSize: 9, color: "#71717a" })
      }
      toY += 5
      if (invoiceData.to.phone) {
        addText(invoiceData.to.phone, col2X, toY, { fontSize: 9, color: "#71717a" })
        toY += 5
      }
      if (invoiceData.to.email) {
        addText(invoiceData.to.email, col2X, toY, { fontSize: 9, color: "#71717a" })
        toY += 5
      }

      yPos = Math.max(fromY, toY) + 10

      const enabledColumns = invoiceData.columns.filter((col) => col.enabled)
      const tableWidth = pageWidth - 2 * margin
      const colWidths = enabledColumns.map(() => tableWidth / enabledColumns.length)

      pdf.setFillColor(59, 66, 99)
      pdf.rect(margin, yPos - 5, tableWidth, 8, "F")
      let xPos = margin
      enabledColumns.forEach((col, i) => {
        addText(col.label, xPos + 2, yPos, { fontSize: 9, fontStyle: "bold", color: "#ffffff" })
        xPos += colWidths[i]
      })
      yPos += 8

      if (invoiceData.lineItems.length === 0) {
        addText("No items added yet", pageWidth / 2, yPos + 10, { fontSize: 9, color: "#71717a", align: "center" })
        yPos += 20
      } else {
        invoiceData.lineItems.forEach((item, index) => {
          xPos = margin
          enabledColumns.forEach((col, i) => {
            let value = "-"
            if (col.id === "serialNumber") {
              value = String(index + 1)
            } else if (col.id === "price") {
              value = `$${(item.price || 0).toFixed(2)}`
            } else {
              value = item[col.id] || "-"
            }
            addText(value, xPos + 2, yPos, { fontSize: 9 })
            xPos += colWidths[i]
          })
          yPos += 4
          pdf.setDrawColor(228, 228, 231)
          pdf.setLineWidth(0.1)
          pdf.line(margin, yPos, pageWidth - margin, yPos)
          yPos += 5
        })
      }

      yPos += 10
      const total = invoiceData.lineItems.reduce((sum, item) => sum + (item.price || 0), 0)
      const totalBoxWidth = 60
      const totalBoxX = pageWidth - margin - totalBoxWidth

      pdf.setDrawColor(59, 66, 99)
      pdf.setLineWidth(0.5)
      pdf.line(totalBoxX, yPos - 2, pageWidth - margin, yPos - 2)

      addText("Total", totalBoxX, yPos + 3, { fontSize: 12, fontStyle: "bold" })
      addText(`$${total.toFixed(2)}`, pageWidth - margin, yPos + 3, {
        fontSize: 16,
        fontStyle: "bold",
        color: "#1e40af",
        align: "right",
      })

      yPos = pageHeight - margin - 10
      pdf.setDrawColor(228, 228, 231)
      pdf.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 5
      addText("Thank you for your business!", pageWidth / 2, yPos, {
        fontSize: 9,
        color: "#71717a",
        align: "center",
      })

      const filename = `invoice-${invoiceData.invoiceNumber}.pdf`
      pdf.save(filename)

      console.log("PDF generated successfully:", filename)
    } catch (error) {
      console.error("PDF generation error:", error)
      alert(`Error generating PDF: ${error instanceof Error ? error.message : "Unknown error"}`)
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
            <Button onClick={handleGeneratePDF}>
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
