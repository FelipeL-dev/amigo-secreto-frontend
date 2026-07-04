// Tipos alinhados com os DTOs da API de amigo secreto

export interface AuthResponse {
  token: string
  refreshToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  nome: string
  email: string
  password: string
}

export interface Grupo {
  id: number
  nome: string
  dataCriacao: string // date
  sorteado: boolean
}

export interface Pessoa {
  id: number
  nome: string
  email: string
  grupoIds?: number[]
}

export interface Sorteio {
  id: number
  grupoId: number
  dataSorteio: string // date-time
  status: string
}

export interface ResultadoSorteio {
  id: number
  sorteio_id: number
  sorteador_id: number
  sorteado_id: number
}
