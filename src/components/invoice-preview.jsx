"use client"

import { Card } from "@radix-ui/themes"

export function InvoicePreview({ invoiceData }) {
  const enabledColumns = invoiceData.columns.filter((col) => col.enabled)

  const total = invoiceData.lineItems.reduce((sum, item) => sum + (item.price || 0), 0)

  return (
    <Card id="invoice-preview" style={{ minWidth: "600px" }}>
      <div className="space-y-8 p-5">
        <div className="flex justify-between items-start">
          <div>
            {invoiceData.showInvoiceHeading && invoiceData.invoiceHeading && (
              <h1 className="text-xl font-bold text-primary mb-4">{invoiceData.invoiceHeading}</h1>
            )}

            {invoiceData.showCompanyInPDF && (invoiceData.companyName || invoiceData.companyLogo) ? (
              <div className="space-y-2">
                {invoiceData.companyLogo && (
                  <img
                    src={invoiceData.companyLogo || "/placeholder.svg"}
                    alt="Company Logo"
                    className="h-16 w-auto object-contain"
                  />
                )}
                {invoiceData.companyName && (
                  <h2 className="text-lg font-bold text-foreground">{invoiceData.companyName}</h2>
                )}
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-primary mb-2"></h1>
              </>
            )}

            {invoiceData.showInvoiceNumber && invoiceData.invoiceNumber && (
              <p className="text-sm text-muted-foreground mt-2">Invoice #{invoiceData.invoiceNumber}</p>
            )}
          </div>
          <div className="text-right text-sm">
            <p className="font-medium">Date: {invoiceData.invoiceDate || "N/A"}</p>
            {invoiceData.dueDate && <p className="text-muted-foreground">Due: {invoiceData.dueDate}</p>}
          </div>
        </div>

        {/* Project section display */}
        {invoiceData.project && invoiceData.project.name && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Project</h3>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">{invoiceData.project.name}</p>
              {(invoiceData.project.address || invoiceData.project.city || invoiceData.project.province) && (
                <p className="text-sm text-muted-foreground">
                  {[
                    invoiceData.project.address,
                    invoiceData.project.city,
                    invoiceData.project.province,
                    invoiceData.project.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
            </div>
          </div>
        )}

        {/* From and To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">From</h3>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">{invoiceData.from.name || "Your Name"}</p>
              <p className="text-sm text-muted-foreground">
                {[invoiceData.from.address, invoiceData.from.city, invoiceData.from.province, invoiceData.from.country]
                  .filter(Boolean)
                  .join(", ") || "Your Address"}
              </p>
              {invoiceData.from.phone && <p className="text-sm text-muted-foreground">{invoiceData.from.phone}</p>}
              {invoiceData.from.email && <p className="text-sm text-muted-foreground">{invoiceData.from.email}</p>}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Bill To</h3>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">{invoiceData.to.name || "Client Name"}</p>
              <p className="text-sm text-muted-foreground">
                {[invoiceData.to.address, invoiceData.to.city, invoiceData.to.province, invoiceData.to.country]
                  .filter(Boolean)
                  .join(", ") || "Client Address"}
              </p>
              {invoiceData.to.phone && <p className="text-sm text-muted-foreground">{invoiceData.to.phone}</p>}
              {invoiceData.to.email && <p className="text-sm text-muted-foreground">{invoiceData.to.email}</p>}
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div>
          <table className="w-full table-fixed">
            <thead>
              <tr style={{ backgroundColor: "rgb(59, 66, 99)" }}>
                {enabledColumns.map((column) => (
                  <th
                    key={column.id}
                    className={`text-left py-3 px-2 text-sm font-semibold ${
                      column.id === "serialNumber"
                        ? "w-16"
                        : column.id === "itemName"
                          ? "w-auto"
                          : column.id === "date"
                            ? "w-32"
                            : column.id === "price"
                              ? "w-24"
                              : ""
                    }`}
                    style={{ color: "#ffffff" }}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoiceData.lineItems.length === 0 ? (
                <tr>
                  <td colSpan={enabledColumns.length} className="text-center py-8 text-muted-foreground">
                    No items added yet
                  </td>
                </tr>
              ) : (
                invoiceData.lineItems.map((item, index) => (
                  <tr key={item.id} className="border-b border-border">
                    {enabledColumns.map((column) => (
                      <td
                        key={column.id}
                        className={`py-3 px-2 text-sm text-foreground ${column.id === "itemName" ? "break-words" : ""}`}
                      >
                        {column.id === "serialNumber"
                          ? index + 1
                          : column.id === "price"
                            ? `$${(item.price || 0).toFixed(2)}`
                            : item[column.id] || "-"}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between items-center py-3 border-t-2 border-primary">
              <span className="font-bold text-lg text-foreground">Total</span>
              <span className="font-bold text-2xl text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-border">
          <p className="text-xs text-center text-muted-foreground">Thank you for your business!</p>
        </div>
      </div>
    </Card>
  )
}
