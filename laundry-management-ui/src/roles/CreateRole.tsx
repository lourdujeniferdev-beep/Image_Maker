import { useState } from "react";

export default function CreateRole() {
  const [roleName, setRoleName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    console.log({
      roleName,
      description,
    });
  };

  return (
    <div className="max-w-3xl">

      <h1 className="text-3xl font-bold mb-6">
        Create Role
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow"
      >

        <div className="mb-5">

          <label className="block mb-2">
            Role Name
          </label>

          <input
            type="text"
            className="w-full border rounded-lg p-3"
            value={roleName}
            onChange={(e) =>
              setRoleName(
                e.target.value
              )
            }
          />

        </div>

        <div className="mb-5">

          <label className="block mb-2">
            Description
          </label>

          <textarea
            rows={4}
            className="w-full border rounded-lg p-3"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
          />

        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Save Role
        </button>

      </form>

    </div>
  );
}