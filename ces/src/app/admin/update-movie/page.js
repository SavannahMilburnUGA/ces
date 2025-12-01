// Update Movie Page for Admin - contains Edit Movie Form
"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function UpdateMovie() {
    const router = useRouter();
    // Using useSearchParams
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    
    const [form, setForm] = useState({
        title: "",
        posterUrl: "",
        rating: "",
        description: "",
        showDate: "",
        trailerUrl: "",
        genre: "",
        director: "",   
        producer: "",   
        cast: "",
    }); // form
    
    // Use state 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // Fetch existing movie data
    useEffect(() => {
        let alive = true;
        async function fetchMovie() {
            try {
                setLoading(true);
                setError("");
                const res = await fetch(`/api/movies/${id}`);

                if (!res.ok) {
                    throw new Error("Failed to fetch movie");
                } // if 

                const data = await res.json();
                
                if (alive) {
                    setForm({
                        title: data.title || "",
                        posterUrl: data.posterUrl || "",
                        rating: data.rating || "",
                        description: data.description || "",
                        trailerUrl: data.trailerUrl || "",
                        genre: data.genre || "",
                        director: data.director || "",   
                        producer: data.producer || "",   
                        cast: data.cast || "", 
                    }); // setForm
                } // if 
            } catch (err) {
                if (alive) {
                    setError(err.message);
                } // if 
            } finally {
                if (alive) {
                    setLoading(false);
                } // if 
            } // try-catch-finally 
        } // fetchMovie

        // Call fetchMovie function
        if (id)  {
            fetchMovie();
        } // if 
        return () => { alive = false; };
    }, [id]); // useEffect 

    // Update function
    function update(key, value) {
        setForm(prev => ({ ...prev, [key]: value }));
    } // update
    
    // Handle submit on Edit Movie form 
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await fetch(`/api/movies/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            }); // res
            if (!res.ok) {
                throw new Error("Failed to update movie");
            } // if 
            
            await res.json();
            
            router.push("/admin/manage-movies");
        } catch (err) {
            alert(err.message);
        } // try-catch
    } // handleSubmit 
    
    // Loading movie message 
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
                <p className="text-xl" style={{ color: "var(--off-white)" }}>Loading movie...</p>
            </div>
        ); // return
    } // if 
    
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
                <p className="text-xl" style={{ color: "var(--pastel-red)" }}>{error}</p>
            </div>
        ); // return
    } // if 
    
    return (
        <main className="min-h-dvh text-slate-100 flex items-start justify-center p-6" style={{ background: "var(--background)" }}>
            <section className="w-full max-w-4xl border rounded-2xl shadow-xl p-6 md:p-8" style={{ backgroundColor: "var(--dark2)", borderColor: "var(--dark-red)" }}>
                <div className="flex justify-end mb-4">
                    <button onClick={() => router.push("/admin")} className="px-4 py-2 rounded-lg transition" style={{ backgroundColor: "var(--dark-gray)", color: "var(--darkest)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--light-gray)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--dark-gray)")}
                        >
                            Admin Home
                    </button>
                </div>
                <div>
                    <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--off-white)" }}>Update Movie</h1>
                    <form onSubmit={handleSubmit}>
                        <label style={{ color: "var(--off-white)" }}> Title
                            <input className="w-full rounded-lg border p-2 mt-1" style={{ backgroundColor: "var(--dark2)", color: "var(--off-white)", borderColor: "var(--dark-gray)" }}
                                value={form.title} onChange={e => update("title", e.target.value)} required 
                            />
                        </label>
                        <br/><br/>
                        <label style={{ color: "var(--off-white)" }}> Poster URL
                            <input className="w-full rounded-lg border p-2 mt-1" style={{ backgroundColor: "var(--dark2)", color: "var(--off-white)", borderColor: "var(--dark-gray)" }}
                                value={form.posterUrl} onChange={e => update("posterUrl", e.target.value)} required 
                            />
                        </label>
                        <br/><br/>
                        
                        <label style={{ color: "var(--off-white)" }}> Rating
                            <input className="w-full rounded-lg border p-2 mt-1" style={{ backgroundColor: "var(--dark2)", color: "var(--off-white)", borderColor: "var(--dark-gray)" }}
                                value={form.rating} onChange={e => update("rating", e.target.value)} />
                        </label>
                        <br/><br/>
                        <label style={{ color: "var(--off-white)" }}> Description
                            <textarea className="w-full rounded-lg border p-2 mt-1" style={{ backgroundColor: "var(--dark2)", color: "var(--off-white)", borderColor: "var(--dark-gray)" }}
                                value={form.description} onChange={e => update("description", e.target.value)} required />
                        </label>
                        <br/><br/>

                        {/*Director */}
                        <label style={{ color: "var(--off-white)" }}> Director
                            <input
                                className="w-full rounded-lg border p-2 mt-1"
                                style={{
                                    backgroundColor: "var(--dark2)",
                                    color: "var(--off-white)",
                                    borderColor: "var(--dark-gray)",
                                }}
                                value={form.director}
                                onChange={(e) => update("director", e.target.value)}
                                required
                            />
                        </label>
                        <br /><br />

                        {/*Producer */}
                        <label style={{ color: "var(--off-white)" }}> Producer(s)
                            <input
                                className="w-full rounded-lg border p-2 mt-1"
                                style={{
                                    backgroundColor: "var(--dark2)",
                                    color: "var(--off-white)",
                                    borderColor: "var(--dark-gray)",
                                }}
                                value={form.producer}
                                onChange={(e) => update("producer", e.target.value)}
                                required
                            />
                        </label>
                        <br /><br />

                        {/* Cast */}
                        <label style={{ color: "var(--off-white)" }}> Cast
                            <textarea
                                className="w-full rounded-lg border p-2 mt-1"
                                style={{
                                    backgroundColor: "var(--dark2)",
                                    color: "var(--off-white)",
                                    borderColor: "var(--dark-gray)",
                                }}
                                value={form.cast}
                                onChange={(e) => update("cast", e.target.value)}
                                required
                            />
                        </label>
                        <br /><br />

                        <label style={{ color: "var(--off-white)" }}> Trailer URL
                            <input className="w-full rounded-lg border p-2 mt-1" style={{ backgroundColor: "var(--dark2)", color: "var(--off-white)", borderColor: "var(--dark-gray)" }} 
                                value={form.trailerUrl} onChange={e => update("trailerUrl", e.target.value)} required />
                        </label>
                        <br/><br/>
                        <label style={{ color: "var(--off-white)" }}> Genre
                            <input className="w-full rounded-lg border p-2 mt-1" style={{ backgroundColor: "var(--dark2)", color: "var(--off-white)", borderColor: "var(--dark-gray)" }}
                                value={form.genre} onChange={e => update("genre", e.target.value)} required />
                        </label>
                        <br/><br/>
                        <div className="flex justify-center gap-4">
                            <button type="button" onClick={() => router.push("/admin/manage-movies")} className="px-6 py-2 rounded transition" style={{ backgroundColor: "var(--dark-gray)", color: "var(--darkest)" }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--light-gray)")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--dark-gray)")}
                                >
                                    Cancel
                            </button>
                            <button 
                                className="px-6 py-2 rounded transition"
                                style={{ backgroundColor: "var(--red)", color: "var(--off-white)" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--light-red)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--red)")}
                                    type="submit"
                                >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </section> 
        </main> 
    ); // return 
} // UpdateMovie 