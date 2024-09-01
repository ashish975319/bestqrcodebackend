import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaDownload,
  FaArrowLeft,
  FaUser,
  FaPhone,
  FaMobileAlt,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaBuilding,
  FaBriefcase,
  FaInfoCircle,
  FaSave,
} from "react-icons/fa";
import { API_URLS } from "../api/apiConfig";

const ScannedData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

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

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "scanned-data.json";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSaveContact = () => {
    const vCard = `
BEGIN:VCARD
VERSION:3.0
FN:${data.name}
TEL;TYPE=WORK,VOICE:${data.landline}
TEL;TYPE=CELL:${data.mobile}
EMAIL:${data.email}
ORG:${data.company}
TITLE:${data.designation}
ADR;TYPE=HOME:;;${data.address}
END:VCARD
    `;
    const blob = new Blob([vCard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${data.name.replace(/\s+/g, "_")}_contact.vcf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 p-4 md:p-6 lg:p-8">
      <div className="bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg max-w-4xl w-full">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800 flex items-center gap-2">
          <FaInfoCircle className="text-blue-500 text-xl md:text-2xl" /> Scanned
          Data
        </h1>
        {data ? (
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Data Column */}
            <div className="flex-1">
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-left text-gray-500 dark:text-gray-400">
                  <caption className="caption-bottom text-xl md:text-2xl font-semibold text-gray-700 mb-4">
                    Scanned Data Details
                  </caption>
                  <tbody>
                    <tr className="bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-4 py-2 md:px-6 md:py-4 font-medium text-gray-900 dark:text-white flex items-center gap-4"
                      >
                        <FaUser className="text-blue-500" />
                        <span className="ml-2">Name:</span>
                      </th>
                      <td className="px-4 py-2 md:px-6 md:py-4">
                        {data.name || "N/A"}
                      </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-4 py-2 md:px-6 md:py-4 font-medium text-gray-900 dark:text-white flex items-center gap-4"
                      >
                        <FaPhone className="text-blue-500" />
                        <span className="ml-2">Landline:</span>
                      </th>
                      <td className="px-4 py-2 md:px-6 md:py-4">
                        {data.landline || "N/A"}
                      </td>
                    </tr>
                    <tr className="bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-4 py-2 md:px-6 md:py-4 font-medium text-gray-900 dark:text-white flex items-center gap-4"
                      >
                        <FaMobileAlt className="text-blue-500" />
                        <span className="ml-2">Mobile:</span>
                      </th>
                      <td className="px-4 py-2 md:px-6 md:py-4 flex items-center gap-2">
                        {data.mobile || "N/A"}
                        <FaSave
                          className="text-green-500 cursor-pointer"
                          onClick={handleSaveContact}
                        />
                      </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-4 py-2 md:px-6 md:py-4 font-medium text-gray-900 dark:text-white flex items-center gap-4"
                      >
                        <FaEnvelope className="text-blue-500" />
                        <span className="ml-2">Email:</span>
                      </th>
                      <td className="px-4 py-2 md:px-6 md:py-4">
                        <a
                          href={`mailto:${data.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {data.email || "N/A"}
                        </a>
                      </td>
                    </tr>
                    <tr className="bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-4 py-2 md:px-6 md:py-4 font-medium text-gray-900 dark:text-white flex items-center gap-4"
                      >
                        <FaGlobe className="text-blue-500" />
                        <span className="ml-2">Website:</span>
                      </th>
                      <td className="px-4 py-2 md:px-6 md:py-4">
                        <a
                          href={data.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {data.website || "N/A"}
                        </a>
                      </td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-4 py-2 md:px-6 md:py-4 font-medium text-gray-900 dark:text-white flex items-center gap-4"
                      >
                        <FaMapMarkerAlt className="text-blue-500" />
                        <span className="ml-2">Address:</span>
                      </th>
                      <td className="px-4 py-2 md:px-6 md:py-4">
                        {data.address || "N/A"}
                      </td>
                    </tr>
                    <tr className="bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-4 py-2 md:px-6 md:py-4 font-medium text-gray-900 dark:text-white flex items-center gap-4"
                      >
                        <FaBuilding className="text-blue-500" />
                        <span className="ml-2">Company:</span>
                      </th>
                      <td className="px-4 py-2 md:px-6 md:py-4">
                        {data.company || "N/A"}
                      </td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-900">
                      <th
                        scope="row"
                        className="px-4 py-2 md:px-6 md:py-4 font-medium text-gray-900 dark:text-white flex items-center gap-4"
                      >
                        <FaBriefcase className="text-blue-500" />
                        <span className="ml-2">Designation:</span>
                      </th>
                      <td className="px-4 py-2 md:px-6 md:py-4">
                        {data.designation || "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-lg text-gray-600">Loading...</p>
        )}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleDownload}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <FaDownload /> Download Data
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
          >
            <FaArrowLeft /> Back to QR Code Generator
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScannedData;
