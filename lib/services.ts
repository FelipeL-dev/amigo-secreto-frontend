import { api } from "./api"
import type {
  AuthResponse,
  Grupo,
  LoginRequest,
  Pessoa,
  RegisterRequest,
  ResultadoSorteio,
  Sorteio,
} from "./types"

// --- Autenticação ---
export async function login(payload: LoginRequest) {
  const { data } = await api.post<AuthResponse>("/auth/login", payload)
  return data
}

export async function register(payload: RegisterRequest) {
  const { data } = await api.post<AuthResponse>("/auth/register", payload)
  return data
}

// --- Grupos ---
export async function getMeusGrupos() {
  const { data } = await api.get<Grupo[]>("/api/grupos/meus")
  return data
}

export async function updateGrupo(id: number, nome: string) {
  const { data } = await api.put<Grupo>(`/api/grupos/${id}`, { nome })
  return data
}

export async function gerarConvite(id: number) {
  const { data } = await api.post<string>(`/api/grupos/${id}/convite`)
  return data
}

export async function entrarNoGrupo(token: string) {
  const { data } = await api.post(`/api/grupos/entrar/${token}`)
  return data
}

export async function getGrupo(id: number) {
  const { data } = await api.get<Grupo>(`/api/grupos/${id}`)
  return data
}

export async function criarGrupo(nome: string) {
  const { data } = await api.post<Grupo>("/api/grupos", {
    nome,
    dataCriacao: new Date().toISOString().slice(0, 10),
    sorteado: false,
  })
  return data
}

export async function getPessoasDoGrupo(grupoId: number) {
  const { data } = await api.get<Pessoa[]>(`/api/grupos/${grupoId}/pessoas`)
  return data
}

// --- Sorteios ---
export async function criarSorteio(grupoId: number) {
  const { data } = await api.post<Sorteio>("/api/sorteios", {
    grupoId,
    dataSorteio: new Date().toISOString(),
    status: "PENDENTE",
  })
  return data
}

export async function realizarSorteio(sorteioId: number) {
  const { data } = await api.post<Sorteio>(
    `/api/sorteios/${sorteioId}/realizar`,
  )
  return data
}

export async function finalizarSorteio(sorteioId: number) {
  const { data } = await api.patch<Sorteio>(
    `/api/sorteios/${sorteioId}/finalizar`,
  )
  return data
}

export async function getSorteio(sorteioId: number) {
  const { data } = await api.get<Sorteio>(`/api/sorteios/${sorteioId}`)
  return data
}

export async function getSorteios() {
  const { data } = await api.get<Sorteio[]>("/api/sorteios")
  return data
}

// --- Resultados ---
export async function getResultadosDoSorteio(sorteioId: number) {
  const { data } = await api.get<ResultadoSorteio[]>(
    `/api/resultadosorteio/sorteio/${sorteioId}`,
  )
  return data
}

// --- Pessoas ---
export async function getPessoa(id: number) {
  const { data } = await api.get<Pessoa>(`/api/pessoas/${id}`)
  return data
}


// --- Usuarios ---
export async function getMe() {
  const { data } = await api.get("/api/usuarios/me")
  return data
}

export async function updateMe(payload: { nome: string; email: string }) {
  const { data } = await api.put("/api/usuarios/me", payload)
  return data
}
