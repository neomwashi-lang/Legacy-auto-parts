const checkoutStorageKey = 'legacy-auto-parts-checkout-details'

export function saveCheckoutDetails({ fullName, phone, address, city, cardName, cardLast4 }) {
  const details = { fullName, phone, address, city, cardName, cardLast4 }
  localStorage.setItem(checkoutStorageKey, JSON.stringify(details))
}

export function getCheckoutDetails() {
  try {
    return JSON.parse(localStorage.getItem(checkoutStorageKey)) || null
  } catch {
    return null
  }
}