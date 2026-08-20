# Legacy Auto Parts

## Project Overview

Legacy Auto Parts is a React web application for an automotive spare-parts business. It has two main areas:

- A public storefront where customers can browse the business, categories, products, services, and contact information.
- A protected administrator portal where authorised administrators can manage inventory, prices, users, and product information.

The project uses Vite for development and production builds.

## Technologies Used

### React

React is used to build the user interface from reusable components. Each major page or feature is represented by a component.

Examples:

- `src/Components/LandingPage.jsx` contains the public storefront homepage.
- `src/products/ProductList.jsx` displays the product list.
- `src/products/ProductPage.jsx` displays one product and supports price editing.
- `src/Components/administratornavbar.jsx` contains the main administrator dashboard and its management controls.
- `src/Components/AdminLogin.jsx` contains the administrator login form.

React state is used for interactive values such as:

- Search text
- The selected administrator section
- Product and user lists
- Login form values
- Open and closed forms or navigation sections

## React Areas to Showcase

Use these examples to explain exactly where React is being used in the application.

### 1. React starts the application

File: `src/main.jsx`

```jsx
createRoot(document.getElementById('root')).render(
	<StrictMode>
		<App />
	</StrictMode>,
)
```

Presentation explanation: React attaches the `App` component to the HTML element with the id `root`. `StrictMode` helps identify potential problems while developing. This is the entry point for the entire React application.

### 2. Components create reusable interface sections

Files such as `LandingPage.jsx`, `ProductList.jsx`, `ProductPage.jsx`, and `AdminLogin.jsx` each export a React component. A component is a JavaScript function that returns JSX.

```jsx
function ProductList() {
	return <div>Product list content</div>
}

export default ProductList
```

Presentation explanation: Instead of writing one large webpage, the project separates the interface into focused components. This makes the code easier to maintain and allows each part of the website to have its own logic.

### 3. `useState` makes the interface interactive

File: `src/Components/AdminLogin.jsx`

```jsx
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [showPassword, setShowPassword] = useState(false)
```

Presentation explanation: `useState` stores values that can change while the user interacts with the page. When the user types, React updates the state and re-renders the input. The password visibility button also changes the `showPassword` state and switches the input between password and text mode.

Other examples:

- `ProductList.jsx` stores the product search term.
- `ProductPage.jsx` stores the editing state and draft price.
- `administratornavbar.jsx` stores the active dashboard section, users, products, and modal visibility.

### 4. Event handlers respond to user actions

File: `src/Components/AdminLogin.jsx`

```jsx
<input
	value={email}
	onChange={(event) => setEmail(event.target.value)}
	type="email"
/>

<form onSubmit={handleSubmit}>
	...
</form>
```

Presentation explanation: React event handlers connect the interface to JavaScript logic. `onChange` captures the user's input, while `onSubmit` runs the login process. The same pattern is used for search fields, product forms, role filters, navigation buttons, and sign-out.

### 5. `useEffect` handles side effects

File: `src/Components/administratornavbar.jsx`

```jsx
useEffect(() => {
	window.localStorage.setItem(usersStorageKey, JSON.stringify(users))
}, [users])
```

Presentation explanation: `useEffect` runs code after React renders when a dependency changes. Here, whenever the `users` state changes, the current users are saved to browser storage. This keeps admin user changes available after a page refresh.

The dashboard also uses an effect to copy products received from the API into React state.

### 6. React renders data with `map`

File: `src/Components/administratornavbar.jsx`

```jsx
{statCards.map((card) => (
	<div key={card.label}>
		<p>{card.label}</p>
		<p>{card.value}</p>
	</div>
))}
```

Presentation explanation: The dashboard does not repeat the same HTML manually for every statistic. React loops through the data and creates one interface block for each item. The `key` helps React track each rendered item efficiently.

The same approach renders navigation sections, products, users, and role filter buttons.

### 7. React filters data before rendering it

Files: `src/products/ProductList.jsx` and `src/Components/administratornavbar.jsx`

```jsx
const filteredProducts = (products || []).filter((product) =>
	product.name.toLowerCase().includes(searchTerm.toLowerCase())
)
```

Presentation explanation: The original product data is not changed. JavaScript creates a filtered list based on the user's search term, and React renders only the matching products. This is how the shop search and admin inventory search work.

### 8. React Router controls the pages

File: `src/App.jsx`

