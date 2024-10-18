import { QueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 0
    },
    mutations: {
      async onError(error) {
        if ((error as any).code === "ERR_NETWORK") {
          toast.error("Sem conexão")
          return new Error("Sem conexão")
        }

        if ((error as any).response && (error as any).response.data.message) {
          toast.error((error as any).response.data.message)
          return new Error((error as any).response.data.message)
        }

        return error
      }
    }
  }
})
