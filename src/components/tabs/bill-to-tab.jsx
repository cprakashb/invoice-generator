"use client"

import { Text, Select, Card, TextField, Flex } from "@radix-ui/themes"
import { Box } from "@radix-ui/themes"

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

export function BillToTab({ invoiceData, setInvoiceData }) {
  const updateTo = (field, value) => {
    setInvoiceData({
      ...invoiceData,
      to: { ...invoiceData.to, [field]: value },
    })
  }

  return (
    <Card>
      <Text as="div" size="5" weight="bold" mb="4">
        Bill To (Recipient)
      </Text>
      <div className="space-y-4">
        <div>
          <Text as="label" size="2" weight="medium" htmlFor="to-name" className="block">
            Name *
          </Text>
          <TextField.Root
            id="to-name"
            value={invoiceData.to.name}
            onChange={(e) => updateTo("name", e.target.value)}
            placeholder="Client Name / Company Name"
          />
        </div>
        <div>
          <Text as="label" size="2" weight="medium" htmlFor="to-address" className="block">
            Street Address *
          </Text>
          <TextField.Root
            id="to-address"
            value={invoiceData.to.address}
            onChange={(e) => updateTo("address", e.target.value)}
            placeholder="456 Client Avenue"
          />
        </div>
        <Flex gap="4" mb="4" direction={{ initial: "column", sm: "row" }}>
          <Box style={{ flex: 1 }}>
            <Text as="label" size="2" weight="medium" htmlFor="project-city" mb="2" display="block">
              City *
            </Text>
            <TextField.Root
              id="to-city"
              value={invoiceData.to.city}
              onChange={(e) => updateTo("city", e.target.value)}
              placeholder="City"
            />
          </Box>
          <Box style={{ flex: 1 }}>
            <Text as="label" size="2" weight="medium" htmlFor="project-province" mb="2" display="block">
              Province
            </Text>
            <Select.Root value={invoiceData.to.province} onValueChange={(value) => updateTo("province", value)}>
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
        <div>
          <Text as="label" size="2" weight="medium" htmlFor="to-country" className="block">
            Country *
          </Text>
          <TextField.Root
            id="to-country"
            value={invoiceData.to.country}
            onChange={(e) => updateTo("country", e.target.value)}
            placeholder="Canada"
            disabled
          />
        </div>
        <div>
          <Text as="label" size="2" weight="medium" htmlFor="to-phone" className="block">
            Phone (Optional)
          </Text>
          <TextField.Root
            id="to-phone"
            value={invoiceData.to.phone}
            onChange={(e) => updateTo("phone", e.target.value)}
            placeholder="+1 234 567 8900"
          />
        </div>
        <div>
          <Text as="label" size="2" weight="medium" htmlFor="to-email" className="block">
            Email (Optional)
          </Text>
          <TextField.Root
            id="to-email"
            type="email"
            value={invoiceData.to.email}
            onChange={(e) => updateTo("email", e.target.value)}
            placeholder="client@email.com"
          />
        </div>
      </div>
    </Card>
  )
}
