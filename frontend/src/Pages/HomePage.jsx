import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/homepage.css";
import ServiceCard from "../components/ServiceCard";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE = "http://localhost:8000/api";

  const queryParams = new URLSearchParams(location.search);
  const initialSearchTerm = queryParams.get("search") || "";

  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
    from: 0,
    to: 0,
  });

  const checkLoginStatus = () => {
    const adminToken = localStorage.getItem("admin_token");
    const userToken = localStorage.getItem("token");
    setIsLoggedIn(!!(adminToken || userToken));
    setIsAdmin(!!adminToken);
  };

  const getAuthHeaders = () => {
    const adminToken = localStorage.getItem("admin_token");
    const userToken = localStorage.getItem("token");
    const token = adminToken || userToken;
    return { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" };
  };

  const fetchProfile = () => {
    if (!isLoggedIn) return;
    const endpoint = isAdmin ? `${API_BASE}/admin/profile` : `${API_BASE}/profile`;
    fetch(endpoint, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => { if (data.success) setProfile(isAdmin ? data.admin : data.user); })
      .catch((err) => console.error(err));
  };

  const fetchServices = (page = 1, search = searchTerm) => {
    setLoading(true);
    const url = search
      ? `${API_BASE}/search?search=${encodeURIComponent(search)}&per_page=${pagination.per_page}&page=${page}`
      : `${API_BASE}/services?per_page=${pagination.per_page}&page=${page}`;

    fetch(url, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => {
        const svcData = data.services; // always read services from API
        setServices(svcData.data || []);
        setPagination({
          current_page: svcData.current_page || 1,
          last_page: svcData.last_page || 1,
          per_page: svcData.per_page || 12,
          total: svcData.total || 0,
          from: svcData.from || 0,
          to: svcData.to || 0,
        });
      })
      .catch((err) => { console.error(err); setServices([]); })
      .finally(() => setLoading(false));
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    navigate(`?search=${encodeURIComponent(searchTerm)}`);
    fetchServices(1, searchTerm);
  };

  const handlePageChange = (page) => { if (page >= 1 && page <= pagination.last_page) fetchServices(page, searchTerm); };
  const handlePrevious = () => handlePageChange(pagination.current_page - 1);
  const handleNext = () => handlePageChange(pagination.current_page + 1);

  const getPageNumbers = () => {
    const pages = [];
    const current = pagination.current_page;
    const last = pagination.last_page;
    if (current > 3) pages.push(1);
    if (current > 4) pages.push("...");
    for (let i = Math.max(1, current - 2); i <= Math.min(last, current + 2); i++) pages.push(i);
    if (current < last - 3) pages.push("...");
    if (current < last - 2) pages.push(last);
    return pages;
  };

  useEffect(() => { checkLoginStatus(); }, []);
  useEffect(() => { fetchProfile(); fetchServices(pagination.current_page, initialSearchTerm); }, [isLoggedIn]);

  return (
    <div className="homepage-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Find Perfect Services</h1>
          <p className="hero-subtitle">Connect with trusted service providers in your area</p>
        </div>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-container">
          <input type="text" placeholder="Search with job name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input"/>
          <button type="submit" className="search-btn">🔍 Search</button>
        </form>
      </div>

      {isLoggedIn && (isAdmin || profile?.is_verified) && (
        <div className="action-section">
          <div className="action-buttons">
            <Link to="/service-form" className="action-btn create-btn">➕ Create Service</Link>
            {isAdmin ? (
              <Link to="/delete-service" className="action-btn delete-btn">🗑️ Delete All Services</Link>
            ) : (
              <Link to="/delete-my-service" className="action-btn delete-btn">🗑️ Delete My Services</Link>
            )}
          </div>
        </div>
      )}

      <div className="services-section">
        <div className="services-container">
          <h2 className="section-title">Available Services</h2>
          <p className="section-subtitle">Browse through our wide range of professional services</p>

          {loading ? (
            <div className="loading-container"><div className="loading-spinner"></div></div>
          ) : services.length === 0 ? (
            <div className="no-services-state">
              <div className="no-services-icon">🔍</div>
              <h3 className="no-services">No services found</h3>
              <p className="no-services-subtitle">Try adjusting your search terms or check back later</p>
            </div>
          ) : (
            <>
              <div className="all-cards-container">
                {services.map(service =>
                  service.is_booked ? (
                    <div key={service.services_id} className="service-card-link unavailable">
                      <ServiceCard service={service} />
                      <div className="overlay">Unavailable</div>
                    </div>
                  ) : (
                    <Link key={service.services_id} to={`/service/${service.services_id}`} className="service-card-link">
                      <ServiceCard service={service} />
                    </Link>
                  )
                )}
              </div>

              {pagination.last_page > 1 && (
                <div className="pagination-container">
                  <button onClick={handlePrevious} disabled={pagination.current_page === 1} className={`pagination-btn ${pagination.current_page === 1 ? "disabled" : ""}`}>← Previous</button>
                  <div className="pagination-info">
                    <span>Showing {pagination.from}-{pagination.to} of {pagination.total} services</span>
                    <div className="page-numbers">
                      {getPageNumbers().map((page, idx) =>
                        page === "..." ? (
                          <span key={idx} className="page-number">...</span>
                        ) : (
                          <button key={page} onClick={() => handlePageChange(page)} className={`page-number ${page === pagination.current_page ? "active" : ""}`}>{page}</button>
                        )
                      )}
                    </div>
                  </div>
                  <button onClick={handleNext} disabled={pagination.current_page === pagination.last_page} className={`pagination-btn ${pagination.current_page === pagination.last_page ? "disabled" : ""}`}>Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
