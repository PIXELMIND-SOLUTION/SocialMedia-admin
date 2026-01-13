import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentDetails = ({ darkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentAndUser();
  }, []);

  const fetchPaymentAndUser = async () => {
    try {
      // 1️⃣ Fetch payment
      const paymentRes = await axios.get(
        `https://apisocial.atozkeysolution.com/api/payment/${id}`
      );

      const paymentData = paymentRes.data.data;
      setPayment(paymentData);

      // 2️⃣ Fetch user details
      if (paymentData?.userId?._id) {
        const userRes = await axios.get(
          `https://apisocial.atozkeysolution.com/api/users/${paymentData.userId._id}`
        );
        setUser(userRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching payment or user", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`p-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
        Loading payment details...
      </div>
    );
  }

  if (!payment) {
    return <div className="p-6 text-red-500">Payment not found</div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className={`text-sm hover:underline ${
          darkMode ? "text-blue-400" : "text-blue-600"
        }`}
      >
        ← Back to Payments
      </button>

      {/* PAYMENT INFO */}
      <div
        className={`rounded-xl shadow p-6 ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Payment Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Detail label="Order ID" value={payment.razorpayOrderId} />
          <Detail label="Coins" value={payment.coins} />
          <Detail label="Amount" value={`₹${payment.amount}`} />
          <Detail label="Status" value={payment.status} />
          <Detail
            label="Created At"
            value={new Date(payment.createdAt).toLocaleString()}
          />
        </div>
      </div>

      {/* USER INFO */}
      {user && (
        <div
          className={`rounded-xl shadow p-6 ${
            darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"
          }`}
        >
          <h2 className="text-xl font-bold mb-4">User Details</h2>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <img
              src={
                user.profile?.image ||
                "https://via.placeholder.com/120?text=User"
              }
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border"
            />

            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm flex-1">
              <Detail label="Full Name" value={user.fullName} />
              <Detail label="Username" value={user.profile?.username} />
              <Detail label="Email" value={user.email} />
              <Detail label="Mobile" value={user.mobile} />
              <Detail label="Gender" value={user.personalInfo?.gender} />
              <Detail label="Country" value={user.personalInfo?.country} />
              <Detail label="Wallet Coins" value={user.wallet?.coins} />
              <Detail
                label="Account Status"
                value={user.accountStatus?.isActive ? "Active" : "Inactive"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium break-all">{value || "-"}</p>
  </div>
);

export default PaymentDetails;