```jsx
<Routes>
	<Route path="/" element={<LandingPage />} />
	<Route path="/shop" element={<ProductList />} />
	<Route path="/product/:id" element={<ProductPage />} />
	<Route path="/admin" element={<ProtectedAdminRoute />} />
</Routes>
```

Presentation explanation: React Router maps URLs to React components. When a customer visits `/shop`, React displays `ProductList`. When a product id is included in the URL, `ProductPage` displays that specific product. The browser does not need to reload the whole application when moving between these routes.

### 9. Protected React routes control admin access

File: `src/App.jsx`

```jsx
function ProtectedAdminRoute() {
	const isAuthenticated =
		sessionStorage.getItem(adminSessionKey) === 'authenticated'

	return isAuthenticated ? (
		<AdminSidebar />
	) : (
		<Navigate to="/admin/login" replace />
	)
}
```

Presentation explanation: This component acts as a gate around the admin dashboard. If the session contains the authentication marker, React renders the dashboard. Otherwise, React Router redirects the visitor to the login page. The storefront remains public while the admin tools are restricted.

### 10. React communicates with the product API

Files: `src/hooks/useFetch.js` and `src/Components/administratornavbar.jsx`

```jsx
const { data: fetchedProducts, loading, error } = useFetch(
	'http://localhost:3000/products'
)
```

Presentation explanation: The reusable `useFetch` hook loads products from JSON Server and provides three pieces of state: the data, a loading status, and an error status. The dashboard displays `Loading products...` while waiting, an error message if the request fails, or the products when the request succeeds.

The admin dashboard also uses `POST` to add products, `PATCH` to update prices, and `DELETE` to remove products.

### 11. Conditional rendering displays the correct state

File: `src/Components/administratornavbar.jsx`

```jsx
{loading ? (
	<p>Loading products...</p>
) : error ? (
	<p>Error loading products: {error}</p>
) : (
	<ProductInventory />
)}
```

Presentation explanation: React can choose which JSX to render based on state. This gives the user immediate feedback during loading, handles errors clearly, and shows the real content only after the data is ready.

### 12. React props pass information into elements

The project passes values into HTML elements and components through props such as `className`, `value`, `src`, `alt`, and `onClick`.

```jsx
<img src={product.image} alt={product.name} />
<button onClick={() => removeProduct(product)}>Delete</button>
```

Presentation explanation: Props allow a component or element to receive information from the current product or user. This keeps the interface connected to the data and allows the same rendering pattern to work for many different products.

### JavaScript and JSX

JavaScript provides the application logic, while JSX allows JavaScript to describe the HTML-like interface.

Examples in the project include:

- `useState` stores changing values inside React components.
- `useEffect` runs side effects such as saving user data or updating fetched products.
- Array methods such as `map` render lists of products, users, navigation sections, and statistics.
- `filter` searches products and filters users by role.
- Event handlers such as `onClick`, `onChange`, and `onSubmit` respond to user actions.
- `fetch` sends requests to the local product API.

### React Router

React Router controls navigation without requiring a full page reload.

Routes are defined in `src/App.jsx`:

- `/` - public storefront
- `/shop` - product list
- `/product/:id` - individual product page
- `/admin/login` - administrator login
- `/admin` - protected administrator dashboard

`ProtectedAdminRoute` prevents unauthenticated users from opening the administrator dashboard. Users who are not authenticated are redirected to `/admin/login`.

### Tailwind CSS

Tailwind CSS is used for most of the dashboard layout and styling. Utility classes define:

- Flexbox and grid layouts
- Spacing and sizing
- Colours and borders
- Typography
- Responsive layouts
- Hover and focus states
- Modal and form appearance

Examples include classes such as `flex`, `grid`, `px-6`, `rounded-lg`, `text-white`, and responsive prefixes such as `md:` and `xl:`.

### Regular CSS

Regular CSS is used where shared or custom styling is needed.

- `src/index.css` contains global styles and Tailwind directives.
- `src/App.css` contains shared application and product visual styles.
- `src/Components/LandingPage.css` contains storefront-specific styling when used by the landing page.

### Lucide React

`lucide-react` provides interface icons instead of manually drawing icons. The administrator dashboard uses icons for navigation, search, editing, deleting, adding users, adding products, signing out, and security actions.

### Vite

Vite provides:

- The development server
- Fast module updates during development
- The production build process
- Integration with the React plugin

Commands are defined in `package.json`.

### JSON Server and Fetch API

The project includes `db.json` and a JSON Server command for local product data.

The `fetch` API is used to:

