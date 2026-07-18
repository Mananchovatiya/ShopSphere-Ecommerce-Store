import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../components/ProductCard.jsx";
import Loader from "../components/Loader.jsx";
import api from "../services/api.js";
import "../styles/shop.css";

const CATEGORIES = [
  { slug: "", name: "All" },
  { slug: "electronics", name: "Electronics" },
  { slug: "fashion", name: "Fashion" },
  { slug: "home", name: "Home" },
  { slug: "books", name: "Books" },
  { slug: "sports", name: "Sports" },
];

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read query params into local state
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [data, setData] = useState({ products: [], pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Fetch products whenever any filter changes
  useEffect(() => {
    setLoading(true);
    const params = { search, category, minPrice, maxPrice, sort, page, limit: 12 };
    api
      .get("/products", { params })
      .then((res) => setData(res.data))
      .catch(() => setData({ products: [], pages: 1, total: 0 }))
      .finally(() => setLoading(false));

    // Sync filters into the URL so shares/back-button work
    const next = {};
    if (search) next.search = search;
    if (category) next.category = category;
    if (minPrice) next.minPrice = minPrice;
    if (maxPrice) next.maxPrice = maxPrice;
    if (sort && sort !== "newest") next.sort = sort;
    if (page > 1) next.page = page;
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, minPrice, maxPrice, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setPage(1);
  };

  return (
    <div className="shop container">
      <div className="shop-header">
        <div>
          <h1 className="page-title">Shop</h1>
          <p className="page-subtitle">{data.total} products available</p>
        </div>

        <div className="shop-header-actions">
          <label className="sort-control">
            Sort by:{" "}
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </label>

          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>
        </div>
      </div>

      <div className="shop-layout">
        {/* Sidebar filters */}
        <aside className="filters">
          <div className="filter-block">
            <h4>Category</h4>
            <ul className="category-list">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <button
                    className={`category-btn ${category === c.slug ? "active" : ""}`}
                    onClick={() => {
                      setCategory(c.slug);
                      setPage(1);
                    }}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <button className="btn btn-outline btn-block" onClick={resetFilters}>
            Reset Filters
          </button>
        </aside>

        {/* Product grid + sort + pagination */}
        <section className="shop-main">
          {loading ? (
            <Loader />
          ) : data.products.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {data.products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              {data.pages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Prev
                  </button>
                  <span>
                    Page {data.page} of {data.pages}
                  </span>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={page >= data.pages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Shop;