import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const data = {
      username: (form.username as HTMLInputElement).value,
      fullname: (form.fullname as HTMLInputElement).value,
      email: (form.email as HTMLInputElement).value,
      mobile: (form.mobile as HTMLInputElement).value,
      role: (
        form.elements.namedItem("role") as HTMLSelectElement
      )?.value,
      password: (form.password as HTMLInputElement).value,
      confirmPassword: (
        form.confirmPassword as HTMLInputElement
      ).value,
    };

    console.log(data);
    // Redirect to OTP verification page
    navigate("/verify-otp");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">

        {/* Left Section */}
        <div className="bg-blue-600 text-white p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">
            Laundry Management System
          </h1>

          <p className="text-lg opacity-90">
            Register and manage your laundry orders,
            pickups, deliveries and payments easily.
          </p>
        </div>

        {/* Right Section */}
        <div className="p-10">
          <h2 className="text-3xl font-bold text-gray-800">
            Create Account
          </h2>

          <p className="text-gray-500 mt-2 mb-8">
            Register to continue
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4">

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Username
                </label>

                <input
                  type="text"
                  name="username"
                  placeholder="Enter Username"
                  required
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullname"
                  placeholder="Enter Full Name"
                  required
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  required
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Mobile Number
                </label>

                <input
                  type="tel"
                  name="mobile"
                  placeholder="Enter Mobile Number"
                  required
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium">
                  Select Role
                </label>

                <select
                  name="role"
                  required
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    Select Role
                  </option>

                  <option value="customer">
                    Customer
                  </option>

                  <option value="shop_owner">
                    Laundry Shop Owner
                  </option>

                  <option value="pickup_partner">
                    Pickup Partner
                  </option>

                  <option value="delivery_partner">
                    Delivery Partner
                  </option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Enter Password"
                    required
                    className="w-full border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-4"
                  >
                    {showPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    required
                    className="w-full border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-4 top-4"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <input type="checkbox" required />

              <span className="text-sm">
                I agree to the Terms &
                Conditions
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg mt-6 font-semibold"
            >
              Register
            </button>

            <p className="text-center mt-6">
              Already have an account?
              <Link
                to="/login"
                className="text-blue-600 ml-1 font-semibold"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}