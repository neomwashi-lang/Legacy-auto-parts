{/*Ryan Mbugua*/}
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import legacyAutoLogo from "../assets/legacyauto.png";
import toyotaLogo from "../assets/toyotaLogo.png";
import nissanLogo from "../assets/nissanLogo.png";
import fordLogo from "../assets/fordLogo.png";
import subaruLogo from "../assets/subaruLogo.png";

const categories = [
  { name: "Toyota Parts", icon: toyotaLogo, brand: "Toyota" },
  { name: "Nissan Parts", icon: nissanLogo, brand: "Nissan" },
  { name: "Ford Parts", icon: fordLogo, brand: "Ford" },
  { name: "Subaru Parts", icon: subaruLogo, brand: "Subaru" },
];


function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [cart, setCart] = useState(0);
  const navigate = useNavigate();

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="garage-page">
      {/* TOP BAR */}
      <div className="top-bar">
        <div className="container top-bar-content">
          <span>🚗 Genuine Parts • Professional Service</span>
          <span>Mon - Sat: 8:00 AM - 6:00 PM</span>
        </div>
      </div>

      {/* HEADER */}
      <header className="header">
        <div className="container header-main">
          <a href="#" className="logo">
            <img
              src={legacyAutoLogo}
              alt="Legacy Auto"
              style={{ height: "55px", width: "auto" }}
            />
            <span>Legacy</span><span>Auto</span>
          </a>

          <form className="desktop-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search for products, parts or services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">⌕</button>
          </form>

          <div className="header-right">
            <a href="tel:+254707177362" className="phone">
              <small>Call us</small>
              <strong>+254 707 177 362</strong>
            </a>

            <Link to="/Cart" className="cart">
              🛒
              <span>{cart}</span>
            </Link>

            <button
              className="mobile-menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className={`navigation ${menuOpen ? "show" : ""}`}>
          <div className="container nav-content">
            <div className="category-dropdown">
              <button
                className="category-button"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
              >
                ☰ &nbsp; All Categories
              </button>
              {categoriesOpen && (
                <div className="category-dropdown-menu">
                  {categories.map((category) => (
                    <Link
                      key={category.brand}
                      to={`/shop?brand=${category.brand}`}
                      onClick={() => setCategoriesOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="nav-links">
              <a href="#home" onClick={() => setMenuOpen(false)}>
                Home
              </a>

              <a href="#categories" onClick={() => setMenuOpen(false)}>
                Categories
              </a>

              <a href="#services" onClick={() => setMenuOpen(false)}>
                Services
              </a>

              <a href="#about" onClick={() => setMenuOpen(false)}>
                About Us
              </a>

              <Link to="/shop" onClick={() => setMenuOpen(false)}>
                Products
              </Link>

              <a href="#contact" onClick={() => setMenuOpen(false)}>
                Contact
              </a>
            </div>

            <a
              className="whatsapp-button"
              href="https://wa.me/+254707177362"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp Us
            </a>
          </div>
        </nav>

        {/* MOBILE SEARCH */}
        <form className="container mobile-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button>⌕</button>
        </form>
      </header>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-overlay"></div>

        <div className="container hero-content">
          <div className="hero-text">
            <span className="red-label">YOUR TRUSTED AUTO PARTNER</span>

            <h1>
              Keep Your Car
              <br />
              <span>Running Better.</span>
            </h1>

            <p>
              Quality spare parts, reliable automotive service and expert
              support — all in one place.
            </p>

            <div className="hero-buttons">
              <Link to="/shop" className="btn btn-accent">
                Shop Parts →
              </Link>

              <a href="#services" className="btn btn-outline">
                Our Services
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <strong>100%</strong>
                <span>Genuine Parts</span>
              </div>

              <div>
                <strong>10+</strong>
                <span>Years Experience</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>WhatsApp Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories section" id="categories">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-label">SHOP BY CATEGORY</span>

              <h2>Find the right parts for your car</h2>
            </div>

            <Link to="/shop">View all</Link>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <Link
                to={`/shop?brand=${category.brand}`}
                className="category-card"
                key={category.name}
              >
                <div className="category-icon">
                  <img src={category.icon} alt={category.name} />
                </div>

                <h3>{category.name}</h3>

                <p>Quality products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* RED PROMOTION */}
      <section className="promotion">
        <div className="container promotion-content">
          <div>
            <span className="red-label">LIMITED TIME OFFER</span>

            <h2>
              Save on selected
              <br />
              <span>automotive essentials.</span>
            </h2>

            <p>Great prices on selected service and replacement parts.</p>
          </div>

          <Link to="/shop" className="btn btn-light">
            Shop Deals →
          </Link>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services section" id="services">
        <div className="container">
          <div className="center-heading">
            <span className="section-label">WHAT WE DO</span>

            <h2>More than just spare parts</h2>

            <p>
              Professional automotive solutions designed to keep you safely on
              the road.
            </p>
          </div>

          <div className="service-grid">
            <div className="service-card">
              <div className="service-icon">🔧</div>

              <h3>Auto Repairs</h3>

              <p>
                Professional diagnosis, repair and maintenance for your vehicle.
              </p>

              <a href="#contact">Learn more →</a>
            </div>

            <div className="service-card">
              <div className="service-icon">🛠️</div>

              <h3>Routine Service</h3>

              <p>
                Oil changes, filters, brakes and scheduled vehicle maintenance.
              </p>

              <a href="#contact">Book service →</a>
            </div>

            <div className="service-card">
              <div className="service-icon">🔍</div>

              <h3>Parts Sourcing</h3>

              <p>
                Tell us what you need and our team will help you find the right
                part.
              </p>

              <a href="#contact">Ask us →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about section" id="about">
        <div className="container about-grid">
          <div className="about-photo">
            <div className="about-badge">
              <strong>10+</strong>
              <span>Years Experience</span>
            </div>
          </div>

          <div className="about-text">
            <span className="section-label">WHY CHOOSE US</span>

            <h2>Quality parts. Honest advice. Reliable service.</h2>

            <p>
              We help drivers and vehicle owners find dependable parts and
              professional automotive support without the guesswork.
            </p>

            <ul>
              <li>✓ Genuine and quality-tested parts</li>
              <li>✓ Experienced automotive team</li>
              <li>✓ Competitive prices</li>
              <li>✓ Fast customer support via WhatsApp</li>
            </ul>

            <a href="#contact" className="btn btn-dark">
              Talk to our team →
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="contact-cta" id="contact">
        <div className="container cta-content">
          <div>
            <span className="red-label">NEED A PART?</span>

            <h2>Can't find what you're looking for?</h2>

            <p>
              Send us your vehicle model and the part you need. We'll help you
              check availability.
            </p>
          </div>

          <a
            href="https://wa.me/+254707177362"
            target="_blank"
            rel="noreferrer"
            className="btn btn-light"
          >
            Chat on WhatsApp →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <a href="#" className="logo footer-logo">
              <img
                src={legacyAutoLogo}
                alt="Legacy Auto"
                style={{ height: "50px", width: "auto" }}
              />
            </a>

            <p>
              Your trusted partner for genuine car parts, automotive service and
              expert support.
            </p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <a href="#about">About Us</a>
            <a href="#services">Services</a>
            <a href="#products">Products</a>
            <a href="#contact">Contact</a>
            <Link to="/admin">Admin Dashboard</Link>
          </div>

          <div>
            <h4>Categories</h4>
            <a href="#products">Toyota Parts</a>
            <a href="#products">Nissan Parts</a>
            <a href="#products">Ford Parts</a>
            <a href="#products">Subaru Parts</a>
          </div>

          <div>
            <h4>Contact</h4>
            <p>📍 Nairobi, Kenya</p>
            <p>☎ +254 707 177 362</p>
            <p>✉ legacyauto@gmail.com</p>
          </div>
        </div>

        <div className="copyright">
          <div className="container">
            © 2026 Legacy Auto Parts. All rights reserved.
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      <a
        className="floating-whatsapp"
        href="https://wa.me/+254707177362"
        target="_blank"
        rel="noreferrer"
      >
        ☎
      </a>
    </div>
  );
}

export default LandingPage;
