import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE } from "../auth/adminAuth.js";

const UsersContext = createContext(null);

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/users`)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const addUser = (user) => {
    return fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((savedUser) => {
        setUsers((current) => [...current, savedUser]);
        return savedUser;
      });
  };

  const removeUser = (userId) => {
    return fetch(`${API_BASE}/users/${userId}`, {
      method: "DELETE",
    }).then(() => {
      setUsers((current) => current.filter((u) => u.id !== userId));
    });
  };

  const updateUser = (userId, updates) => {
    return fetch(`${API_BASE}/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }).then(() => {
      setUsers((current) =>
        current.map((u) => (u.id === userId ? { ...u, ...updates } : u))
      );
    });
  };

  return (
    <UsersContext.Provider value={{ users, loading, error, addUser, removeUser, updateUser }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  return useContext(UsersContext);
}