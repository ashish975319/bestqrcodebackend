import React, { useEffect, useState } from "react";
import {
  FaBuilding,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaPhone,
  FaShareAlt,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { API_URLS } from "../api/apiConfig";

const ScannedData = () => {
  const location = useLocation();
  const [data, setData] = useState(null);
  const [activeSection, setActiveSection] = useState("contact");

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(location.search);
      const secureKey = params.get("secureKey");

      if (secureKey) {
        try {
          const response = await fetch(
            `${API_URLS.SCAN_DATA}?secureKey=${secureKey}`
          );
          const result = await response.json();
          setData(result);
        } catch (error) {
          console.error("Error fetching scanned data:", error);
        }
      }
    };

    fetchData();
  }, [location.search]);

  const handleSaveContact = () => {
    if (!data) return;

    const vCard = `
BEGIN:VCARD
VERSION:3.0
FN:${data.name || ""}
TEL;TYPE=WORK,VOICE:${data.landline || ""}
TEL;TYPE=CELL:${data.mobile || ""}
EMAIL:${data.email || ""}
ORG:${data.company || ""}
TITLE:${data.designation || ""}
ADR;TYPE=HOME:;;${data.address || ""}
END:VCARD
    `;
    const blob = new Blob([vCard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${
      data.name?.replace(/\s+/g, "_") || "contact"
    }_contact.vcf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (!data) {
    return <p className="text-center text-gray-700">Loading data...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="bg-orange-800 border border-red-900 shadow-lg flex-1 w-full mx-auto p-4">
        {/* Profile Section */}
        <div className="bg-orange-900 h-auto p-10 rounded-t-lg text-center border border-white">
          {data.photo ? (
            <img
              src={`data:image/jpeg;base64,${data.photo}`}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full mx-auto"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto flex items-center justify-center text-gray-700">
              No Photo
            </div>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-4">
            {data.name || "Loading..."}
          </h1>
          <span className="text-white">{data.designation || "Loading..."}</span>
          <div>
            <span className="text-white">{data.company || "Loading..."}</span>
          </div>
          {/* Icons Section */}
          <div className="mt-8 flex justify-center gap-10">
            <a
              href={`tel:${data.mobile}`}
              className="flex items-center justify-center bg-pink-600 text-white rounded-full p-3 hover:bg-pink-700 transition border border-white"
              title="Call"
            >
              <FaPhone size={24} />
            </a>
            <a
              href={`mailto:${data.email}`}
              className="flex items-center justify-center bg-pink-600 text-white rounded-full p-3 hover:bg-pink-700 transition border border-white"
              title="Email"
            >
              <FaEnvelope size={24} />
            </a>
            <button
              onClick={handleSaveContact}
              className="flex items-center justify-center bg-pink-600 text-white rounded-full p-3 hover:bg-pink-700 transition border border-white"
              title="Save Contact"
            >
              <FaShareAlt size={24} />
            </button>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="mt-8 flex justify-center gap-4 border p-2 rounded-md border-white">
          <button
            onClick={() => setActiveSection("contact")}
            className={`px-4 py-2 rounded-lg ${
              activeSection === "contact"
                ? "bg-orange-600 text-white"
                : "bg-orange-300 text-white"
            }`}
          >
            Contact Details
          </button>
          <button
            onClick={() => setActiveSection("address")}
            className={`px-4 py-2 rounded-lg ${
              activeSection === "address"
                ? "bg-orange-600 text-white"
                : "bg-orange-300 text-white"
            }`}
          >
            Address
          </button>
          <button
            onClick={() => setActiveSection("social")}
            className={`px-4 py-2 rounded-lg ${
              activeSection === "social"
                ? "bg-orange-600 text-white"
                : "bg-orange-300 text-white"
            }`}
          >
            Social Media
          </button>
        </div>

        {/* Data Display Section */}
        <div className="mt-10 border border-white p-4 mb-0">
          {activeSection === "contact" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <FaMobileAlt className="text-white" size={20} />
                <span className="text-white">
                  Mobile: {data.mobile || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <FaPhone className="text-white" size={20} />
                <span className="text-white">
                  Landline: {data.landline || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <FaEnvelope className="text-white" size={20} />
                <span className="text-white">Email: {data.email || "N/A"}</span>
              </div>
            </div>
          )}

          {activeSection === "address" && (
            <div className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-white" size={20} />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  data.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline"
              >
                Address: {data.address || "N/A"}
              </a>
            </div>
          )}

          {activeSection === "social" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <FaGlobe className="text-white" size={20} />
                <a
                  href={data.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:underline"
                >
                  Website: {data.website || "N/A"}
                </a>
              </div>
              <div className="flex items-center gap-4">
                <FaBuilding className="text-white" size={20} />
                <span className="text-white">
                  Company: {data.company || "N/A"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannedData;
