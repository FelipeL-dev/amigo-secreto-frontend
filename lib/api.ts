import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios"
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./auth-tokens"
import type { AuthResponse } from "./types"

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Instância "crua" (sem interceptors) usada para renovar o token
// e evitar loops de refresh.
const rawApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// --- Request interceptor: injeta o Authorization Bearer ---
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`)
  }
  return config
})

// --- Controle de refresh concorrente ---
let isRefreshing = false
let pendingQueue: Array<(token: string | null) => void> = []

function processQueue(token: string | null) {
  pendingQueue.forEach((cb) => cb(token))
  pendingQueue = []
}

// Callback para reagir a logout forçado (definido pelo AuthProvider)
let onAuthFailure: (() => void) | null = null
export function setOnAuthFailure(cb: (() => void) | null) {
  onAuthFailure = cb
}

// --- Response interceptor: renova o token em caso de 401 ---
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined

    const status = error.response?.status

    // Não tenta renovar se não for 401, se já tentou, ou se não há request original
    if (status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error)
    }

    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      clearTokens()
      onAuthFailure?.()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    // Se já existe um refresh em andamento, aguarda a fila
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push((token) => {
          if (!token) {
            reject(error)
            return
          }
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${token}`,
          }
          resolve(api(originalRequest))
        })
      })
    }

    isRefreshing = true

    try {
      const { data } = await rawApi.post<AuthResponse>("/auth/refresh", {
        refreshToken,
      })
      setTokens(data.token, data.refreshToken)
      processQueue(data.token)

      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${data.token}`,
      }
      return api(originalRequest)
    } catch (refreshError) {
      processQueue(null)
      clearTokens()
      onAuthFailure?.()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)
