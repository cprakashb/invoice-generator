"use client"

import { Text, Select, Checkbox, Card, TextField, Button, Box, Flex } from "@radix-ui/themes"
import { Upload, X } from "lucide-react"

const CANADIAN_PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon",
]

export function ProjectTab({ invoiceData, setInvoiceData }) {
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setInvoiceData({
          ...invoiceData,
          companyLogo: reader.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const updateProject = (field, value) => {
    setInvoiceData({
      ...invoiceData,
      project: { ...invoiceData.project, [field]: value },
    })
  }

  return (
    <Box>
      {/* Heading Section */}
      <Card mb="4">
        <Text as="div" size="5" weight="bold" mb="4">
          Invoice Heading
        </Text>
        <Box>
          <Box mb="4">
            <Text as="label" size="2" weight="medium" htmlFor="invoice-heading" mb="2" display="block">
              Heading Text
            </Text>
            <TextField.Root
              id="invoice-heading"
              value={invoiceData.invoiceHeading || ""}
              onChange={(e) => setInvoiceData({ ...invoiceData, invoiceHeading: e.target.value })}
              placeholder="INVOICE, TAX INVOICE, PROFORMA INVOICE, etc."
            />
            <Text as="div" size="1" color="gray" mt="1">
              This heading appears at the top of your invoice
            </Text>
          </Box>
          <Flex align="center" gap="2">
            <Checkbox
              id="show-heading"
              checked={invoiceData.showInvoiceHeading}
              onCheckedChange={(checked) =>
                setInvoiceData({
                  ...invoiceData,
                  showInvoiceHeading: typeof checked === "boolean" ? checked : checked.valueOf(),
                })
              }
            />
            <Text as="label" size="2" weight="medium" htmlFor="show-heading" style={{ cursor: "pointer" }}>
              Show heading in PDF
            </Text>
          </Flex>
        </Box>
      </Card>

      {/* Company Branding Section */}
      <Card mb="4">
        <Text as="div" size="5" weight="bold" mb="4">
          Company Branding (Optional)
        </Text>
        <Box>
          <Box mb="4">
            <Text as="label" size="2" weight="medium" htmlFor="company-name" mb="2" display="block">
              Company Name
            </Text>
            <TextField.Root
              id="company-name"
              value={invoiceData.companyName || ""}
              onChange={(e) => setInvoiceData({ ...invoiceData, companyName: e.target.value })}
              placeholder="Your Company Name"
            />
          </Box>
          <Box mb="4">
            <Text as="label" size="2" weight="medium" htmlFor="company-logo" mb="2" display="block">
              Company Logo
            </Text>
            <Flex align="center" gap="4">
              {invoiceData.companyLogo ? (
                <Box position="relative">
                  <img
                    src={invoiceData.companyLogo || "/placeholder.svg"}
                    alt="Company Logo"
                    style={{
                      height: "80px",
                      width: "80px",
                      objectFit: "contain",
                      border: "1px solid #e5e7eb",
                      borderRadius: "4px",
                    }}
                  />
                  <Button
                    size="1"
                    color="red"
                    variant="solid"
                    style={{ position: "absolute", top: "-8px", right: "-8px" }}
                    onClick={() => setInvoiceData({ ...invoiceData, companyLogo: "" })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </Box>
              ) : (
                <Box position="relative">
                  <Button
                    variant="outline"
                    style={{ height: "80px", width: "80px", cursor: "pointer" }}
                    onClick={() => document.getElementById("logo-upload")?.click()}
                  >
                    <Upload className="h-6 w-6" />
                  </Button>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleLogoUpload}
                  />
                </Box>
              )}
            </Flex>
          </Box>
          <Flex align="center" gap="2">
            <Checkbox
              id="show-company"
              checked={invoiceData.showCompanyInPDF}
              onCheckedChange={(checked) =>
                setInvoiceData({
                  ...invoiceData,
                  showCompanyInPDF: typeof checked === "boolean" ? checked : checked.valueOf(),
                })
              }
            />
            <Text as="label" size="2" weight="medium" htmlFor="show-company" style={{ cursor: "pointer" }}>
              Show company branding in PDF
            </Text>
          </Flex>
        </Box>
      </Card>

      {/* Project Details Section */}
      <Card mb="4">
        <Text as="div" size="5" weight="bold" mb="4">
          Project Details (Optional)
        </Text>
        <Box>
          <Box mb="4">
            <Text as="label" size="2" weight="medium" htmlFor="project-name" mb="2" display="block">
              Project Name
            </Text>
            <TextField.Root
              id="project-name"
              value={invoiceData.project?.name || ""}
              onChange={(e) => updateProject("name", e.target.value)}
              placeholder="Project Name"
            />
          </Box>
          <Box mb="4">
            <Text as="label" size="2" weight="medium" htmlFor="project-address" mb="2" display="block">
              Address
            </Text>
            <TextField.Root
              id="project-address"
              value={invoiceData.project?.address || ""}
              onChange={(e) => updateProject("address", e.target.value)}
              placeholder="Street Address"
            />
          </Box>
          <Flex gap="4" mb="4" direction={{ initial: "column", sm: "row" }}>
            <Box style={{ flex: 1 }}>
              <Text as="label" size="2" weight="medium" htmlFor="project-city" mb="2" display="block">
                City
              </Text>
              <TextField.Root
                id="project-city"
                value={invoiceData.project?.city || ""}
                onChange={(e) => updateProject("city", e.target.value)}
                placeholder="City"
              />
            </Box>
            <Box style={{ flex: 1 }}>
              <Text as="label" size="2" weight="medium" htmlFor="project-province" mb="2" display="block">
                Province
              </Text>
              <Select.Root
                value={invoiceData.project?.province || ""}
                onValueChange={(value) => updateProject("province", value)}
              >
                <Select.Trigger placeholder="Select province" style={{ width: "100%" }} />
                <Select.Content>
                  {CANADIAN_PROVINCES.map((province) => (
                    <Select.Item key={province} value={province}>
                      {province}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>
          </Flex>
          <Box mb="4">
            <Text as="label" size="2" weight="medium" htmlFor="project-country" mb="2" display="block">
              Country
            </Text>
            <TextField.Root
              id="project-country"
              value={invoiceData.project?.country || "Canada"}
              onChange={(e) => updateProject("country", e.target.value)}
              placeholder="Country"
              disabled
            />
          </Box>
          <Flex align="center" gap="2">
            <Checkbox
              id="show-project-details"
              checked={invoiceData.showProjectDetails}
              onCheckedChange={(checked) =>
                setInvoiceData({
                  ...invoiceData,
                  showProjectDetails: typeof checked === "boolean" ? checked : checked.valueOf(),
                })
              }
            />
            <Text as="label" size="2" weight="medium" htmlFor="show-project-details" style={{ cursor: "pointer" }}>
              Show project details in PDF
            </Text>
          </Flex>
        </Box>
      </Card>

      {/* Invoice Details Section */}
      <Card mb="4">
        <Text as="div" size="5" weight="bold" mb="4">
          Invoice Details
        </Text>
        <Box>
          <Flex gap="4" mb="4" direction={{ initial: "column", sm: "row" }}>
            <Box style={{ flex: 1 }}>
              <Text as="label" size="2" weight="medium" htmlFor="invoice-number" mb="2" display="block">
                Invoice Number
              </Text>
              <TextField.Root
                id="invoice-number"
                value={invoiceData.invoiceNumber}
                onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
              />
            </Box>
            <Box style={{ flex: 1 }}>
              <Text as="label" size="2" weight="medium" htmlFor="invoice-date" mb="2" display="block">
                Invoice Date
              </Text>
              <TextField.Root
                id="invoice-date"
                type="date"
                value={invoiceData.invoiceDate}
                onChange={(e) => setInvoiceData({ ...invoiceData, invoiceDate: e.target.value })}
              />
            </Box>
          </Flex>
          <Box mb="4">
            <Text as="label" size="2" weight="medium" htmlFor="due-date" mb="2" display="block">
              Due Date (Optional)
            </Text>
            <TextField.Root
              id="due-date"
              type="date"
              value={invoiceData.dueDate}
              onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
            />
          </Box>
          <Flex align="center" gap="2">
            <Checkbox
              id="show-invoice-number"
              checked={invoiceData.showInvoiceNumber}
              onCheckedChange={(checked) =>
                setInvoiceData({
                  ...invoiceData,
                  showInvoiceNumber: typeof checked === "boolean" ? checked : checked.valueOf(),
                })
              }
            />
            <Text as="label" size="2" weight="medium" htmlFor="show-invoice-number" style={{ cursor: "pointer" }}>
              Show invoice number in PDF
            </Text>
          </Flex>
        </Box>
      </Card>
    </Box>
  )
}
