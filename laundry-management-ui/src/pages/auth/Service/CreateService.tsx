import { useState } from "react";

export default function CreateService() {

  const [serviceName, setServiceName] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [days, setDays] =
    useState("");

  return (
    <div className="max-w-3xl">

      <h1 className="text-3xl font-bold mb-6">
        Create Service
      </h1>

      <form className="bg-white p-6 rounded-xl shadow">

        <input
          placeholder="Service Name"
          className="w-full border p-3 rounded-lg mb-4"
          value={serviceName}
          onChange={(e) =>
            setServiceName(
              e.target.value
            )
          }
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full border p-3 rounded-lg mb-4"
          value={price}
          onChange={(e) =>
            setPrice(
              e.target.value
            )
          }
        />

        <input
          type="number"
          placeholder="Estimated Days"
          className="w-full border p-3 rounded-lg mb-4"
          value={days}
          onChange={(e) =>
            setDays(
              e.target.value
            )
          }
        />

        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
          Save Service
        </button>

      </form>

    </div>
  );
}