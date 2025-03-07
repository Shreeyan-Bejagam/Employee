import React, { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext, useNavigate } from "react-router-dom";  // Added useNavigate

const AssetRequests = () => {
  const { user } = useOutletContext();
  const navigate = useNavigate();  // Navigation hook for page redirect
  const [myAssets, setMyAssets] = useState([]);
  const [allAssets, setAllAssets] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log("🔍 Debug: User Data in AssetRequests.jsx", user);
  }, [user]);

  // ✅ Fetch "My Assets" where the logged-in user is the liable person
  useEffect(() => {
    if (!user || !user.name) return;

    axios.get(`http://localhost:3001/auth/my_assets/${user.name}`)
      .then(response => {
        if (response.data.Status) {
          setMyAssets([...response.data.Result]);
        } else {
          console.error("❌ Error fetching My Assets:", response.data.Error);
        }
      })
      .catch(err => console.error("❌ Network Error fetching My Assets:", err));
  }, [user]);

  // ✅ Fetch "All Assets" for requesting
  useEffect(() => {
    axios.get("http://localhost:3001/auth/assets")
      .then(response => {
        if (response.data.Status) {
          setAllAssets(response.data.Result);
        } else {
          console.error("❌ Error fetching All Assets:", response.data.Error);
        }
      })
      .catch(err => console.error("❌ Network Error fetching All Assets:", err));
  }, []);

  // 🔹 Handle search functionality
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  // 🔹 Navigate to full Indent Form page
  const handleNewAssetRequest = () => {
    navigate("/request-indent");   // Redirect to Indent Form page
  };

  return (
    <div className="container mt-3">
      {/* My Assets Section */}
      <h3>My Assets</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Current Holder</th>
          </tr>
        </thead>
        <tbody>
          {myAssets.length > 0 ? (
            myAssets.map((asset, index) => (
              <tr key={index}>
                <td>{asset.asset_name || "Unknown Asset"}</td>
                <td>{asset.current_holder || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center text-danger">
                No assets assigned
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* All Assets Section with "Request New Asset" Button */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h3>All Assets</h3>
        <button className="btn btn-success" onClick={handleNewAssetRequest}>
          + Request New Asset
        </button>
      </div>
      <input
        type="text"
        placeholder="Search Assets..."
        className="form-control mb-3"
        value={search}
        onChange={handleSearch}
      />
      <table className="table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Liable Person</th>
            <th>Request</th>
          </tr>
        </thead>
        <tbody>
          {allAssets
            .filter(asset => asset.asset_name.toLowerCase().includes(search.toLowerCase()))
            .map((asset, index) => (
              <tr key={index}>
                <td>{asset.asset_name}</td>
                <td>{asset.liable_person}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => console.log("Requesting existing asset")}>
                    Request
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetRequests;
