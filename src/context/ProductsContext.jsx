import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE } from "../auth/adminAuth.js";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const addProduct = (product) => {
    return fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
      .then((response) => response.json())
      .then((savedProduct) => {
        setProducts((current) => [...current, savedProduct]);
        return savedProduct;
      });
  };

  const updateProductPrice = (productId, price) => {
    return fetch(`${API_BASE}/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price }),
    }).then(() => {
      setProducts((current) =>
        current.map((product) =>
          product.id === productId ? { ...product, price } : product
        )
      );
    });
  };

  const removeProduct = (productId) => {
    return fetch(`${API_BASE}/products/${productId}`, {
      method: "DELETE",
    }).then(() => {
      setProducts((current) => current.filter((p) => p.id !== productId));
    });
  };

  return (
    <ProductsContext.Provider
      value={{ products, loading, error, addProduct, updateProductPrice, removeProduct }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}