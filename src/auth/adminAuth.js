// Emmanuel wema
// Authentication now goes through the JSON Server API instead of localStorage.
export const API_BASE = 'http://localhost:3000'
export const adminSessionKey = 'legacy-auto-parts-admin-session'
export const userSessionKey = 'legacy-auto-parts-user-session'

export function setSession(key, user) {
  sessionStorage.setItem(key, JSON.stringify(user))
}

export function getSession(key) {
  try {
    return JSON.parse(sessionStorage.getItem(key))
  } catch {
    return null
  }
}

export function clearSession(key) {
  sessionStorage.removeItem(key)
}

export async function findUserByEmail(email) {
  const response = await fetch(`${API_BASE}/users?email=${encodeURIComponent(email.trim().toLowerCase())}`)
  if (!response.ok) throw new Error('Unable to reach the account service.')
  const matches = await response.json()
  return matches[0] || null
}

export async function loginWithApi({ email, password, requiredRole }) {
  const user = await findUserByEmail(email)
  if (!user || user.password !== password) {
    throw new Error('The email or password is incorrect.')
  }
  if (requiredRole && user.role !== requiredRole) {
    throw new Error('This account does not have access to this area.')
  }
  return user
}

export async function registerCustomer({ name, phone, email, password }) {
  const existing = await findUserByEmail(email)
  if (existing) {
    throw new Error('An account with this email already exists.')
  }

  const response = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      phone,
      email: email.trim().toLowerCase(),
      password,
      role: 'Customer',
      verified: false,
    }),
  })

  if (!response.ok) throw new Error('Unable to create the account.')
  return response.json()
}
