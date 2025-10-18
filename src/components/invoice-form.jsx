"use client"

import { Tabs, Box } from "@radix-ui/themes"

export function InvoiceForm() {
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
        </Tabs.Content>

        <Tabs.Content value="billTo">
        </Tabs.Content>

        <Tabs.Content value="project">
        </Tabs.Content>

        <Tabs.Content value="items">
        </Tabs.Content>
      </Box>

    </Tabs.Root>
  )
}