- Read products from `http://localhost:3000/products`
- Add products with `POST`
- Update prices with `PATCH`
- Delete products with `DELETE`

`src/hooks/useFetch.js` is a reusable hook for loading API data and tracking loading and error states.

## Important Files

| File | Responsibility |
| --- | --- |
| `src/main.jsx` | Starts React and renders the root application. |
| `src/App.jsx` | Defines the storefront, product, login, and protected admin routes. |
| `src/Components/LandingPage.jsx` | Public customer-facing storefront. |
| `src/products/ProductList.jsx` | Product search, product display, and brand filtering. |
| `src/products/ProductPage.jsx` | Individual product details and price editing. |
| `src/Components/AdminLogin.jsx` | Administrator login form and authentication check. |
| `src/auth/adminAuth.js` | Shared administrator session key, user storage key, default account data, and admin records. |
| `src/Components/administratornavbar.jsx` | Main working administrator dashboard. |
| `src/Components/AdminSidebar.jsx` | Earlier dashboard demonstration component. |
| `src/hooks/useFetch.js` | Reusable data-fetching hook. |
| `db.json` | Local JSON Server product data. |
| `tailwind.config.js` | Tailwind theme and custom admin colours. |
| `vite.config.js` | Vite and React configuration. |
| `package.json` | Dependencies and development scripts. |

## Administrator Authentication

Only users whose role is `Admin` can enter the administrator portal.

The login process is:

1. The user enters an email and password.
2. The application loads the configured administrator records and saved local users.
3. The email is compared without case differences.
4. The role must be `Admin`.
5. The password must match the saved password or the legacy default password for older demo Admin records.
6. A successful login stores an authentication marker in `sessionStorage`.
7. The user is redirected to `/admin`.
8. Signing out removes the session marker and returns the user to the login page.

Demo administrator account:

- Email: `emmanuel.admin@legacyauto.test`
- Password: `LegacyAdmin2026!`

This is a frontend demonstration. A production application should validate credentials on a secure backend and store password hashes instead of checking credentials in browser code.

## Administrator Features

The administrator can use the dashboard to:

- View business statistics
- View products in stock
- Search inventory
- Add a product
- Upload a product image
- Change a product price
- Delete a product
- View staff and customer records
- Filter users by role
- Search users
- Add users
- Edit user contact details
- Delete users
- Sign out of the administrator portal

## Running the Project

From the project directory:

```bash
npm install
npm run dev
```

The Vite application normally opens at:

```text
http://localhost:5173
```

To run the local product API in another terminal:

```bash
npm run server
```

The JSON Server API normally runs at:

```text
http://localhost:3000
```

To create a production build:

```bash
npm run build
```

To run lint checks:

```bash
npm run lint
```

## Suggested Presentation Explanation

> This project is a React and JavaScript spare-parts application. React divides the interface into components such as the landing page, product pages, login page, and administrator dashboard. JavaScript controls the state and behaviour, including searching, filtering, form submission, user management, and API requests. React Router provides navigation between the public storefront and the protected admin portal. Tailwind CSS and regular CSS provide the responsive design and visual styling. JSON Server provides a local API for products, while the Fetch API connects the frontend to that data. The admin login checks the user's role and redirects authorised administrators into the dashboard.

## Development Note

The source files contain `Emmanuel wema` markers in the files associated with Emmanuel's work so that contributions can be identified during the presentation. `package.json` is intentionally not marked with a JSX comment because JSON does not allow JSX comment syntax.

## Temporary Line-by-Line Explanation Appendix

This appendix is temporary for the presentation. It explains the important lines in the files associated with the administrator login and protected dashboard. It can be removed later without changing the application.

## Quick Explanation Finder

Use this section to move from a line in VS Code to the explanation below.

For an actual searchable reference, open [CODE_SEARCH.html](CODE_SEARCH.html) in a browser. Type a function name, file name, React hook, route, or technology into the search field. Each result shows the file, language or tool, and what that code does.

Examples to search for:

- `handleSubmit`
- `ProtectedAdminRoute`
- `useState`
- `useEffect`
- `fetch`
- `addProduct`
- `Tailwind CSS`

### VS Code Shortcuts

- `Ctrl+P`: open a file by typing its name, such as `App.jsx` or `AdminLogin.jsx`.
- `Ctrl+G`: jump directly to a line number in the active file.
- `Ctrl+Shift+F`: search the whole project for a function or variable name.
- `Ctrl+F`: search within the currently open file.

Line numbers may change when the code is edited. The symbol or search phrase is the most reliable way to find the explanation.

