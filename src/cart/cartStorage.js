{/* Neo Mwashi */}
const cartStorageKey = 'legacy-auto-parts-cart'

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(cartStorageKey)) || []
  } catch {
    return []
  }
}

function saveCart(cart) {
  localStorage.setItem(cartStorageKey, JSON.stringify(cart))
}

export function addToCart(product, quantity) {
  const cart = getCart()
  const existing = cart.find((item) => item.productId === product.id)

  if (existing) {
    existing.quantity += quantity
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      quantity,
    })
  }

  saveCart(cart)
  return cart
}

export function updateCartItemQuantity(productId, quantity) {
  const cart = getCart().map((item) =>
    item.productId === productId ? { ...item, quantity } : item
  )
  saveCart(cart)
  return cart
}

export function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.productId !== productId)
  saveCart(cart)
  return cart
}

export function clearCart() {
  saveCart([])
}

export function getCartTotal(cart) {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0)
}