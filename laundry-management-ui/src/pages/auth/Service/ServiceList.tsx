import { FaEdit, FaTrash } from "react-icons/fa";

const services = [
  {
    id: 1,
    serviceName: "Wash",
    price: 50,
    days: 2,
  },
  {
    id: 2,
    serviceName: "Dry Cleaning",
    price: 120,
    days: 4,
  },
];

export default function ServiceList() {
  return (
    <div>

      <div className="flex justify-between mb-6">

        <h1 className="text-3xl font-bold">
          Services
        </h1>

        <button className="bg-blue-600 text-white px-5 py-3 rounded-lg">
          + Add Service
        </button>

      </div>

      <div className="bg-white rounded-xl shadow">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>
              <th className="p-4">
                Service Name
              </th>

              <th className="p-4">
                Price
              </th>

              <th className="p-4">
                Days
              </th>

              <th className="p-4">
                Action
              </th>
            </tr>

          </thead>

          <tbody>

            {services.map((service) => (
              <tr key={service.id}>

                <td className="p-4">
                  {service.serviceName}
                </td>

                <td className="p-4">
                  ₹{service.price}
                </td>

                <td className="p-4">
                  {service.days}
                </td>

                <td className="p-4">

                  <div className="flex gap-3 justify-center">

                    <FaEdit />

                    <FaTrash />

                  </div>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}