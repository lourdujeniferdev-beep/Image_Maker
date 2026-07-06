import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import image from "../../assets/image3.png";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      email: (e.target as HTMLFormElement).email.value,
      password: (e.target as HTMLFormElement).password.value,
    };

    console.log(formData);
    // Redirect to dashboard on submit
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center px-2">
      <div className="  rounded-3xl shadow-lg overflow-hidden grid md:grid-cols-2 w-full max-w-4xl">

        {/* Left Side */}
        <div className="bg-blue-600 text-white p-10 flex flex-col justify-center"
          style={{
              
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",

          }}>
          {/* <h1 className="text-4xl font-bold mb-4">
            Laundry Management System
          </h1>

          <p className="text-lg opacity-90">
            Manage Laundry Orders, Pickup Partners,
            Delivery Partners and Customers in one place.
          </p> */}
        </div>

        {/* Right Side */}
        <div className="bg-white p-10">
          <h2 className="text-3xl font-bold text-white-800 mb-2">
            Welcome Back
          </h2>

          <p className="text-white-800 mb-8">
            Login to your account
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">
                Email
              </label>

              <input
                name="email"
                type="email"
                placeholder="Enter Email"
                required
                className="w-full border border-white-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  required
                  className="w-full border border-white-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  className="absolute right-4 top-4"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between mb-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember Me
              </label>

              <Link
                to="/forgot-password"
                className="text-blue-600"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
            >
              Login
            </button>

            <p className="text-center mt-6">
              Don't have an account?
              <Link
                to="/register"
                className="text-blue-600 ml-1 font-semibold"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}