"use client"

import { Tabs, Box } from "@radix-ui/themes";
import { FromTab } from "./tabs/from-tab";

export function InvoiceForm({ invoiceData, setInvoiceData }) {
  return (
    <Tabs.Root defaultValue="from">
      <Tabs.List>
        <Tabs.Trigger value="from">From</Tabs.Trigger>
        <Tabs.Trigger value="billTo">Bill To</Tabs.Trigger>
        <Tabs.Trigger value="project">Project</Tabs.Trigger>
        <Tabs.Trigger value="items">Items</Tabs.Trigger>
      </Tabs.List>

      <Box pt="3">
        <Tabs.Content value="from">
          <FromTab invoiceData={invoiceData} setInvoiceData={setInvoiceData} />
        </Tabs.Content>

        <Tabs.Content value="billTo">
          <FromTab invoiceData={invoiceData} setInvoiceData={setInvoiceData} />
        </Tabs.Content>

        <Tabs.Content value="project">
        </Tabs.Content>

        <Tabs.Content value="items">
        </Tabs.Content>
      </Box>

    </Tabs.Root>
  )
}
