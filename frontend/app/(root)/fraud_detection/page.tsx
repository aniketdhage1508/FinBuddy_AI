"use client";  // Required for Next.js App Router for client components

import React, { useState, useEffect } from "react";

const TransactionPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [alerts, setAlerts] = useState<string[]>([]);
    const [transactionData, setTransactionData] = useState({
        age: "",
        account_balance: "",
        transaction_amount: "",
        transaction_type: "",
        merchant_category: "",
        device_type: "",
    });

    // Handle input changes
    const handleChange = (e) => {
        setTransactionData({ ...transactionData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsOpen(true);
        await checkFraud();
    };

    // Function to check fraud detection
    const checkFraud = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/predict_fraud", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transactionData),
            });

            const result = await response.json();
            console.log("API Response:", result);

            // Ensure alerts is always an array
            setAlerts(result.alerts && result.alerts.length > 0 ? result.alerts : ["No alerts received."]);
        } catch (error) {
            // console.error("Error detecting fraud:", error);
            setAlerts(["⚠ Error: Unable to fetch fraud detection results."]);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Enter Transaction Details</h2>

            {/* Transaction Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4 w-3/5 mx-auto flex flex-col items-center">
                <input type="number" name="age" placeholder="Age" value={transactionData.age} onChange={handleChange} className="p-3 border rounded w-full" required />
                <input type="number" name="account_balance" placeholder="Account Balance" value={transactionData.account_balance} onChange={handleChange} className="p-2 border rounded w-full" required />
                <input type="number" name="transaction_amount" placeholder="Transaction Amount" value={transactionData.transaction_amount} onChange={handleChange} className="p-2 border rounded w-full" required />

                <select name="transaction_type" value={transactionData.transaction_type} onChange={handleChange} className="p-3 border rounded w-full" required>
                    <option value="">Select Transaction Type</option>
                    <option value="Online Purchase">Online Purchase</option>
                    <option value="ATM Withdrawal">ATM Withdrawal</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                </select>

                <select name="merchant_category" value={transactionData.merchant_category} onChange={handleChange} className="p-3 border rounded w-full" required>
                    <option value="">Select Merchant Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Restaurants">Restaurants</option>
                </select>

                <select name="device_type" value={transactionData.device_type} onChange={handleChange} className="p-3 border rounded w-full" required>
                    <option value="">Select Device Type</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Laptop">Laptop</option>
                    <option value="ATM">ATM</option>
                </select>

                <button type="submit" className="bg-blue-500 text-white p-3 rounded">Check for Fraud</button>
            </form>

            {/* Fraud Alert Dialog */}
            {isOpen && alerts.length > 0 && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md shadow-lg w-[500px]">
                        <h2 className="text-lg font-bold mb-4">Fraud Alerts</h2>
                        <ul>
                            {alerts.map((alert, index) => (
                                <li key={index} className="p-2 border-b">{alert}</li>
                            ))}
                        </ul>
                        <button onClick={() => setIsOpen(false)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionPage;