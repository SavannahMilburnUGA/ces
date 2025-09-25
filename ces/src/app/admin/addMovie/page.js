"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminAddMovie() {
  const [form, setForm] = useState({
    title: "",
    posterUrl: "",
    rating: "",
    description: "",
    showDate: "",
    trailerUrl: "",
    genre: ""
  });
  const router = useRouter();

  function update(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
    // send POST request 
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      // in case movie fails to save
      if (!res.ok) throw new Error("Failed to save movie");
      await res.json();

      router.push("/"); // go back home after adding
    } catch (err) {
      alert(err.message);
    }
  }

    return (
    <main className="min-h-dvh bg-white text-slate-100 flex items-start justify-center p-6">
      <section className="w-full max-w-4xl bg-white border border-slate-800 rounded-2xl shadow-xl p-6 md:p-8">
      <div>
      <h1 className="text-2xl font-bold text-black">Add Movie</h1>
      <section className="text-black">
      <form onSubmit={handleSubmit}>
         
        <label >
          Title
          <input 
          className="w-full rounded-lg border border-black" 
          value={form.title} onChange={e=>update("title", e.target.value)} required 
          />
        </label>
        <br/><br/>

        <label>
          Poster URL
          <input 
          className="w-full rounded-lg border border-black" 
          value={form.posterUrl} onChange={e=>update("posterUrl", e.target.value)} required 
          />
        </label>
        <br/><br/>

        <label>
          Rating
          <input 
          className="w-full rounded-lg border border-black" 
          value={form.rating} onChange={e=>update("rating", e.target.value)}
          />
        </label>
        <br/><br/>

        <label>
          Description
          <textarea 
          className="w-full rounded-lg border border-black" 
          value={form.description} onChange={e=>update("description", e.target.value)} required
           />
        </label>
        <br/><br/>

        <label>
          Show Date
          <input 
          className="w-full rounded-lg border border-black" 
          type="date" 
          value={form.showDate} onChange={e=>update("showDate", e.target.value)} required
           />
        </label>
        <br/><br/>

        <label>
          Trailer URL
          <input 
          className="w-full rounded-lg border border-black" 
          value={form.trailerUrl} onChange={e=>update("trailerUrl", e.target.value)} required 
          />
        </label>
        <br/><br/>

        <label>
          Genre
          <input 
          className="w-full rounded-lg border border-black" 
          value={form.genre} onChange={e=>update("genre", e.target.value)} required
           />
        </label>
        <br/><br/>

        <button 
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        type="submit">
          Add Movie
        </button>
      </form>
  </section>
    </div>
    </section> 
    </main> 
  );
}
