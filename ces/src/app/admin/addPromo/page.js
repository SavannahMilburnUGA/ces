// Add Promo page for Admin
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminAddPromo() {
    const [form, setForm] = useState({
        promoCode: "",
        discountPercent: "",
        startDate: "",
        endDate: ""
    });
  
    const [errors, setErrors] = useState({});
    const router = useRouter();

    function update(key, value) {
        setForm(prev => ({ ...prev, [key]: value }));
        // Clear error for this field when user starts typing
        if (errors[key]) {
            setErrors(prev => ({ ...prev, [key]: "" }));
        } // if 
    } // update 

    // Validate on client-side
    function validateForm() {
        const newErrors = {};

        // Validating promo code 
        if (!form.promoCode.trim()) {
            newErrors.promoCode = "Promo code is required";
        } else if (form.promoCode.trim().length < 3) {
            newErrors.promoCode = "Promo code must be at least 3 characters";
        } else if (form.promoCode.trim().length > 20) {
            newErrors.promoCode = "Promo code cannot exceed 20 characters";
        } // if-else

        // Validating discount
        if (!form.discountPercent) {
            newErrors.discountPercent = "Discount is required";
        } else if (isNaN(form.discountPercent)) {
            newErrors.discountPercent = "Discount must be a number";
        } else if (Number(form.discountPercent) < 1 || Number(form.discountPercent) > 100) {
            newErrors.discountPercent = "Discount must be between 1% and 100%";
        } // if-else

        // Validating start date
        if (!form.startDate) {
            newErrors.startDate = "Start date is required";
        } // if

        // Validating end date 
        if (!form.endDate) {
            newErrors.endDate = "End date is required";
        } else if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) {
            newErrors.endDate = "End date must be after start date";
        } // if-else

        return newErrors;
    } // validateForm

    async function handleSubmit(e) {
        e.preventDefault();

        // Validate form
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        } // if 

        try {
        // send POST request 
        const res = await fetch("/api/promos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        }); // res

        const data = await res.json();

        // in case promo fails to save
        if (!res.ok) throw new Error("Failed to save promo");

        alert("Promo created successfully!");
        router.push("/admin/manage-promos"); // Go back to Manage Promos home page after adding 
        } catch (err) {
            alert(err.message);
        } // try-catch
    } // handleSubmit 

    return(
        <main className="min-h-dvh text-slate-100 flex items-start justify-center p-6" style={{ background: "var(--background)" }}>
            <section className="w-full max-w-4xl border rounded-2xl shadow-xl p-6 md:p-8" style={{ backgroundColor: "var(--dark2)", borderColor: "var(--dark-gray)" }}>
                <div>
                    <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--off-white)" }}>Add Promo</h1>
                    <div className="flex justify-end mb-4">
                    <button onClick={() => router.push("/admin")} className="px-4 py-2 rounded-lg transition" style={{ backgroundColor: "var(--dark-red)", color: "var(--off-white)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--light-gray)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--dark-gray)")}
                        >
                        Admin Home
                    </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <label style={{ color: "var(--off-white)" }}>
                        Promo Code
                        <input className="w-full rounded-lg border p-2 mt-1" style={{ backgroundColor: "var(--dark2)", color: "var(--off-white)", borderColor: errors.promoCode ? "var(--pastel-red)" : "var(--dark-gray)" }} 
                        value={form.promoCode} 
                        onChange={e => update("promoCode", e.target.value)} 
                        placeholder="e.g., SUMMER25"
                    />
                        {errors.promoCode && (
                            <span className="text-sm mt-1 block" style={{ color: "var(--pastel-red)" }}>
                            {errors.promoCode}
                            </span>
                        )}
                        </label>
                        <br/><br/>

                        <label style={{ color: "var(--off-white)" }}>
                            Discount Percent (1-100)
                            <input className="w-full rounded-lg border p-2 mt-1" style={{backgroundColor: "var(--dark2)", color: "var(--off-white)", borderColor: errors.discountPercent ? "var(--pastel-red)" : "var(--dark-gray)" }} 
                            type="number"
                            min="1"
                            max="100"
                            value={form.discountPercent} 
                            onChange={e => update("discountPercent", e.target.value)}
                            placeholder="e.g., 20"
                            />
                            {errors.discountPercent && (
                                <span className="text-sm mt-1 block" style={{ color: "var(--pastel-red)" }}>
                                {errors.discountPercent}
                                </span>
                            )}
                            </label>
                            <br/><br/>

                        <label style={{ color: "var(--off-white)" }}>
                            Start Date
                            <input 
                                className="w-full rounded-lg border p-2 mt-1" 
                                style={{ 
                                backgroundColor: "var(--dark2)", 
                                color: "var(--off-white)", 
                                borderColor: errors.startDate ? "var(--pastel-red)" : "var(--dark-gray)" 
                                }} 
                                type="date" 
                                value={form.startDate} 
                                onChange={e => update("startDate", e.target.value)}
                            />
                            {errors.startDate && (
                                <span className="text-sm mt-1 block" style={{ color: "var(--pastel-red)" }}>
                                {errors.startDate}
                                </span>
                            )}
                            </label>
                            <br/><br/>

                            <label style={{ color: "var(--off-white)" }}>
                            End Date
                            <input 
                                className="w-full rounded-lg border p-2 mt-1" 
                                style={{ 
                                backgroundColor: "var(--dark2)", 
                                color: "var(--off-white)", 
                                borderColor: errors.endDate ? "var(--pastel-red)" : "var(--dark-gray)" 
                                }} 
                                type="date" 
                                value={form.endDate} 
                                onChange={e => update("endDate", e.target.value)}
                            />
                            {errors.endDate && (
                                <span className="text-sm mt-1 block" style={{ color: "var(--pastel-red)" }}>
                                {errors.endDate}
                                </span>
                            )}
                            </label>
                            <br/><br/>

                        <div className="flex justify-center gap-4">
                            <button 
                                type="button"
                                onClick={() => router.push("/admin/manage-promos")}
                                className="px-6 py-2 rounded transition" 
                                style={{ backgroundColor: "var(--dark-gray)", color: "var(--darkest)" }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--light-gray)")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--dark-gray)")}
                            >
                                Cancel
                            </button>
                            <button 
                                className="px-6 py-2 rounded transition"
                                style={{ backgroundColor: "var(--dark-gray)", color: "var(--darkest)" }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--light-gray)")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--dark-gray)")}
                                type="submit"
                            >
                                Add Promo
                            </button>
                        </div>
                    </form>
                </div>
            </section> 
            </main> 
    );
} // AdminAddPromo 