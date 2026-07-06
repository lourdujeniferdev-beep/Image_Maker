import { useState } from "react";

export default function CreateUser() {
  const [formData] =
    useState({
      username: "",
      email: "",
      mobile: "",
      password: "",
      roleId: "",
      organizationId: "",
    });

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    console.log(formData);
  };

  return (
    <div className="max-w-5xl">

      <h1 className="text-3xl font-bold mb-6">
        Create User
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow"
      >

        <div className="grid md:grid-cols-2 gap-5">

          <input
            placeholder="Username"
            className="border rounded-lg p-3"
          />

          <input
            placeholder="Email"
            className="border rounded-lg p-3"
          />

          <input
            placeholder="Mobile Number"
            className="border rounded-lg p-3"
          />

          <input
            type="password"
            placeholder="Password"
            className="border rounded-lg p-3"
          />

          <select className="border rounded-lg p-3">
            <option>
              Select Role
            </option>

            <option>
              Super Admin
            </option>

            <option>
              Organization Admin
            </option>

            <option>
              Shop Owner
            </option>

            <option>
              Pickup Partner
            </option>

            <option>
              Delivery Partner
            </option>
          </select>

          <select className="border rounded-lg p-3">
            <option>
              Select Organization
            </option>
          </select>

        </div>

        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Create User
        </button>

      </form>

    </div>
  );
}