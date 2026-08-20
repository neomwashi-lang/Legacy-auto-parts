{/* Emmanuel Wema */}
import { useEffect, useState } from "react";
import { Link } from "react-router";
import useFetch from "../hooks/useFetch";
import {
  BarChart3,
  ChevronDown,
  Cog,
  Home,
  LogOut,
  Pencil,
  PackagePlus,
  Search,
  Shield,
  Trash2,
  Users,
  UserPlus,
  X,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router";
import { API_BASE, adminSessionKey } from "../auth/adminAuth.js";


const statCards = [
  { label: "Total sales anually", value: "500,000" },
  { label: "total stock in inventory", value: "300 pieces" },
  { label: "Total sales monthly", value: "100,000" },
  { label: "Website logins", value: "3,000" },
];


const productsStorageKey = "legacy-auto-parts-products";

const navSections = [
  {
    title: "DASHBOARDS",
    items: [
      { label: "Dashboard", icon: Home },
      { label: "Parts still in stock", icon: BarChart3 },
    ],
  },
  {
    title: "REPORTS",
    items: [{ label: "Staff and users", icon: Users }],
  },
  {
    title: "PRICE CHANGE",
    items: [{ label: "Price change", icon: Zap }],
  },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("Dashboard");
  
  const { data: fetchedProducts, loading, error } = useFetch(
    `${API_BASE}/products`,
    "https://legacy-auto-parts.onrender.com/products"
  );

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (fetchedProducts) {
      setProducts(fetchedProducts);
    }
  }, [fetchedProducts]);

  const { data: fetchedUsers, error: usersError } = useFetch(`${API_BASE}/users`);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (fetchedUsers) {
      setUsers(fetchedUsers.filter((user) => user.role !== "Reader"));
    }
  }, [fetchedUsers]);

  const [searchTerm, setSearchTerm] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("All");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "", 
    phone: "", 
    email: "", 
    password: "", 
    role: "Customer" 
  });

  const [editingUser, setEditingUser] = useState(null);
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    model: "",
    category: "",
    partNo: "",
    description: "",
    quantity: "",
    price: "",
    image: "",
  });

  const [expandedSections, setExpandedSections] = useState({
    DASHBOARDS: true,
    REPORTS: true,
    "PRICE CHANGE": false,
  });

  const toggleSection = (sectionTitle) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  const visibleProducts = products.filter((product) =>
    [product.name, product.brand, product.model, product.partNo, product.category]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const visibleUsers = users.filter((user) => {
    const matchesRole =
      userRoleFilter === "All" || user.role === userRoleFilter;
    const matchesSearch = [user.name, user.phone, user.email, user.role]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const addProduct = (event) => {
    event.preventDefault();
    if (!newProduct.name || !newProduct.brand || !newProduct.quantity) return;

    const productToSave = {
      ...newProduct,
      quantity: Number(newProduct.quantity),
      price: Number(newProduct.price) || 0,
      tone: "blue",
    };

    fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productToSave),
    })
      .then((response) => response.json())
      .then((savedProduct) => {
        setProducts((currentProducts) => [...currentProducts, savedProduct]);
        setNewProduct({
          name: "",
          brand: "",
          model: "",
          category: "",
          partNo: "",
          description: "",
          quantity: "",
          price: "",
          image: "",
        });
        setShowAddProduct(false);
      })
      .catch((err) => console.error("Failed to add product:", err));
  };



  const updateProductPrice = (productId, price) => {
    const trimmedPrice = price.trim();
    if (!trimmedPrice) return;

    
    fetch(`${API_BASE}/products/${productId}`, {
      method: "PATCH",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({ price: Number(trimmedPrice) }),
    })
      .then((response) => response.json())
      .then(() => {
        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.id === productId
              ? { ...product, price: trimmedPrice }
              : product,
          ),
        );
      })
      .catch((err) => console.error("Failed to update price:", err));
  };



  const handleProductImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () =>
      setNewProduct((currentProduct) => ({
        ...currentProduct,
        image: reader.result,
      }));
    reader.readAsDataURL(file);
  };


  const removeProduct = (product) => {
    if (!window.confirm(`Delete ${product.name} from inventory?`)) return;
    fetch(`${API_BASE}/products/${product.id}`, {
      method: "DELETE",
    })
      .then(() => {
        setProducts((currentProducts) =>
          currentProducts.filter((item) => item.id !== product.id),
      );
    })
  };

  const removeUser = (user) => {
    if (!window.confirm(`Delete ${user.name} from staff and users?`)) return;
    fetch(`${API_BASE}/users/${user.id}`, { method: "DELETE" })
      .then(() => {
        setUsers((currentUsers) => currentUsers.filter((item) => item.id !== user.id));
      })
      .catch((err) => console.error("Failed to delete user:", err));
  };

  const saveUser = (event) => {
    event.preventDefault();
    fetch(`${API_BASE}/users/${editingUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingUser),
    })
      .then((response) => response.json())
      .then((updatedUser) => {
        setUsers((currentUsers) =>
          currentUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
        );
        setEditingUser(null);
      })
      .catch((err) => console.error("Failed to update user:", err));
  };

  const toggleVerified = (user) => {
    fetch(`${API_BASE}/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified: !user.verified }),
    })
      .then((response) => response.json())
      .then((updatedUser) => {
        setUsers((currentUsers) =>
          currentUsers.map((item) => (item.id === updatedUser.id ? updatedUser : item)),
        );
      })
      .catch((err) => console.error("Failed to update verification:", err));
  };

  const addUser = (event) => {
    event.preventDefault();
    if (!newUser.name || !newUser.phone || !newUser.email || (newUser.role === "Admin" && !newUser.password)) return;

    fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newUser, verified: newUser.role !== "Customer" }),
    })
      .then((response) => response.json())
      .then((savedUser) => {
        setUsers((currentUsers) => [...currentUsers, savedUser]);
        setNewUser({ name: "", phone: "", email: "", password: "", role: "Customer" });
        setShowAddUser(false);
      })
      .catch((err) => console.error("Failed to add user:", err));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black">
      {/* LEFT SIDEBAR - Dark blue */}
      <div className="w-[30%] flex-shrink-0 bg-gradient-to-b from-admin-800 to-admin-900 px-6 py-8 flex flex-col overflow-y-auto border-r border-admin-accent/20">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-admin-accent/20">
          <h2 className="text-lg font-bold text-admin-accent">Admin</h2>
          <Link
            to="/"
            className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-admin-accent/70 hover:text-admin-accent transition-colors"
          >
            ← Back to Site
          </Link>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 space-y-2">
          {navSections.map((section) => {
            const isExpanded = expandedSections[section.title];
            return (
              <div key={section.title}>
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold uppercase text-admin-accent/60 hover:text-admin-accent transition-colors"
                >
                  <span>{section.title}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      isExpanded ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                </button>

                {/* Section Items */}
                {isExpanded && (
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.label === activeItem;
                      return (
                        <button
                          key={item.label}
                          onClick={() => setActiveItem(item.label)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded transition-colors ${
                            isActive
                              ? "bg-admin-accent/20 text-admin-accent"
                              : "text-admin-muted hover:bg-admin-800/80 hover:text-white"
                          }`}
                        >
                          <Icon size={18} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem(adminSessionKey);
            navigate("/admin/login", { replace: true });
          }}
          className="mt-6 flex w-full items-center gap-3 rounded px-4 py-3 text-sm font-medium text-[#b0d4e3] transition-colors hover:bg-[#1a3a52]/80 hover:text-white"
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>

      {/* RIGHT MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-admin-900 via-admin-panel to-[#0a0f14]">
        {/* Header */}
        <header className="relative z-10 flex items-center justify-between bg-admin-gradient px-12 py-5 text-4xl font-bold text-admin-ink shadow-lg">
          Admin &gt; {activeItem}
        </header>

        <main className="relative z-10 flex-1 overflow-auto px-10 py-10">
          {loading ? (
            <p className="text-admin-muted">Loading products...</p>
          ) : error ? (
            <p className="text-red-300">Error loading products: {error}</p>
          ) : activeItem === "Price change" ? (
            <section className="max-w-7xl">
              <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-admin-accent">
                    Inventory controls
                  </p>
                  <h1 className="text-4xl font-bold text-admin-ink">
                    Price change
                  </h1>
                  <p className="mt-2 text-sm text-admin-muted">
                    Update the selling price of any part in your inventory.
                  </p>
                </div>
                <div className="rounded-lg border border-admin-accent/20 bg-admin-900/50 px-4 py-3 text-sm text-admin-muted">
                  {products.length} products in inventory
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-admin-accent/20 bg-admin-panel/95 shadow-xl">
                <div className="hidden grid-cols-[2fr_1.4fr_1fr_1.4fr] gap-4 border-b border-admin-accent/20 bg-admin-600 px-5 py-4 text-xs font-bold uppercase tracking-wider text-admin-muted md:grid">
                  <span>Product</span>
                  <span>Part number</span>
                  <span>Stock</span>
                  <span>Price</span>
                </div>
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="grid gap-4 border-b border-admin-accent/20 px-5 py-4 last:border-b-0 md:grid-cols-[2fr_1.4fr_1fr_1.4fr] md:items-center"
                  >
                    <div>
                      <span className="mr-2 text-[10px] font-bold uppercase text-admin-accent md:hidden">
                        Product
                      </span>
                      <span className="font-semibold text-admin-accentSoft">
                        {product.name}
                      </span>
                      <span className="mt-1 block text-xs text-admin-muted">
                        {product.vehicle}
                      </span>
                    </div>
                    <div className="text-sm text-admin-muted">
                      <span className="mr-2 text-[10px] font-bold uppercase text-admin-accent md:hidden">
                        Part number
                      </span>
                      {product.partNo}
                    </div>
                    <div className="text-sm text-admin-muted">
                      <span className="mr-2 text-[10px] font-bold uppercase text-admin-accent md:hidden">
                        Stock
                      </span>
                      {product.quantity} available
                    </div>
                    <form
                      className="flex items-center gap-2"
                      onSubmit={(event) => {
                        event.preventDefault();
                        updateProductPrice(
                          product.id,
                          event.currentTarget.elements.price.value,
                        );
                      }}
                    >
                      <label
                        className="sr-only"
                        htmlFor={`price-${product.id}`}
                      >
                        Price for {product.name}
                      </label>
                      <input
                        id={`price-${product.id}`}
                        name="price"
                        defaultValue={product.price}
                        className="min-w-0 flex-1 rounded-lg border border-admin-accent/20 bg-admin-900 px-3 py-2.5 text-admin-ink caret-admin-accent outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                        style={{
                          color: "#f8fafc",
                          WebkitTextFillColor: "#f8fafc",
                        }} // Using admin ink color (#f8fafc)
                      />
                      <button
                        type="submit"
                        className="rounded-lg bg-admin-accent px-3 py-2.5 text-xs font-bold text-admin-700 transition hover:bg-admin-accentSoft"
                      >
                        Save
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </section>
          ) : activeItem === "Staff and users" ? (
            <section className="max-w-7xl">
              <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-admin-accent">
                    Access management
                  </p>
                  <h1 className="text-4xl font-bold text-admin-ink">
                    Staff and users
                  </h1>
                  <p className="mt-2 text-sm text-admin-muted">
                    Manage accounts, roles, and customer access.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-admin-muted">
                    <Shield size={18} className="text-admin-accent" />{" "}
                    {visibleUsers.length} users shown
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddUser(true)}
                    className="flex items-center gap-2 rounded-lg bg-admin-accent px-4 py-3 text-sm font-bold text-admin-700 transition hover:bg-admin-accentSoft"
                  >
                    <UserPlus size={18} />
                    Add user
                  </button>
                </div>
              </div>

              <div className="mb-5 flex flex-wrap gap-2">
                <div className="relative mr-2 min-w-[250px] flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text"
                    size={18}
                  />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search name or phone..."
                    className="w-full rounded-lg border border-admin-accent/20 bg-admin-surface py-3 pl-10 pr-4 text-sm text-admin-ink outline-none transition focus:border-admin-accent"
                  />
                </div>
                {["All", "Customer", "Manager", "Admin"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setUserRoleFilter(role)}
                    className={`rounded-lg border px-5 py-3 text-sm font-semibold transition ${userRoleFilter === role ? "border-admin-accent bg-admin-accent/15 text-admin-accent" : "border-admin-accent/20 bg-admin-surface text-admin-muted hover:border-admin-accent/50 hover:text-admin-ink"}`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <div className="overflow-hidden rounded-xl border border-admin-accent/20 bg-admin-panel/95 shadow-xl">
                <div className="hidden grid-cols-[2fr_1.2fr_2fr_1fr_100px] gap-4 border-b border-admin-accent/20 bg-admin-600 px-5 py-4 text-xs font-bold uppercase tracking-wider text-admin-muted md:grid">
                  <span>Name</span>
                  <span>Phone</span>
                  <span>Email</span>
                  <span>Role</span>
                  <span className="text-right">Actions</span>
                </div>
                <div>
                  {visibleUsers.map((user) => (
                    <div
                      key={user.id}
                      className="grid gap-3 border-b border-admin-accent/20 px-5 py-4 last:border-b-0 md:grid-cols-[2fr_1.2fr_2fr_1fr_100px] md:items-center md:gap-4"
                    >
                      <div>
                        <span className="mr-2 text-[10px] font-bold uppercase text-admin-accent md:hidden">
                          Name
                        </span>
                        <span className="font-semibold text-admin-accentSoft">
                          {user.name}
                        </span>
                      </div>
                      <div className="text-sm text-admin-muted">
                        <span className="mr-2 text-[10px] font-bold uppercase text-admin-accent md:hidden">
                          Phone
                        </span>
                        {user.phone}
                      </div>
                      <div className="break-all text-sm text-admin-muted">
                        <span className="mr-2 text-[10px] font-bold uppercase text-admin-accent md:hidden">
                          Email
                        </span>
                        {user.email}
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${user.role === "Admin" ? "bg-fuchsia-400/20 text-fuchsia-300" : user.role === "Manager" ? "bg-blue-400/20 text-blue-300" : "bg-slate-400/20 text-slate-200"}`}
                        >
                          <Shield size={13} />
                          {user.role}
                        </span>
                        {user.role === "Customer" && (
                          <p className={`mt-1 text-[11px] font-semibold ${user.verified ? "text-emerald-300" : "text-amber-300"}`}>
                            {user.verified ? "Verified" : "Not verified"}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 justify-self-start md:justify-self-end">
                        {user.role === "Customer" && (
                          <button
                            type="button"
                            onClick={() => toggleVerified(user)}
                            aria-label={user.verified ? `Unverify ${user.name}` : `Verify ${user.name}`}
                            title={user.verified ? "Unverify" : "Verify"}
                            className={`text-xs font-semibold ${user.verified ? "text-amber-300 hover:text-amber-100" : "text-emerald-300 hover:text-emerald-100"}`}
                          >
                            {user.verified ? "Unverify" : "Verify"}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setEditingUser({ ...user })}
                          aria-label={`Edit ${user.name}`}
                          title={`Edit ${user.name}`}
                          className="text-admin-muted transition hover:text-admin-accent"
                        >
                          <Pencil size={19} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeUser(user)}
                          aria-label={`Delete ${user.name}`}
                          title={`Delete ${user.name}`}
                          className="text-red-300 transition hover:text-red-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {usersError && (
                  <p className="p-4 text-center text-sm text-red-300">
                    Unable to load users from the API.
                  </p>
                )}
                {visibleUsers.length === 0 && (
                  <p className="p-10 text-center text-admin-muted">
                    No users match these filters.
                  </p>
                )}
              </div>
            </section>
          ) : activeItem === "Parts still in stock" ? (
            <section className="max-w-7xl">
              <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-admin-accent">
                    Inventory control
                  </p>
                  <h1 className="text-4xl font-bold text-admin-ink">
                    Parts in stock
                  </h1>
                  <p className="mt-2 text-sm text-admin-muted">
                    View available parts and add new inventory records.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(true)}
                  className="flex items-center gap-2 rounded-lg bg-admin-accent px-5 py-3 text-sm font-bold text-admin-700 shadow-lg transition hover:bg-admin-accentSoft"
                >
                  <PackagePlus size={18} />
                  Add product
                </button>
              </div>

              <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-admin-accent/20 bg-admin-900/50 p-3">
                <div className="relative min-w-[240px] flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8aa8b7]"
                    size={18}
                  />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search parts, vehicles, or part numbers"
                    className="w-full rounded-lg border border-admin-accent/20 bg-admin-surface py-3 pl-10 pr-4 text-sm text-admin-ink outline-none transition focus:border-admin-accent"
                  />
                </div>
                <div className="rounded-lg border border-admin-accent/20 px-4 py-3 text-sm text-admin-muted">
                  {visibleProducts.length} products shown
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 md:grid-cols-2">
                {visibleProducts.map((product) => (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-xl border border-admin-accent/20 bg-admin-panel/95 shadow-xl"
                  >
                    <div
                      className={`relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-admin-800 via-admin-900 to-admin-panel product-${product.tone}`}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain p-3"
                        />
                      ) : (
                        <div className="product-shape" aria-hidden="true" />
                      )}
                      <span className="absolute left-4 top-4 rounded bg-[#2b9c2b] px-3 py-1 text-xs font-bold text-white">
                        IN STOCK
                      </span>
                      <span className="absolute right-4 top-4 text-xs font-semibold text-admin-muted">
                        {product.quantity} available
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-bold text-admin-ink">
                            {product.name}
                          </h2>
                          <p className="mt-1 text-sm text-admin-muted">
                            {product.vehicle}
                          </p>
                        </div>
                        <span className="rounded-full border border-admin-accent/30 px-2 py-1 text-[10px] uppercase tracking-wider text-admin-accent">
                          {product.category || "General"}
                        </span>
                      </div>
                      <p className="border-b border-admin-accent/20 pb-4 text-xs text-admin-muted">
                        Part No: {product.partNo}
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="text-lg font-bold text-[#ff5f5f]">
                          {product.price}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeProduct(product)}
                          aria-label={`Delete ${product.name}`}
                          title="Delete product"
                          className="flex items-center gap-1.5 rounded-lg border border-red-400/30 px-3 py-2 text-xs font-semibold text-red-300 transition hover:border-red-400 hover:bg-red-500/15 hover:text-white"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              {visibleProducts.length === 0 && (
                <p className="rounded-xl border border-admin-accent/20 bg-admin-900/40 p-10 text-center text-admin-muted">
                  No inventory matches that search.
                </p>
              )}
            </section>
          ) : (
            <section className="max-w-7xl">
              <div className="mb-12">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-admin-accent">
                  Dashboard overview
                </p>
                <h1 className="text-4xl font-bold text-admin-ink">
                  Business metrics
                </h1>
                <p className="mt-3 text-sm text-admin-muted">
                  Quick overview of your sales, inventory, and activity.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card) => (
                  <div
                    key={card.label}
                    className="overflow-hidden rounded-xl border border-admin-accent/20 bg-gradient-to-br from-admin-800/40 to-admin-panel/40 shadow-lg backdrop-blur-sm transition hover:border-admin-accent/40 hover:shadow-xl hover:shadow-admin-accent/10"
                  >
                    <div className="p-6">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-admin-accent/70">
                        {card.label}
                      </p>
                      <p className="mt-4 text-4xl font-black leading-none tracking-tight text-admin-ink">
                        {card.value}
                      </p>
                    </div>
                    <div className="h-1 bg-admin-gradient" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {showAddProduct && (
          <div className="absolute inset-0 z-30 flex items-start justify-center overflow-y-auto bg-black/75 p-6 backdrop-blur-sm">
            <form
              onSubmit={addProduct}
              className="my-auto max-h-[calc(100vh-3rem)] w-full max-w-xl overflow-y-auto rounded-2xl border border-[#5cd9e0]/30 bg-[#101a20] p-7 shadow-2xl [scrollbar-color:#5cd9e0_#101a20] [scrollbar-width:thin]"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#5cd9e0]">
                    Inventory record
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-admin-ink">
                    Add product
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="text-admin-muted transition hover:text-admin-ink"
                  aria-label="Close add product form"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { key: "name", label: "Product name" },
                  { key: "brand", label: "Brand" },
                  { key: "model", label: "Model" },
                  { key: "partNo", label: "Part number" },
                  { key: "category", label: "Category" },
                  { key: "description", label: "Description" },
                  { key: "quantity", label: "Quantity", type: "number" },
                  { key: "price", label: "Price" },
                ].map((field) => (
                  <label key={field.key} className="text-sm text-admin-muted">
                    {field.label}
                    <input
                      required={
                        field.key !== "category" && field.key !== "price"
                      }
                      type={field.type || "text"}
                      value={newProduct[field.key]}
                      onChange={(event) =>
                        setNewProduct({
                          ...newProduct,
                          [field.key]: event.target.value,
                        })
                      }
                      className="mt-2 w-full rounded-lg border border-admin-accent/20 bg-admin-900 px-3 py-3 text-admin-ink caret-admin-accent placeholder:text-admin-text outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent"
                      style={{
                        color: "#f8fafc",
                        WebkitTextFillColor: "#f8fafc",
                      }}
                    />
                  </label>
                ))}
                <label className="text-sm text-admin-muted sm:col-span-2">
                  Spare-part image
                  <span className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-admin-accent/50 bg-admin-900 px-4 py-5 text-center transition hover:border-admin-accent hover:bg-admin-800">
                    <span className="font-semibold text-admin-accentSoft">
                      Click to choose an image
                    </span>
                    <span className="mt-1 text-xs text-admin-muted">
                      JPG, PNG, or WebP spare-part photo
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleProductImage}
                      className="sr-only"
                    />
                  </span>
                  {newProduct.image && (
                    <img
                      src={newProduct.image}
                      alt="Selected spare part preview"
                      className="mt-3 h-28 w-full rounded-lg border border-[#5cd9e0]/30 bg-[#080d10] object-contain p-2"
                    />
                  )}
                </label>
              </div>
              <button
                type="submit"
                className="mt-6 w-full rounded-lg bg-[#5cd9e0] py-3 font-bold text-[#102b40] transition hover:bg-white"
              >
                Save to inventory
              </button>
            </form>
          </div>
        )}

        {editingUser && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/75 p-6 backdrop-blur-sm">
            <form
              onSubmit={saveUser}
              className="w-full max-w-lg rounded-2xl border border-[#5cd9e0]/30 bg-[#101a20] p-7 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#5cd9e0]">
                    User profile
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-white">
                    Edit {editingUser.name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="text-[#b0d4e3] transition hover:text-white"
                  aria-label="Close edit user form"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="grid gap-4">
                <label className="text-sm text-[#b0d4e3]">
                  Phone number
                  <input
                    required
                    value={editingUser.phone}
                    onChange={(event) =>
                      setEditingUser({
                        ...editingUser,
                        phone: event.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-lg border border-white/10 bg-[#080d10] px-3 py-3 text-white outline-none focus:border-[#5cd9e0]"
                  />
                </label>
                <label className="text-sm text-[#b0d4e3]">
                  Email address
                  <input
                    required
                    type="email"
                    value={editingUser.email}
                    onChange={(event) =>
                      setEditingUser({
                        ...editingUser,
                        email: event.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-lg border border-white/10 bg-[#080d10] px-3 py-3 text-white outline-none focus:border-[#5cd9e0]"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="mt-6 w-full rounded-lg bg-[#5cd9e0] py-3 font-bold text-[#102b40] transition hover:bg-white"
              >
                Save changes
              </button>
            </form>
          </div>
        )}

        {showAddUser && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/75 p-6 backdrop-blur-sm">
            <form
              onSubmit={addUser}
              className="w-full max-w-lg rounded-2xl border border-[#5cd9e0]/30 bg-[#101a20] p-7 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#5cd9e0]">
                    Access management
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-white">
                    Add new user
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="text-[#b0d4e3] transition hover:text-white"
                  aria-label="Close add user form"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-[#b0d4e3]">
                  Full name
                  <input
                    required
                    value={newUser.name}
                    onChange={(event) =>
                      setNewUser({ ...newUser, name: event.target.value })
                    }
                    className="mt-2 w-full rounded-lg border border-white/20 bg-[#080d10] px-3 py-3 text-[#f8fafc] caret-[#5cd9e0] placeholder:text-[#8aa8b7] outline-none focus:border-[#5cd9e0] focus:ring-1 focus:ring-[#5cd9e0]"
                    style={{ color: "#f8fafc", WebkitTextFillColor: "#f8fafc" }}
                  />
                </label>
                <label className="text-sm text-[#b0d4e3]">
                  Phone number
                  <input
                    required
                    value={newUser.phone}
                    onChange={(event) =>
                      setNewUser({ ...newUser, phone: event.target.value })
                    }
                    className="mt-2 w-full rounded-lg border border-white/20 bg-[#080d10] px-3 py-3 text-[#f8fafc] caret-[#5cd9e0] placeholder:text-[#8aa8b7] outline-none focus:border-[#5cd9e0] focus:ring-1 focus:ring-[#5cd9e0]"
                    style={{ color: "#f8fafc", WebkitTextFillColor: "#f8fafc" }}
                  />
                </label>
                <label className="text-sm text-[#b0d4e3] sm:col-span-2">
                  Email address
                  <input
                    required
                    type="email"
                    value={newUser.email}
                    onChange={(event) =>
                      setNewUser({ ...newUser, email: event.target.value })
                    }
                    className="mt-2 w-full rounded-lg border border-white/20 bg-[#080d10] px-3 py-3 text-[#f8fafc] caret-[#5cd9e0] placeholder:text-[#8aa8b7] outline-none focus:border-[#5cd9e0] focus:ring-1 focus:ring-[#5cd9e0]"
                    style={{ color: "#f8fafc", WebkitTextFillColor: "#f8fafc" }}
                  />
                </label>
                <label className="text-sm text-[#b0d4e3] sm:col-span-2">
                  Password for Admin access
                  <input 
                    required={newUser.role === "Admin"} 
                    type="password" 
                    value={newUser.password} 
                    onChange={(event) => 
                      setNewUser({ ...newUser, password: event.target.value })
                    } 
                    placeholder="Required for Admin role" 
                    className="mt-2 w-full rounded-lg border border-white/20 bg-[#080d10] px-3 py-3 text-[#f8fafc] caret-[#5cd9e0] placeholder:text-[#8aa8b7] outline-none focus:border-[#5cd9e0] focus:ring-1 focus:ring-[#5cd9e0]" 
                    style={{ color: "#f8fafc", WebkitTextFillColor: "#f8fafc" }} 
                  />
                </label>
                <label className="text-sm text-[#b0d4e3] sm:col-span-2">Role
                  <select 
                    value={newUser.role} 
                    onChange={(event) => 
                      setNewUser({ ...newUser, role: event.target.value })
                    } 
                    className="mt-2 w-full rounded-lg border border-white/20 bg-[#080d10] px-3 py-3 text-[#f8fafc] caret-[#5cd9e0] outline-none focus:border-[#5cd9e0] focus:ring-1 focus:ring-[#5cd9e0]" 
                    style={{ color: "#f8fafc", WebkitTextFillColor: "#f8fafc" }}
                  >

                    <option>Customer</option>
                    <option>Manager</option>
                    <option>Admin</option>
                  </select>
                </label>
              </div>
              <button
                type="submit"
                className="mt-6 w-full rounded-lg bg-[#5cd9e0] py-3 font-bold text-[#102b40] transition hover:bg-white"
              >
                Save user
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
