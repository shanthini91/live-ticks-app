// src/components/BuySellForm.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function BuySellForm() {
  const { user } = useAuth();
  const [type, setType] = useState("buy");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(saved);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = { user: user?.email, type, price, qty, date: new Date().toLocaleTimeString() };
    const updated = [newOrder, ...orders];
    localStorage.setItem("orders", JSON.stringify(updated));
    setOrders(updated);
    setPrice("");
    setQty("");
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg text-white">
      <h2 className="text-lg font-bold mb-2">Place Order</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <select value={type} onChange={(e) => setType(e.target.value)} className="p-2 bg-gray-700">
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
        <input className="p-2 bg-gray-700" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input className="p-2 bg-gray-700" placeholder="Quantity" value={qty} onChange={(e) => setQty(e.target.value)} />
        <button className="bg-yellow-500 p-2">Submit</button>
      </form>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Your Orders</h3>
        <ul className="text-sm">
          {orders
            .filter((o) => o.user === user?.email)
            .map((o, i) => (
              <li key={i} className="border-b border-gray-700 py-1 flex justify-between">
                <span>{o.type.toUpperCase()}</span>
                <span>${o.price}</span>
                <span>{o.qty}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
