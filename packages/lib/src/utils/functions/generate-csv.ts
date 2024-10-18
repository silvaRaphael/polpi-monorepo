export function generateCSV(data: Record<string, any>[], fileName?: string) {
  // Get keys (columns) from first object
  const headers = Object.keys(data[0])

  // Map array data to a CSV string
  const csvRows = data.map((row: any) =>
    headers
      .map((fieldName) => JSON.stringify(row[fieldName], replacer))
      .join(",")
  )

  // Add header
  csvRows.unshift(headers.join(","))

  // Create CSV content
  const csvContent = csvRows.join("\n")

  // Create a blob from CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

  // Create a download link
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute(
    "download",
    `${fileName || "Relatorio"}-${new Date()
      .toLocaleString("pt-BR", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      })
      .replace(/[\/,: ]+/g, "_")}.csv`
  )
  document.body.appendChild(link)

  // Trigger download
  link.click()

  // Remode download link after download
  document.body.removeChild(link)
}

// Optional function to handle special characters and strings
function replacer(_: any, value: any) {
  return value === null ? "" : value
}