### Code-to-Explanation Index

| File and code search | Current line | Explanation heading in this README |
| --- | ---: | --- |
| `src/App.jsx` - `ProtectedAdminRoute` | 11 | `App.jsx` - protected route explanation |
| `src/App.jsx` - `<Route path=` | 23 | `App.jsx` - React Router route explanation |
| `src/App.jsx` - `BrowserRouter` | 7 | `App.jsx` - router imports explanation |
| `src/Components/AdminLogin.jsx` - `useState` | 2 | `AdminLogin.jsx` - React state explanation |
| `src/Components/AdminLogin.jsx` - `handleSubmit` | 16 | `AdminLogin.jsx` - form submission explanation |
| `src/Components/AdminLogin.jsx` - `matchingAdmin` | 27 | `AdminLogin.jsx` - administrator validation explanation |
| `src/Components/AdminLogin.jsx` - `<form onSubmit` | 54 | `AdminLogin.jsx` - form explanation |
| `src/Components/AdminLogin.jsx` - `showPassword` | 13 or 76 | `AdminLogin.jsx` - password visibility explanation |
| `src/auth/adminAuth.js` - `adminSessionKey` | 2 | `adminAuth.js` - shared constants explanation |
| `src/auth/adminAuth.js` - `initialUsers` | 6 | `adminAuth.js` - user records explanation |
| `src/Components/administratornavbar.jsx` - `navSections` | 34 | `administratornavbar.jsx` - navigation explanation |
| `src/Components/administratornavbar.jsx` - `AdminSidebar` | 52 | `administratornavbar.jsx` - dashboard component explanation |
| `src/Components/administratornavbar.jsx` - `useFetch` | 4 or 56 | `administratornavbar.jsx` - API hook explanation |
| `src/Components/administratornavbar.jsx` - `visibleProducts` | 122 | `administratornavbar.jsx` - filtering explanation |
| `src/Components/administratornavbar.jsx` - `addProduct` | 139 | `administratornavbar.jsx` - POST request explanation |
| `src/Components/administratornavbar.jsx` - `updateProductPrice` | 176 | `administratornavbar.jsx` - PATCH request explanation |

### Example Search

To explain the protected admin page during the presentation:

1. Press `Ctrl+P` and open `src/App.jsx`.
2. Press `Ctrl+F` and search for `ProtectedAdminRoute`.
3. Read the matching code in the editor.
4. Return to this README and search for `ProtectedAdminRoute` with `Ctrl+F`.
5. Use the explanation under the `App.jsx` section to describe the code.

To explain a product being added:

1. Open `src/Components/administratornavbar.jsx`.
2. Search for `addProduct`.
3. Explain that the function prevents a page reload, creates the product object, and sends it to JSON Server with a `POST` request.

To explain the administrator login:

1. Open `src/Components/AdminLogin.jsx`.
2. Search for `matchingAdmin`.
3. Find `matchingAdmin` in this README.
4. Explain that the code checks the user's role, email, and password before creating the session.

### `src/App.jsx`

```jsx
{/* Neo Mwashi */}
{/*Emmanuel wema*/}
```

These are contribution markers. They identify the developers who worked on this file. They do not affect the application.

```jsx
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
```

This imports React Router tools. `BrowserRouter` enables browser navigation, `Routes` groups the routes, `Route` defines one URL, and `Navigate` redirects a user.

```jsx
import './App.css'
```

This loads the shared CSS used by the application.

```jsx
import { adminSessionKey } from './auth/adminAuth.js'
```

This imports the name of the browser session value used to identify a logged-in administrator.

```jsx
import AdminLogin from './Components/AdminLogin.jsx'
import { AdminSidebar } from './Components/administratornavbar.jsx'
import LandingPage from './Components/LandingPage.jsx'
import ProductList from './products/ProductList.jsx'
import ProductPage from './products/ProductPage.jsx'
```

These lines import the React components that represent the login page, admin dashboard, storefront, product list, and individual product page.

```jsx
function ProtectedAdminRoute() {
```

This declares a React component whose purpose is to protect the admin page.

```jsx
const isAuthenticated =
	sessionStorage.getItem(adminSessionKey) === 'authenticated'
```

This reads the browser session. The result is `true` only when the login process previously stored the expected authentication value.

```jsx
return isAuthenticated ? (
	<AdminSidebar />
) : (
	<Navigate to="/admin/login" replace state={{ from: "/admin" }} />
)
```

