import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import "./App.css";

function FormPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    image: "",
  });
  const [showCard, setShowCard] = useState(false);
  const cardRef = useRef();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Generate ID Card
  const handleGenerate = (e) => {
    e.preventDefault();
    setShowCard(true);
  };

  // Download ID card as image
  const handleDownload = () => {
    html2canvas(cardRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.download = `${formData.name}_IDCard.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  const qrValue = JSON.stringify({
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    address: formData.address,
  });

  return (
    <div className="form-container">
      <h1 className="title">Digital ID Card Generator</h1>

      <form className="form" onSubmit={handleGenerate}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          required
        />

        <button type="submit">Generate ID Card</button>
      </form>

      {showCard && (
        <div className="id-card-container">
          <div className="id-card" ref={cardRef}>
            <div className="id-header">OFFICIAL ID CARD</div>
            <div className="id-content">
              <div className="photo-section">
                {formData.image && (
                  <img src={formData.image} alt="Profile" className="id-photo" />
                )}
              </div>
              <div className="info-section">
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Address:</strong> {formData.address}</p>
              </div>
            </div>
            <div className="qr-section">
              <QRCodeCanvas value={qrValue} size={100} />
            </div>
          </div>

          <button className="download-btn" onClick={handleDownload}>
            Download ID Card
          </button>
        </div>
      )}
    </div>
  );
}

export default FormPage;
