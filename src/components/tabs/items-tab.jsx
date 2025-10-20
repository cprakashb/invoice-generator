"use client"

import { useState, useEffect } from "react"
import { Text, Card, TextField, Button, Callout, Flex, Box } from "@radix-ui/themes"
import { Check, Plus, Trash2, Save, Info } from "lucide-react"

const DEFAULT_LINE_ITEMS_KEY = "invoice_default_line_items"

export function ItemsTab({ invoiceData, setInvoiceData }) {
  const [savedItemId, setSavedItemId] = useState(null)
  const [currentDefaults, setCurrentDefaults] = useState(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDefaults = localStorage.getItem(DEFAULT_LINE_ITEMS_KEY)
      if (savedDefaults) {
        try {
          setCurrentDefaults(JSON.parse(savedDefaults))
        } catch (e) {
          console.error("Failed to load defaults:", e)
        }
      }
    }
  }, [])

  const addLineItem = () => {
    const currentDate = new Date().toISOString().split("T")[0]

    const newItem = {
      id: Date.now().toString(),
      itemName: "",
      date: currentDate,
      price: 0,
    }

    setInvoiceData({
      ...invoiceData,
      lineItems: [...invoiceData.lineItems, newItem],
    })
  }

  const saveAsDefaultLineItem = (item) => {
    if (typeof window === "undefined") return

    try {
      const defaultItem = {
        itemName: item.itemName,
        date: item.date,
        price: item.price,
      }
      localStorage.setItem(DEFAULT_LINE_ITEMS_KEY, JSON.stringify(defaultItem))
      setCurrentDefaults(defaultItem)
      setSavedItemId(item.id)
      setTimeout(() => setSavedItemId(null), 2000)
    } catch (e) {
      console.error("Failed to save default line item:", e)
      alert("Failed to save default line item")
    }
  }

  const clearDefaultLineItem = () => {
    if (typeof window === "undefined") return

    try {
      localStorage.removeItem(DEFAULT_LINE_ITEMS_KEY)
      setCurrentDefaults(null)
    } catch (e) {
      console.error("Failed to clear default line item:", e)
    }
  }

  const updateLineItem = (id, field, value) => {
    setInvoiceData({
      ...invoiceData,
      lineItems: invoiceData.lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    })
  }

  const removeLineItem = (id) => {
    setInvoiceData({
      ...invoiceData,
      lineItems: invoiceData.lineItems.filter((item) => item.id !== id),
    })
  }

  const enabledColumns = invoiceData.columns.filter((col) => col.enabled)

  return (
    <Box>
      {currentDefaults && (
        <Callout.Root color="blue" mb="4">
          <Callout.Icon>
            <Info />
          </Callout.Icon>
          <Flex justify="between" align="start" gap="4">
            <Box>
              <Text as="div" weight="medium" size="2" mb="2">
                Default Line Item Template Active
              </Text>
              <Text as="div" size="2" color="gray">
                New items will use: {currentDefaults.itemName || "Empty name"} - $
                {currentDefaults.price?.toFixed(2) || "0.00"}
              </Text>
            </Box>
            <Button variant="ghost" onClick={clearDefaultLineItem}>
              Clear
            </Button>
          </Flex>
        </Callout.Root>
      )}

      <Card>
        <Text as="div" size="5" weight="bold" mb="2">
          Line Items
        </Text>
        <Text as="p" size="2" color="gray" mb="4">
          Click the <Save className="h-3 w-3 inline mx-1" /> icon on any item to save it as a default template for new
          items
        </Text>
        <Flex direction="column" gap="4">
          <Flex direction="column" gap="3">
            {invoiceData.lineItems.map((item, index) => (
              <Card key={item.id}>
                <Flex justify="between" align="center" mb="3">
                  <Text size="2" weight="medium" color="gray">
                    Item #{index + 1}
                  </Text>
                  <Flex gap="3">
                    <Button
                      variant={savedItemId === item.id ? "solid" : "soft"}
                      color={savedItemId === item.id ? "green" : "blue"}
                      onClick={() => saveAsDefaultLineItem(item)}
                      title="Save as default line item template"
                    >
                      {savedItemId === item.id ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span className="text-xs">Saved!</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span className="text-xs">Save as Default</span>
                        </>
                      )}
                    </Button>
                    <Button variant="soft" color="red" onClick={() => removeLineItem(item.id)} title="Delete this item">
                      <Trash2 className="h-4 w-4" />
                      <span className="text-xs">Delete</span>
                    </Button>
                  </Flex>
                </Flex>
                <Flex direction="column" gap="3">
                  {enabledColumns.map((column) => {
                    if (column.id === "serialNumber") return null

                    return (
                      <Box key={column.id}>
                        <Text
                          as="label"
                          size="2"
                          weight="medium"
                          htmlFor={`${item.id}-${column.id}`}
                          style={{ display: "block", marginBottom: "8px" }}
                        >
                          {column.label}
                        </Text>
                        <TextField.Root
                          id={`${item.id}-${column.id}`}
                          type={column.type === "number" ? "number" : column.type === "date" ? "date" : "text"}
                          value={item[column.id] || ""}
                          onChange={(e) =>
                            updateLineItem(
                              item.id,
                              column.id,
                              column.type === "number" ? Number.parseFloat(e.target.value) || 0 : e.target.value,
                            )
                          }
                          step={column.type === "number" ? "0.01" : undefined}
                        />
                      </Box>
                    )
                  })}
                </Flex>
              </Card>
            ))}
          </Flex>
          <Button onClick={addLineItem} variant="outline" size="3" style={{ width: "100%" }}>
            <Plus className="h-4 w-4" />
            Add Line Item
          </Button>
        </Flex>
      </Card>
    </Box>
  )
}