This is a conditional expression. Authenticated users see the dashboard. Other users are redirected to the login page. `replace` prevents the protected URL from remaining in the browser history, and `state` remembers where the user wanted to go.

```jsx
function App() {
```

This declares the main React component for the application.

```jsx
<BrowserRouter>
	<Routes>
```

These components activate client-side routing and begin the list of URL rules.

```jsx
<Route path="/" element={<LandingPage />} />
```

The root URL displays the public storefront.

```jsx
<Route path="/shop" element={<ProductList />} />
```

The `/shop` URL displays the product catalogue.

```jsx
<Route path="/product/:id" element={<ProductPage />} />
```

The `:id` part is a dynamic route parameter. It allows one reusable component to display different products.

```jsx
<Route path="/admin/login" element={<AdminLogin />} />
<Route path="/admin" element={<ProtectedAdminRoute />} />
```

These routes provide the admin login and place the dashboard behind the protection component.

```jsx
export default App
```

This makes `App` available to `main.jsx`, where React starts the application.

### `src/Components/AdminLogin.jsx`

```jsx
{/*Emmanuel wema*/}
```

This is a temporary contribution marker for the presentation.

```jsx
import { useState } from 'react'
```

This imports the React hook used to store changing form values.

```jsx
import { Eye, EyeOff, LockKeyhole, LogIn, ShieldCheck } from 'lucide-react'
```

These imports provide reusable icons for security, the password field, login, and password visibility.

```jsx
import { useLocation, useNavigate } from 'react-router'
```

These hooks read the current route state and navigate the user to another route.

```jsx
import { adminSessionKey, defaultAdminPassword, initialUsers, usersStorageKey } from '../auth/adminAuth.js'
```

This imports the shared authentication data and storage names so the login page uses the same administrator records as the dashboard.

```jsx
function AdminLogin() {
```

This declares the login screen as a React component.

```jsx
const navigate = useNavigate()
const location = useLocation()
```

`navigate` changes the page through React Router. `location` lets the component know where the user originally tried to go.

```jsx
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [showPassword, setShowPassword] = useState(false)
const [error, setError] = useState('')
```

These four state values store the email, password, password visibility choice, and any login error message.

```jsx
const handleSubmit = (event) => {
	event.preventDefault()
```

This function handles form submission. `preventDefault` stops the browser from refreshing the page.

```jsx
let savedUsers = []
try {
	savedUsers = JSON.parse(localStorage.getItem(usersStorageKey) || '[]')
} catch {
	savedUsers = []
}
```

This reads users saved in the browser. `JSON.parse` converts stored text back into JavaScript data. The `try/catch` prevents a damaged storage value from crashing the login page.

```jsx
const allUsers = [...initialUsers, ...savedUsers]
```

The spread operator combines the built-in users with users created through the admin dashboard.

```jsx
const matchingAdmin = allUsers.find((user) => (
	user.role?.trim().toLowerCase() === 'admin' &&
	user.email?.trim().toLowerCase() === email.trim().toLowerCase() &&
	(user.password || defaultAdminPassword).trim() === password.trim()
))
```

`find` searches for one matching user. The three conditions require an Admin role, the correct email, and the correct password. Optional chaining (`?.`) prevents errors when a record is missing a value. `trim` and `toLowerCase` make the comparison more forgiving of spaces and email capitalisation.

```jsx
if (!matchingAdmin) {
	setError('The email or password is incorrect.')
	return
}
```

If no administrator matches, React stores an error message and stops the login function.

```jsx
sessionStorage.setItem(adminSessionKey, 'authenticated')
const destination = location.state?.from || '/admin'
navigate(destination, { replace: true })
```

These lines create the login session, choose the destination, and redirect the administrator into the portal.

```jsx
return (
	<main> ... </main>
)
```

The return statement contains the JSX that React displays. The semantic `main` element identifies the primary content of the page.

```jsx
<form onSubmit={handleSubmit}>
```

This connects the form to the JavaScript login function.

```jsx
<input
	value={email}
	onChange={(event) => setEmail(event.target.value)}
/>
```

This is a controlled React input. Its value comes from state, and every change updates state.

```jsx
type={showPassword ? 'text' : 'password'}
```

This changes the input type based on React state, allowing the user to show or hide the password.

```jsx
onClick={() => setShowPassword((visible) => !visible)}
```

This event handler reverses the current visibility value when the eye button is clicked.

```jsx
{error && <p role="alert">{error}</p>}
```

This is conditional rendering. The error paragraph appears only when an error message exists.

