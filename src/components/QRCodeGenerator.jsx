import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaBuilding,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaPhone,
  FaUser,
} from "react-icons/fa";
import Footer from "../footer/Footer";
import { API_URLS } from "../api/apiConfig";

const QRCodeGenerator = () => {
  const [data, setData] = useState({
    name: "",
    landline: "",
    mobile: "",
    email: "",
    website: "",
    address: "",
    company: "",
    designation: "",
  });

  const [color, setColor] = useState("#000000");
  const [showPicker, setShowPicker] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URLS.GENERATE_QR_CODE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const secureKey = await response.text();
      const qrCodeUrl = `${window.location.origin}/scanned-data?secureKey=${secureKey}`;
      navigate("/qrcode", { state: { qrCodeUrl, color } });
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-6 max-w-xl mx-auto bg-gradient-to-r from-indigo-200 to-emerald-300 rounded-lg mb-20 mt-5 shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">
          QR Profile Generator
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          {Object.entries({
            name: FaUser,
            landline: FaPhone,
            mobile: FaMobileAlt,
            email: FaEnvelope,
            website: FaGlobe,
            address: FaMapMarkerAlt,
            company: FaBuilding,
            designation: FaBriefcase,
          }).map(([key, Icon]) => (
            <div key={key} className="flex items-center space-x-2">
              <Icon className="text-gray-500" />
              <input
                type="text"
                name={key}
                placeholder={capitalizeFirstLetter(key)}
                className="border p-1 w-full rounded-md"
                onChange={handleChange}
              />
            </div>
          ))}
          <div className="mb-4">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setShowPicker(!showPicker)}
                className="bg-blue-500 text-white py-1 px-3 rounded-md"
              >
                {showPicker ? "Hide Color Picker" : "Show Color Picker"}
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white py-1 px-3 rounded-md"
              >
                Generate QR Code
              </button>
            </div>
            {showPicker && (
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="mt-2 border-none"
              />
            )}
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

// Capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default QRCodeGenerator;
