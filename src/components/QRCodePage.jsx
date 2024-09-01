import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { FaDownload, FaQrcode, FaShareSquare } from "react-icons/fa";

const QRCodePage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Import and use the navigate function
  const { state } = location;
  const { qrCodeUrl, color } = state || {};

  const svgRef = useRef(null);

  const handleDownloadSVG = () => {
    if (svgRef.current) {
      const svgElement = svgRef.current;
      const serializer = new XMLSerializer();
      const source = serializer.serializeToString(svgElement);
      const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "qr-code.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleShareWhatsApp = () => {
    if (qrCodeUrl) {
      const message = `Check out this QR Code: ${qrCodeUrl}`;
      const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">Generated QR Code</h1>
      <div className="bg-white p-1 rounded-lg shadow-lg">
        {qrCodeUrl ? (
          <div className="text-center">
            {/* Custom SVG with QR code centered */}
            <svg
              ref={svgRef}
              xmlns="http://www.w3.org/2000/svg"
              width="400"
              height="400"
              viewBox="0 0 400 400"
              preserveAspectRatio="xMidYMid meet"
            >
              <rect width="100%" height="100%" fill="white" />
              <g transform="translate(100, 100)">
                <QRCode
                  value={qrCodeUrl}
                  size={200}
                  fgColor={color || "#000000"}
                  style={{ width: "200px", height: "200px" }}
                />
              </g>
            </svg>
          </div>
        ) : (
          <p>No QR Code data available.</p>
        )}
      </div>
      <div className="mt-4 flex space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          onClick={handleDownloadSVG}
        >
          <FaDownload className="mr-2" />
          Download SVG
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
          onClick={() => navigate("/QRCL")}
        >
          <FaQrcode className="mr-2" />
          Scan QR Code
        </button>
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center"
          onClick={handleShareWhatsApp}
        >
          <FaShareSquare className="mr-2" />
          Share on WhatsApp
        </button>
      </div>
    </div>
  );
};

export default QRCodePage;
