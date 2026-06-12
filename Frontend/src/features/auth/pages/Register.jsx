import React, { useState } from "react";
import { useAuth } from "../hook/useAuth"
import { useSelector } from "react-redux";
import {useNavigate , Link, Links} from "react-router"
import ContinueWIthGoogle from "../components/ContinueWIthGoogle";
import Loader from "../../shared/components/Loader";


const Register = () => {

  const { handleRegister } = useAuth()
  const navigate = useNavigate()
  const loading = useSelector((state) => state.auth.loading)

  const [formData, setFormData] = useState({
    fullname: '',
    contactNumber: '',
    email: '',
    password: '',
    isSeller: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: wire up registration API call here
    await handleRegister({
      fullname: formData.fullname,
      contact: formData.contactNumber,
      email: formData.email,
      password: formData.password,
      isSeller: formData.isSeller,
    })
    navigate("/");
    console.log("Register form submitted", formData);
  };

  if (loading) return <Loader />;

  return (
    <div
      className="min-h-screen bg-[#F8F6F1] flex items-center justify-center p-4 lg:p-8"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="w-full lg:w-[92%] lg:h-[99vh] max-w-[1700px] bg-white rounded-[40px] border border-[#EEE7D8] shadow-[0_25px_80px_rgba(0,0,0,0.05)]">
        <div className="grid lg:grid-cols-2 h-full">

          {/* LEFT SIDE */}
          <div className="flex items-center px-8 lg:px-20 py-8 lg:py-0 border-b lg:border-b-0 lg:border-r border-[#F1ECE0]">
            <div className="max-w-xl">
              <p className="uppercase tracking-[0.4em] text-xs text-[#B79A4A] font-medium mb-6">
                Premium Fashion House
              </p>

              <h1
                className="text-6xl lg:text-[96px] leading-none text-[#18181B]"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                }}
              >
                Clothy
              </h1>

              <div className="w-24 h-[2px] bg-[#B79A4A] mt-6"></div>

              <h2
                className="mt-10 text-3xl lg:text-5xl leading-tight text-[#18181B]"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                }}
              >
                Timeless Fashion.
                <br />
                Modern Confidence.
              </h2>

              <p className="mt-8 text-[17px] leading-8 text-[#6B7280]">
                Discover elevated essentials and refined fashion designed for
                individuals who appreciate quality, simplicity, and
                sophistication.
              </p>

              <p className="mt-10 text-[15px] leading-8 text-[#8A8A8A]">
                Crafted with precision.
                <br />
                Designed with intention.
                <br />
                Made to be worn, remembered, and loved.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center justify-center px-8 lg:px-20 py-12">
            <div className="w-full max-w-2xl">
              <div className="mb-12">
                <p className="uppercase tracking-[0.25em] text-xs text-[#B79A4A] font-medium mb-4">
                  Join Clothy
                </p>

                <h2
                  className="text-4xl lg:text-5xl text-[#18181B]"
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                  }}
                >
                  Create Account
                </h2>

                <p className="mt-4 text-[#71717A] text-[15px]">
                  Begin your journey with a curated fashion experience.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* INPUT FIELDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>
                    <label className="block mb-3 text-sm text-[#444] font-medium">
                      Full Name
                    </label>

                    <input
                      type="text"
                      placeholder="Enter your full name"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      required
                      className="w-full h-14 rounded-2xl border border-[#E7E1D2] bg-white px-5 text-[15px] outline-none transition-all focus:border-[#B79A4A] focus:ring-4 focus:ring-[#B79A4A]/10"

                    />
                  </div>

                  <div>
                    <label className="block mb-3 text-sm text-[#444] font-medium">
                      Email Address
                    </label>

                    <input
                      type="email"
                      placeholder="Enter your email address"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full h-14 rounded-2xl border border-[#E7E1D2] bg-white px-5 text-[15px] outline-none transition-all focus:border-[#B79A4A] focus:ring-4 focus:ring-[#B79A4A]/10"
                    />
                  </div>

                  <div>
                    <label className="block mb-3 text-sm text-[#444] font-medium">
                      Contact Number
                    </label>

                    <input
                      type="text"
                      placeholder="Enter your contact number"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      required
                      className="w-full h-14 rounded-2xl border border-[#E7E1D2] bg-white px-5 text-[15px] outline-none transition-all focus:border-[#B79A4A] focus:ring-4 focus:ring-[#B79A4A]/10"
                    />
                  </div>

                  <div>
                    <label className="block mb-3 text-sm text-[#444] font-medium">
                      Password
                    </label>

                    <input
                      type="password"
                      placeholder="Enter your password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full h-14 rounded-2xl border border-[#E7E1D2] bg-white px-5 text-[15px] outline-none transition-all focus:border-[#B79A4A] focus:ring-4 focus:ring-[#B79A4A]/10"
                    />
                  </div>
                </div>

                {/* SELLER CHECKBOX */}
                <div className="flex justify-center">
                  <div className="w-full md:w-[80%] h-14 rounded-2xl border border-[#E7E1D2] flex items-center px-5 gap-4">
                    <input
                      type="checkbox"
                      id="seller"
                      name="isSeller"
                      checked={formData.isSeller}
                      onChange={handleChange}
                      className="h-4 w-4 accent-[#B79A4A]"
                    />

                    <label
                      htmlFor="seller"
                      className="text-[15px] text-[#444] cursor-pointer"
                    >
                      Register as a Seller
                    </label>

                 
                </div>
                 
                  </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-[#B79A4A] text-white font-medium tracking-wide hover:bg-[#A48A42] transition-all duration-300"
                >
                  Create Account
                </button>
                  <ContinueWIthGoogle/>
                {/* LOGIN */}
                <p className="text-center text-[14px] text-[#71717A]">
                  Already have an account?
                  <span className="ml-2 text-[#B79A4A] font-medium cursor-pointer hover:underline">
                  <Link to="/login">
                    Sign In
                    </Link>
                  </span>
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;