```jsx
export default AdminLogin
```

This exports the component so `App.jsx` can use it for `/admin/login`.

### `src/auth/adminAuth.js`

```jsx
// Emmanuel wema
```

This is a JavaScript comment used as a temporary contribution marker.

```jsx
export const adminSessionKey = 'legacy-auto-parts-admin-session'
export const usersStorageKey = 'legacy-auto-parts-users'
export const defaultAdminPassword = 'LegacyAdmin2026!'
```

These constants centralise the names used for browser storage and the legacy demo password. `export` allows other files to import them.

```jsx
export const initialUsers = [ ... ]
```

This exports the initial user records. Each object stores values such as an id, name, phone, email, and role. The login uses the `role` value to allow only administrators into the portal.

### `src/Components/administratornavbar.jsx`

```jsx
import { useEffect, useState } from "react";
```

This imports the React hooks used for dashboard state and side effects.

```jsx
import { Link } from "react-router";
import { useNavigate } from "react-router";
```

`Link` creates navigation back to the storefront. `useNavigate` redirects the user when signing out.

```jsx
import useFetch from "../hooks/useFetch";
```

This imports the reusable hook that loads product data from the API.

```jsx
import { BarChart3, ChevronDown, Home, LogOut, ... } from "lucide-react";
```

These are the icons used by the admin navigation, search controls, forms, security actions, and delete actions.

```jsx
const [activeItem, setActiveItem] = useState("Dashboard");
```

This stores which admin section is currently selected.

```jsx
const { data: fetchedProducts, loading, error } = useFetch(
	"http://localhost:3000/products"
);
```

This calls the custom data hook. The component receives product data, a loading flag, and an error value.

```jsx
const [products, setProducts] = useState([]);
```

This creates local React state for the products displayed and managed by the dashboard.

```jsx
useEffect(() => {
	if (fetchedProducts) {
		setProducts(fetchedProducts);
	}
}, [fetchedProducts]);
```

When the API returns products, this effect copies them into the component state. The dependency array means the effect runs when `fetchedProducts` changes.

```jsx
const [users, setUsers] = useState(() => { ... });
```

This initialises users from browser storage when possible, or falls back to the initial user list.

```jsx
const visibleProducts = products.filter((product) => ...);
const visibleUsers = users.filter((user) => ...);
```

These expressions create filtered views for search and role filtering without changing the original arrays.

```jsx
const addProduct = (event) => {
	event.preventDefault();
```

This begins the add-product event handler and prevents a full browser reload.

```jsx
fetch("http://localhost:3000/products", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify(productToSave),
})
```

This sends a new product to JSON Server. `JSON.stringify` converts the JavaScript object into JSON text for the request body.

```jsx
fetch(`http://localhost:3000/products/${productId}`, {
	method: "PATCH",
```

This updates only part of an existing product, such as its price.

```jsx
fetch(`http://localhost:3000/products/${product.id}`, {
	method: "DELETE",
})
```

This removes a product from the API.

```jsx
{navSections.map((section) => { ... })}
```

React loops through the navigation data and creates the sidebar sections dynamically.

```jsx
{activeItem === "Staff and users" ? (...) : activeItem === "Parts still in stock" ? (...) : (...) }
```

This conditional rendering chooses which admin workspace to display: users, inventory, price changes, or the dashboard overview.

```jsx
{visibleUsers.map((user) => (
	<div key={user.id}>...</div>
))}
```

This renders one user row for every filtered user. `key={user.id}` gives React a stable identifier for each row.

```jsx
onClick={() => {
	sessionStorage.removeItem(adminSessionKey);
	navigate("/admin/login", { replace: true });
}}
```

This is the sign-out action. It removes the session marker and sends the user back to the login screen.

## Short Presentation Summary for These Files

> In my part of the project, I used React components to build the administrator login and dashboard. I used `useState` for form values, selected dashboard sections, products, users, and modal visibility. I used `useEffect` to update React state when API data arrives and to keep browser storage synchronised. React Router connects the public storefront, product pages, login page, and protected admin route. The login checks the user's role and stores a session marker, while the protected route decides whether to render the dashboard or redirect to login. The admin dashboard uses `map` to render lists, `filter` for searching, conditional rendering for different sections, and `fetch` requests to manage products through JSON Server.

## Temporary Appendix Removal

When the presentation is finished, remove everything from the heading `Temporary Line-by-Line Explanation Appendix` to the end of this file. The application source code will not be affected.
