// Manage Promos Home page for Admin 
// Can add a new promo, edit promo info, or delete a promo from the database and system. 

// Allow Admin to Add Promos
// Add Promo button - Promo Form: promoCode, discountPercent, startDate, endDate

// Send email promos to registed users who have subscribed for promos:
// Send Email button - confirmation
// Need to find all users who opted in. 

// Registed Users can subscribe/unsubscribe - check Edit Profile. 

// Allow customers to use promo codes. 
// /models/Promo.js: promoCode, discountPercent, startDate, endDate, isActive

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/SearchBar";

export default function ManagePromos() {
    const router = useRouter();
    // Using state
    const [allPromos, setAllPromos] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletePromo, setDeletePromo] = useState(null);
    const [showSendEmailConfirm, setShowSendEmailConfirm] = useState(false);
    const [sendPromo, setSendPromo] = useState(null);
    const [sendingEmail, setSendingEmail] = useState(false);

    // Fetch promos from /api/promos
    useEffect(() => {
        // Handling memory leaks 
        let alive = true;
        async function fetchPromos() {
            try {
                setLoading(true);
                setError("");
                const res = await fetch("/api/promos");
                const data = await res.json();

                const arr = Array.isArray(data)
                    ? data  
                    : Array.isArray(data?.promos)
                    ? data.promos
                    : []; // arr
                
                if (alive) {
                    setAllPromos(arr);
                } // if 
            } catch (error) {
                if (alive) {
                    setError(error.message || "Failed to fetch promos. ");
                } // if 
            } finally {
                if (alive) {
                    setLoading(false);
                } // if 
            } // try-catch-finally
        } // fetchPromos

        // Calling function
        fetchPromos();
        return () => {
            alive = false;
        }; // return
    }, []); // useEffect 

    // Handle searching existing promo table 
    const handleSearch = (searchTerm) => {
        setSearch(searchTerm);
    }; // handleSearch

    // Filter promo table by searched promo code 
    const filteredPromos = allPromos
        .filter((promo) => 
            promo.promoCode.toLowerCase().includes(search.toLowerCase())
        ) // filter
        // A to Z sorting 
        .sort((a, b) => a.promoCode.localeCompare(b.promoCode)); // filteredPromos
    
    // Handle editing/updating a promo
    const handleEdit = (promoId) => {
        router.push(`/admin/update-promo?id=${promoId}`);
    }; // handleEdit 

    // Handle deleting a promo 
    const handleDelete = (promo) => {
        setDeletePromo(promo);
        setShowDeleteConfirm(true);
    }; // handleDelete

    // Handle deleting a promo after confirming 
    const confirmDelete = async () => {
        try {
            const res = await fetch(`/api/promos/${deletePromo._id}`, {
                method: "DELETE", 
            }); // res

            if (!res.ok) throw new Error("Failed to delete promo.");

            // Remove from local state
            setAllPromos(allPromos.filter((p) => p._id !== deletePromo._id));
            setShowDeleteConfirm(false);
            setDeletePromo(null);
        } catch (error) {
            alert(error.message);
        } // try-catch 
    }; // confirmDelete

    // Handle not deleting a promo 
    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setDeletePromo(null);
    }; // cancelDelete

    // Handle sending promo email
    const handleSendEmail = (promo) => {
        setSendPromo(promo);
        setShowSendEmailConfirm(true);
    }; // handleSendEmail

    // Handle sending promo email after confirming
    const confirmSendEmail = async () => {
        try {
            setSendingEmail(true);
            const res = await fetch("api/promos/send-email", {
                method: "POST", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify({ promoId: sendPromo._id }), 
            }); // res

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to send email.");

            // Success message
            alert(`Email sent successfully to ${data.successCount} users!${data.failCount > 0 ? `(${data.failCount} failed)` : ``}`);
            setShowSendEmailConfirm(false);
            setSendPromo(null);

            // Refresh promos to show updated sentCount
            const refreshRes = await fetch("api/promos");
            const refreshData = await refreshRes.json();
            const arr = Array.isArray(refreshData) ? refreshData : Array.isArray(refreshData?.promos) ? refreshData.promos : [];
            setAllPromos(arr);
        } catch (error) {
            alert(error.message);
        } finally {
            setSendingEmail(false);
        }// try-catch-finally
    }; // confirmSendEmail

    // Handle not sending email
    const cancelSendEmail = () => {
        setShowSendEmailConfirm(false);
        setSendPromo(null);
    }; // cancelSendEmail

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    }; // formatDate

    // Display loading message while waiting for promos to render & load 
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl" style={{ color: '#FFFFFF' }}>Loading promos...</p>
            </div>
        ); // return
    } // if 

    return (
        <div className="min-h-screen" style={{ background: "var(--background)" }}>
            <div className="container mx-auto p-8">
                <div className="flex flex-col items-center mb-6">
                    <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--off-white)" }}>
                        Manage Promos
                    </h1>
                    <button onClick={() => router.push("/admin/addPromo")} className="px-8 py-4 rounded-lg font-semibold transition text-lg"
                        style={{ backgroundColor: "var(--red)", color: "var(--off-white)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--light-red)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--red)")}
                        >
                            Add Promo
                    </button>
                </div>

            <SearchBar onSearch={handleSearch} onGenreFilter={() => {}} genres={[]} showGenreFilter={false} showTitle={false} placeholder="Search promos..." />

            {error && (
                <p className="text-center py-4" style={{ color: "var(--pastel-red)" }}> {error} </p>
            )}

            {filteredPromos.length === 0 ? (
                <p className="text-center py-8" style={{ color: "var(--dark-gray)" }}>
                    No promos found.
                </p>
                ) : (
                <div className="mt-6 overflow-x-auto">
                    <table className="w-full border-collapse" style={{ borderColor: "var(--dark-gray)" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid var(--dark-gray)" }}>
                                <th className="p-4 text-left" style={{ color: "var(--off-white)" }}>Promo Code</th>
                                <th className="p-4 text-left" style={{ color: "var(--off-white)" }}>Discount</th>
                                <th className="p-4 text-left" style={{ color: "var(--off-white)" }}>Start Date</th>
                                <th className="p-4 text-left" style={{ color: "var(--off-white)" }}>End Date</th>
                                <th className="p-4 text-center" style={{ color: "var(--off-white)" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPromos.map((promo) => (
                                <tr key={promo._id} style={{ borderBottom: "1px solid var(--dark-gray)" }} className="hover:bg-opacity-10"
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(161, 22, 26, 0.1)")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                >
                                    <td className="p-4" style={{ color: "var(--off-white)" }}>
                                        {promo.promoCode}
                                    </td>
                                    <td className="p-4" style={{ color: "var(--off-white)" }}>
                                        {promo.discountPercent}%
                                    </td>
                                    <td className="p-4" style={{ color: "var(--off-white)" }}>
                                        {formatDate(promo.startDate)}
                                    </td>
                                    <td className="p-4" style={{ color: "var(--off-white)" }}>
                                        {formatDate(promo.endDate)}
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex gap-2 justify-center">
                                            <button onClick={() => handleEdit(promo._id)} className="px-4 py-2 rounded transition" style={{ backgroundColor: "var(--light-red)", color: "var(--off-white)" }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--pastel-red)")}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--light-red)")}
                                            >
                                            Edit
                                            </button>
                                            <button onClick={() => handleDelete(promo)} className="px-4 py-2 rounded transition" style={{ backgroundColor: "var(--dark-red)", color: "var(--off-white)" }}
                                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--red)")}
                                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--dark-red)")}
                                                >
                                                Delete
                                            </button>
                                            <button onClick={() => handleSendEmail(promo)} className="px-4 py-2 rounded transition" style={{ backgroundColor: "var(--red)", color: "var(--off-white)" }}
                                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--light-red)")}
                                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--red)")}
                                                >
                                                Send Email
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="rounded-lg p-6 max-w-md w-full mx-4" style={{ backgroundColor: "var(--dark2)" }}>
                        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--off-white)" }}>
                            Confirm Delete
                        </h2>
                            <p className="mb-6" style={{ color: "var(--dark-gray)" }}>
                                Are you sure you want to delete promo "{deletePromo?.promoCode}"?
                            </p>
                            <div className="flex gap-4 justify-end">
                                <button onClick={cancelDelete} className="px-4 py-2 rounded transition" style={{ backgroundColor: "var(--dark-gray)", color: "var(--darkest)" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--light-gray)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--dark-gray)")}
                                    >
                                        Cancel
                                </button>
                                <button onClick={confirmDelete} className="px-4 py-2 rounded transition" style={{ backgroundColor: "var(--red)", color: "var(--off-white)" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--light-red)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--red)")}
                                    >
                                        Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            {/* Send Email Confirmation Modal */}
            {showSendEmailConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="rounded-lg p-6 max-w-md w-full mx-4" style={{ backgroundColor: "var(--dark2)" }}>
                        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--off-white)" }}>
                            Send Promo Email?
                        </h2>
                        <div className="mb-6" style={{ color: "var(--dark-gray)" }}>
                            <p className="mb-2">
                                <strong style={{ color: "var(--off-white)" }}>Promo Code:</strong> {sendPromo?.promoCode}
                            </p>
                            <p className="mb-2">
                                <strong style={{ color: "var(--off-white)" }}>Discount:</strong> {sendPromo?.discountPercent}% off
                            </p>
                            <p className="mb-2">
                                <strong style={{ color: "var(--off-white)" }}>Valid:</strong> {formatDate(sendPromo?.startDate)} - {formatDate(sendPromo?.endDate)}
                            </p>
                            {sendPromo?.sentCount > 0 && (
                                <p className="mt-4 text-sm" style={{ color: "var(--light-gray)" }}>
                                    This promo has been sent {sendPromo.sentCount} time(s).
                                    {sendPromo.lastSentAt && ` Last sent: ${formatDate(sendPromo.lastSentAt)}`}
                                </p>
                            )}
                            <p className="mt-4">
                                This will send an email to all eligible subscribed users.
                            </p>
                        </div>
                        <div className="flex gap-4 justify-end">
                            <button onClick={cancelSendEmail} disabled={sendingEmail} className="px-4 py-2 rounded transition" style={{ backgroundColor: "var(--dark-gray)", color: "var(--darkest)" }}
                                onMouseEnter={(e) => !sendingEmail && (e.currentTarget.style.backgroundColor = "var(--light-gray)")}
                                onMouseLeave={(e) => !sendingEmail && (e.currentTarget.style.backgroundColor = "var(--dark-gray)")}
                                >
                                    Cancel
                            </button>
                            <button onClick={confirmSendEmail} disabled={sendingEmail} className="px-4 py-2 rounded transition" style={{ backgroundColor: "var(--red)", color: "var(--off-white)" }}
                                onMouseEnter={(e) => !sendingEmail && (e.currentTarget.style.backgroundColor = "var(--light-red)")}
                                onMouseLeave={(e) => !sendingEmail && (e.currentTarget.style.backgroundColor = "var(--red)")}
                                >
                                    {sendingEmail ? "Sending..." : "Send Email"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
    ); // return
} // ManagePromos