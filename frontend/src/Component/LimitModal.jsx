// LimitModal.jsx
import React, { useEffect, useState } from "react";
import socket from "../socket";
import "../App.css";
export default function LimitModal() {
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState("");

  useEffect(() => {
    socket.on("limitExceeded", (data) => {
      setCategory(data.category);
      setShowModal(true);
    });

    return () => socket.off("limitExceeded");
  }, []);

  const handleContinue = async () => {
    await fetch("http://localhost:8080/clear-limits", { method: "POST" });
    setShowModal(false);
    alert("✅ All limits removed. You can continue!");
  };

  const handleClose = () => {
    setShowModal(false);
    alert("🧘 Take a break and return fresh!");
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-2 text-red-600">🚫 Limit Reached</h2>
        <p className="mb-4">You've reached your limit for <strong>{category}</strong>.</p>
        <div className="flex justify-center gap-4">
          <button onClick={handleContinue} className="bg-green-500 text-white px-4 py-2 rounded-lg">Continue Anyway</button>
          <button onClick={handleClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Take a Break</button>
        </div>
      </div>
    </div>
  );
}
