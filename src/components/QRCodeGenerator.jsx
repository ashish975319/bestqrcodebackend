import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { API_URLS } from "../api/apiConfig";
import download from "../assets/download.png"; // Default logo image
import Footer from "../footer/Footer";

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

  const [photo, setPhoto] = useState(null); // Store file object
  const [photoURL, setPhotoURL] = useState(""); // Store URL for preview
  const [photoName, setPhotoName] = useState("");
  const [color, setColor] = useState("#000000");
  const [zoomed, setZoomed] = useState(null);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file); // Store the file object
      setPhotoName(file.name);
      // Create a URL for image preview
      setPhotoURL(URL.createObjectURL(file));
    }
  };

  const handleFocus = (e) => {
    setZoomed(e.target.name);
  };

  const handleBlur = () => {
    setZoomed(null);
  };

  const handleClickOutside = (e) => {
    if (e.target.tagName !== "INPUT") {
      setZoomed(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const validate = () => {
    const newErrors = {};
    Object.entries(data).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = `${capitalizeFirstLetter(key)} is required.`;
      }
    });

    if (data.email && !/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Email is invalid.";
    }

    if (data.mobile && !/^\d{10}$/.test(data.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const formData = new FormData();
      // Append all form data fields
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append photo file if it exists
      if (photo) {
        formData.append("photo", photo); // Append the actual File object
      }

      const response = await fetch(API_URLS.GENERATE_QR_CODE, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const secureKey = await response.text();
      const qrCodeUrl = `${window.location.origin}/scanned-data?secureKey=${secureKey}`;
      navigate("/qrcode", { state: { qrCodeUrl, color } });
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-orange-200">
      <div className="p-6 mx-auto bg-gradient-to-r rounded-lg mb-20 mt-5 max-w-4xl w-full border border-red-900">
        <div className="flex justify-center mb-6">
          <div className="flex-shrink-0 bg-orange-200 rounded-lg p-2">
            <img
              src={download}
              alt="Logo"
              className="h-32 w-80 md:h-40 md:w-96 rounded-xl border-2 border-blue-600"
            />
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl mt-1 mb-2 bg-orange-300 p-3 rounded-md font-bold text-blue-700 text-center">
          QR Profile Maker
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 mt-8">
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
            <div key={key} className="mt-2 flex items-center">
              <Icon className="text-blue-500 font-extrabold mr-4 w-8 h-8" />
              <div className="flex-grow">
                <input
                  className={`flex h-10 w-full rounded-md border border-gray-900 bg-transparent px-2 py-3 text-sm placeholder:text-gray-950 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
                    zoomed === key ? "zoom-effect" : ""
                  }`}
                  type="text"
                  name={key}
                  placeholder={capitalizeFirstLetter(key)}
                  value={data[key]}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                {errors[key] && (
                  <p className="text-red-500 text-sm mt-1">{errors[key]}</p>
                )}
              </div>
            </div>
          ))}
          <div className="mt-4 flex items-center flex-col md:flex-row">
            <label
              htmlFor="photo-upload"
              className="flex items-center text-blue-500 font-extrabold cursor-pointer"
            >
              <FaUser className="inline-block" />
              <span className="ml-4 h-15 w-15 flex items-center justify-center rounded-md border-2 border-gray-950 text-center transition-transform duration-300 ease-in-out hover:scale-105">
                {photoName || "Upload Photo"}
              </span>
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <div className="mt-4 ml-10 md:mt-0 flex-shrink-0">
              {photoURL && (
                <img
                  src={photoURL}
                  alt="Uploaded"
                  className="h-28 w-28 rounded-full border-2 border-green-600"
                />
              )}
            </div>
          </div>

          <div className="mb-4 flex justify-center">
            <button
              type="submit"
              className="bg-orange-800 text-white py-2 px-6 rounded-md"
            >
              Generate QR Code
            </button>
          </div>
        </form>
      </div>
      <Footer />
      {/* <style>
        {`
          .zoom-effect {
            transition: transform 0.1s ease-in-out;
            will-change: transform;
            transform: scale(1.05);
            z-index: 10;
          }
        `}
      </style> */}
    </div>
  );
};

// Capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default QRCodeGenerator;
