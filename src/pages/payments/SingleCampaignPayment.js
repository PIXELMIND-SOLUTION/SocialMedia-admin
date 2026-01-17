import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SingleCampaignPayment = ({ darkMode }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* ---------------- FETCH PAYMENT ---------------- */
    const fetchPayment = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `https://apisocial.atozkeysolution.com/api/campaigns/payment/singleorderpayment/${id}`
            );

            if (res.data.success) {
                setPayment(res.data.payment);
            }
        } catch (err) {
            setError("Failed to fetch payment details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayment();
    }, [id]);

    if (loading) {
        return (
            <p className={`text-center mt-10 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Loading payment details...
            </p>
        );
    }

    if (error) {
        return (
            <p className="text-center mt-10 text-red-500 text-sm">
                {error}
            </p>
        );
    }

    if (!payment) return null;

    return (
        <div className="space-y-8 max-w-6xl">
            {/* BACK BUTTON */}
            <button
                onClick={() => navigate(-1)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${darkMode
                        ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
            >
                ← Back to Payments
            </button>

            {/* HEADER */}
            <h1
                className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"
                    }`}
            >
                Campaign Payment Details
            </h1>

            {/* BASIC INFO */}
            <Section darkMode={darkMode} title="User Information">
                <Info darkMode={darkMode} label="User Name" value={payment.fullName} />
                <Info darkMode={darkMode} label="Email" value={payment.email} />
                <Info darkMode={darkMode} label="Mobile" value={payment.mobileNumber} />
                <Info darkMode={darkMode} label="Campaign Link" value={payment.link} />
            </Section>

            {/* PACKAGE INFO */}
            <Section darkMode={darkMode} title="Purchased Package">
                <Info darkMode={darkMode} label="Package Name" value={payment?.purchasedPackage?.packageName} />
                <Info darkMode={darkMode} label="Price" value={`₹${payment?.purchasedPackage?.price}`} />
                <Info darkMode={darkMode} label="Duration" value={`${payment?.purchasedPackage?.durationHours} hrs`} />
                <Info darkMode={darkMode} label="Target Users" value={payment?.purchasedPackage?.targetUsers} />
                <Info darkMode={darkMode} label="Payment Status" value={payment?.purchasedPackage?.paymentStatus} />
                <Info darkMode={darkMode} label="Order ID" value={payment?.purchasedPackage?.razorpayOrderId} />
            </Section>

            {/* STATUS */}
            <Section darkMode={darkMode} title="Campaign Status">
                <Status label="Admin Approval" value={payment.adminApprovalStatus} />
                <Status label="Active" value={payment.isActive ? "Yes" : "No"} />
                <Status label="Pushed By Admin" value={payment.isPushedByAdmin ? "Yes" : "No"} />
            </Section>

            {/* MEDIA */}
            <Section darkMode={darkMode} title="Campaign Media">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {payment.media?.map((item) => (
                        <div
                            key={item._id}
                            className={`rounded-lg border overflow-hidden ${darkMode ? "border-gray-700" : "border-gray-200"
                                }`}
                        >
                            {item.type === "video" ? (
                                <video
                                    src={item.url}
                                    controls
                                    className="w-full h-60 object-cover"
                                />
                            ) : (
                                <img
                                    src={item.url}
                                    alt="Campaign Media"
                                    className="w-full h-60 object-cover"
                                />
                            )}
                        </div>
                    ))}

                </div>
            </Section>

            {/* FAQ */}
            <Section darkMode={darkMode} title="FAQs">
                {payment.faqs?.map((faq) => (
                    <div
                        key={faq._id}
                        className={`p-4 rounded-lg border ${darkMode
                                ? "bg-gray-800 border-gray-700 text-gray-200"
                                : "bg-gray-50 border-gray-200 text-gray-800"
                            }`}
                    >
                        <p className="font-semibold">{faq.question}</p>
                        <p className="text-sm mt-2">
                            <strong>Answer:</strong> {faq.answer}
                        </p>
                    </div>
                ))}
            </Section>

            {/* STATS */}
            <Section darkMode={darkMode} title="Campaign Stats">
                <Info darkMode={darkMode} label="Impressions" value={payment.stats?.impressions} />
                <Info darkMode={darkMode} label="Clicks" value={payment.stats?.clicks} />
                <Info darkMode={darkMode} label="Conversions" value={payment.stats?.conversions} />
                <Info darkMode={darkMode} label="Unique Views" value={payment.stats?.uniqueViews} />
            </Section>
        </div>
    );
};

/* ---------------- REUSABLE UI ---------------- */

const Section = ({ title, children, darkMode }) => (
    <div
        className={`p-6 rounded-xl border space-y-4 ${darkMode
                ? "bg-gray-900 border-gray-700"
                : "bg-white border-gray-200"
            }`}
    >
        <h2
            className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"
                }`}
        >
            {title}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </div>
);

const Info = ({ label, value, darkMode }) => (
    <div>
        <p className="text-xs text-gray-400 uppercase">{label}</p>
        <p
            className={`font-medium break-all ${darkMode ? "text-gray-200" : "text-gray-800"
                }`}
        >
            {value || "N/A"}
        </p>
    </div>
);

const Status = ({ label, value }) => (
    <div>
        <p className="text-xs text-gray-400 uppercase">{label}</p>
        <span
            className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${value === "rejected"
                    ? "bg-red-100 text-red-700"
                    : value === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                }`}
        >
            {value}
        </span>
    </div>
);

export default SingleCampaignPayment;
