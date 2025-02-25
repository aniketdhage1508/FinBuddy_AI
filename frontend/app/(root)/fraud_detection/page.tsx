"use client";

import React, { useState } from "react";

const TransactionPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setTransactionData({ ...transactionData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            checkFraud(); // Simulate fraud check
            setLoading(false);
            setIsOpen(true);
        }, 1000); // Simulating delay
    };

    // Simulated Fraud Detection Rules
    const checkFraud = () => {
        let newAlerts: string[] = [];

        const age = parseInt(transactionData.age);
        const accountBalance = parseFloat(transactionData.account_balance);
        const transactionAmount = parseFloat(transactionData.transaction_amount);
        const transactionType = transactionData.transaction_type;
        const merchantCategory = transactionData.merchant_category;
        const deviceType = transactionData.device_type;

        // Rule 1: Large transactions compared to balance
        if (transactionAmount > accountBalance * 0.7) {
            newAlerts.push("⚠ High transaction amount compared to account balance.");
        }

        // Rule 2: Unusual purchase category
        else if (["Electronics", "Luxury Goods"].includes(merchantCategory) && transactionAmount > accountBalance * 0.5) {
            newAlerts.push("⚠ Large transaction in a high-risk category.");
        }

        // Rule 3: ATM withdrawals over a threshold
        else if (transactionType === "ATM Withdrawal" && transactionAmount > accountBalance * 0.3) {
            newAlerts.push("⚠ Large ATM withdrawal detected.");
        }

        // Rule 4: Suspicious device usage
        else if (deviceType === "ATM" && transactionType === "Online Purchase") {
            newAlerts.push("⚠ Online purchase from an ATM device is suspicious.");
        }

        // Rule 5: Young users making large transactions
        else if ((age < 18 || age>70) && transactionAmount > accountBalance * 0.3) {
            newAlerts.push("⚠ High transaction amount for a minor account.");
        }

        // No fraud detected
        else if(newAlerts.length === 0) {
            newAlerts.push("✅ No fraud detected.");
        }

        setAlerts(newAlerts);
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Fraud Detection System</h2>

            {/* Transaction Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={transactionData.age}
                        onChange={handleChange}
                        className="p-3 border rounded w-full"
                        required
                    />
                    <input
                        type="number"
                        name="account_balance"
                        placeholder="Account Balance"
                        value={transactionData.account_balance}
                        onChange={handleChange}
                        className="p-3 border rounded w-full"
                        required
                    />
                </div>

                <input
                    type="number"
                    name="transaction_amount"
                    placeholder="Transaction Amount"
                    value={transactionData.transaction_amount}
                    onChange={handleChange}
                    className="p-3 border rounded w-full"
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select name="transaction_type" value={transactionData.transaction_type} onChange={handleChange} className="p-3 border rounded w-full" required>
                        <option value="">Transaction Type</option>
                        <option value="Online Purchase">Online Purchase</option>
                        <option value="ATM Withdrawal">ATM Withdrawal</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                    </select>

                    <select name="merchant_category" value={transactionData.merchant_category} onChange={handleChange} className="p-3 border rounded w-full" required>
                        <option value="">Merchant Category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Restaurants">Restaurants</option>
                        <option value="Luxury Goods">Luxury Goods</option>
                    </select>

                    <select name="device_type" value={transactionData.device_type} onChange={handleChange} className="p-3 border rounded w-full" required>
                        <option value="">Device Type</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Laptop">Laptop</option>
                        <option value="ATM">ATM</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className={`w-full p-3 rounded text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                    disabled={loading}
                >
                    {loading ? "Checking..." : "Check for Fraud"}
                </button>
            </form>

            {/* Fraud Alert Dialog (Positioned Below Form & Centered Horizontally) */}
            {isOpen && alerts.length > 0 && (
                <div className="w-full flex justify-center mt-6">
                    <div className="bg-white p-6 rounded-md shadow-lg w-full md:w-[500px]">
                        <h2 className="text-lg font-bold mb-4 text-center">Fraud Alerts</h2>
                        <ul>
                            {alerts.map((alert, index) => (
                                <li key={index} className="p-2 border-b flex items-center gap-2">
                                    <span></span> {alert}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md w-full"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionPage;
