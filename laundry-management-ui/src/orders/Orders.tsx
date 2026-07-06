import { useState } from "react";
import { api } from "../services/api";

export default function CreateOrder() {
  const [shopId, setShopId] = useState("");
  const [pickupDate, setPickupDate] = useState("");

  const createOrder = async () => {
    await api.post("/orders", {
      shop_id: shopId,
      pickup_date: pickupDate,
    });

    alert("Order Created");
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Create Order
      </h1>

      <div className="max-w-md">
        <input
          placeholder="Shop Id"
          className="mb-4 w-full border p-3"
          value={shopId}
          onChange={(e) => setShopId(e.target.value)}
        />

        <input
          type="date"
          className="mb-4 w-full border p-3"
          value={pickupDate}
          onChange={(e) => setPickupDate(e.target.value)}
        />

        <button
          onClick={createOrder}
          className="rounded bg-green-600 px-6 py-3 text-white"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}