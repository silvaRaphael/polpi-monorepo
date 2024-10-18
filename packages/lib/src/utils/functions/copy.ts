import { toast } from "sonner"

export async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success("Copiado para área de transferencia!")
  } catch (e) {
    console.error("Failed to copy to clipboard.", e)
    toast.success("Erro ao copiar para área de transferencia!")
  }
}
