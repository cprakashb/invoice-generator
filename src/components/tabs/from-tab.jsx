"use client";

import { Text, Select, Card, TextField, Flex } from "@radix-ui/themes"

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

export function FromTab({ invoiceData, setInvoiceData }) {
  const updateFrom = (field, value) => {
    setInvoiceData({
      ...invoiceData,
      from: { ...invoiceData.from, [field]: value },
    })
  }

  return (
    <Card>
      <Text as="div" size="5" weight="bold">
        From (Sender)
      </Text>
      <div className="space-y-4 mt-4">
        <div>
          <Text as="label" size="2" weight="medium" htmlFor="from-name" className="block">
            Name *
          </Text>
          <TextField.Root
            id="from-name"
            value={invoiceData.from.name}
            onChange={(e) => updateFrom("name", e.target.value)}
            placeholder="Your Name / Company Name"
          />
        </div>
        <div>
          <Text as="label" size="2" weight="medium" htmlFor="from-address" className="block">
            Street Address *
          </Text>
          <TextField.Root
            id="from-address"
            value={invoiceData.from.address}
            onChange={(e) => updateFrom("address", e.target.value)}
            placeholder="123 Main Street"
          />
        </div>
        <Flex wrap="wrap" gap="3">
          <div className="flex-1 min-w-[150px]">
            <Text as="label" size="2" weight="medium" htmlFor="from-city" className="block">
              City *
            </Text>
            <TextField.Root
              id="from-city"
              value={invoiceData.from.city}
              onChange={(e) => updateFrom("city", e.target.value)}
              placeholder="Toronto"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <Text as="label" size="2" weight="medium" htmlFor="from-province" className="block">
              Province *
            </Text>
            <Select.Root className="w-100" value={invoiceData.from.province} onValueChange={(value) => updateFrom("province", value)}>
              <Select.Trigger placeholder="Select province" className="w-full" />
              <Select.Content>
                {CANADIAN_PROVINCES.map((province) => (
                  <Select.Item key={province} value={province}>
                    {province}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </Flex>
        <div>
          <Text as="label" size="2" weight="medium" htmlFor="from-country" className="block">
            Country *
          </Text>
          <TextField.Root
            id="from-country"
            value={invoiceData.from.country}
            onChange={(e) => updateFrom("country", e.target.value)}
            placeholder="Canada"
            disabled
          />
        </div>
        <div>
          <Text as="label" size="2" weight="medium" htmlFor="from-phone" className="block">
            Phone (Optional)
          </Text>
          <TextField.Root
            id="from-phone"
            value={invoiceData.from.phone}
            onChange={(e) => updateFrom("phone", e.target.value)}
            placeholder="+1 234 567 8900"
          />
        </div>
        <div>
          <Text as="label" size="2" weight="medium" htmlFor="from-email" className="block">
            Email (Optional)
          </Text>
          <TextField.Root
            id="from-email"
            type="email"
            value={invoiceData.from.email}
            onChange={(e) => updateFrom("email", e.target.value)}
            placeholder="your@email.com"
          />
        </div>
      </div>
    </Card>
  )
}
