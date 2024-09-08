import React, { useRef } from "react";
import { FaDownload, FaQrcode, FaWhatsapp } from "react-icons/fa";
import QRCode from "react-qr-code";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../footer/Footer"; // Make sure the path is correct

const QRCodePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleShareWhatsApp = async () => {
    if (qrCodeUrl) {
      // Convert QR code to PNG and upload it to a public URL (simulate this step)
      const qrCodeImage = svgRef.current.querySelector("svg").outerHTML;
      const blob = new Blob([qrCodeImage], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);

      // Construct WhatsApp share URL with the image
      // Note: WhatsApp does not support sharing images directly via URL,
      // so we can only share text. You may need to use an image hosting service
      // and then share the link to the image.
      const message = `Check out this QR Code: ${qrCodeUrl}`;
      const shareUrl = `https://wa.me/?text=${encodeURIComponent(
        message
      )}%0A${encodeURIComponent(url)}`;

      window.open(shareUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-orange-200 ">
      <div className="flex-grow flex flex-col items-center justify-center border border-orange-950 p-4 md:p-6">
        <h1 className="text-xl md:text-3xl rounded-md bg-orange-500 p-4 border border-orange-950  font-bold mb-4 text-center">
          Generated Profile QR Code
        </h1>
        <div className="bg-orange-600 p-3 md:p-3 rounded-lg shadow-lg border border-red-950 w-full max-w-sm flex flex-col items-center">
          {qrCodeUrl ? (
            <div className="text-center border md:p-3 bg-red-700 border-red-950 p-3 rounded-md w-full">
              {/* Custom SVG with QR code centered */}
              <svg
                ref={svgRef}
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="200"
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
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <button
            className="px-4 py-2 bg-orange-800 text-white rounded hover:bg-orange-950 flex items-center"
            onClick={handleDownloadSVG}
          >
            <FaDownload className="mr-2" />
            Download
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
            onClick={() => navigate("/QRCL")}
          >
            <FaQrcode className="mr-2" />
            Scan QR Code
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
            onClick={handleShareWhatsApp}
          >
            <FaWhatsapp className="mr-2" />
            Share on WhatsApp
          </button>
        </div>
      </div>
      <Footer /> {/* Ensure that the Footer component is correctly styled */}
    </div>
  );
};

export default QRCodePage;
