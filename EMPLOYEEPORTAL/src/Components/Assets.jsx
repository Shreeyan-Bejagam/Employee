import React, { useEffect, useState } from "react";
import axios from "axios";

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [type, setType] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAssets();
  }, [type]);

  const fetchAssets = () => {
    const endpoint = type === "All" ? "/auth/assets" : `/auth/assets/${type}`;
    axios
      .get(`http://localhost:3001${endpoint}`)
      .then((response) => {
        if (response.data.Status) {
          setAssets(response.data.Result);
          setFilteredAssets(response.data.Result);
        } else {
          alert("Failed to fetch assets");
        }
      })
      .catch((err) => console.error("Error fetching assets:", err));
  };

  // Handle search functionality
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearch(query);
    const filtered = assets.filter(asset => asset.asset_name.toLowerCase().includes(query));
    setFilteredAssets(filtered);
  };

  return (
    <div className="container mt-3">
      <h3>Assets</h3>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Assets by Name..."
        className="form-control mb-3"
        value={search}
        onChange={handleSearch}
      />

      {/* Filter Buttons */}
      <div className="mb-3">
        <button className="btn btn-info me-2" onClick={() => setType("All")}>All</button>
        <button className="btn btn-info me-2" onClick={() => setType("Hardware")}>Hardware</button>
        <button className="btn btn-info me-2" onClick={() => setType("Software")}>Software</button>
        <button className="btn btn-info me-2" onClick={() => setType("License")}>License</button>
        <button className="btn btn-info" onClick={() => setType("Other")}>Other</button>
      </div>

      {/* Assets Table */}
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Type</th>
            <th>Stock</th>
            <th>Date Issued</th>
            <th>Liable Person</th>
            <th>Serial Number</th>
            <th>Status</th>
            <th>Current Holder</th>
          </tr>
        </thead>

        <tbody>
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset, index) => (
              <tr key={asset.id}>
                <td>{index + 1}</td>
                <td>{asset.asset_name}</td>
                <td>{asset.asset_type}</td>
                <td>{asset.stock}</td>
                <td>{asset.date_issued}</td>
                <td>{asset.liable_person}</td>
                <td>{asset.serial_number || "N/A"}</td>
                <td>{asset.status}</td>
                <td>{asset.current_holder || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">No Assets Available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Assets;
