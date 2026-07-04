import axios from "axios"

// Extrai uma mensagem legível de erros do axios/API
export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; error?: string }
      | string
      | undefined

    if (typeof data === "string" && data.trim()) return data
    if (data && typeof data === "object") {
      if (data.message) return data.message
      if (data.error) return data.error
    }

    if (error.code === "ERR_NETWORK") {
      return "Não foi possível conectar à API. Verifique se o servidor está rodando."
    }
    if (error.response?.status === 401) {
      return "Credenciais inválidas."
    }
  }
  return fallback
}
