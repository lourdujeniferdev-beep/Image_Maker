export default function CreateShop() {

  return (
    <div className="max-w-5xl">

      <h1 className="text-3xl font-bold mb-6">
        Create Laundry Shop
      </h1>

      <form className="bg-white p-6 rounded-xl shadow">

        <div className="grid md:grid-cols-2 gap-5">

          <input
            placeholder="Shop Name"
            className="border p-3 rounded-lg"
          />

          <input
            placeholder="Owner Name"
            className="border p-3 rounded-lg"
          />

          <input
            placeholder="Email"
            className="border p-3 rounded-lg"
          />

          <input
            placeholder="Mobile"
            className="border p-3 rounded-lg"
          />

          <input
            placeholder="City"
            className="border p-3 rounded-lg"
          />

          <input
            placeholder="Pincode"
            className="border p-3 rounded-lg"
          />

        </div>

        <textarea
          placeholder="Address"
          className="w-full border p-3 rounded-lg mt-5"
          rows={4}
        />

        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-5"
        >
          Create Shop
        </button>

      </form>

    </div>
  );
}