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
      <div>
      <h1>Add Movie</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input value={form.title} onChange={e=>update("title", e.target.value)} required />
        </label>
        <br/><br/>

        <label>
          Poster URL
          <input value={form.posterUrl} onChange={e=>update("posterUrl", e.target.value)} required />
        </label>
        <br/><br/>

        <label>
          Rating
          <input value={form.rating} onChange={e=>update("rating", e.target.value)} />
        </label>
        <br/><br/>

        <label>
          Description
          <textarea value={form.description} onChange={e=>update("description", e.target.value)} required />
        </label>
        <br/><br/>

        <label>
          Show Date
          <input type="date" value={form.showDate} onChange={e=>update("showDate", e.target.value)} required />
        </label>
        <br/><br/>

        <label>
          Trailer URL
          <input value={form.trailerUrl} onChange={e=>update("trailerUrl", e.target.value)} required />
        </label>
        <br/><br/>

        <label>
          Genre
          <input value={form.genre} onChange={e=>update("genre", e.target.value)} required />
        </label>
        <br/><br/>

        <button type="submit">Add Movie</button>
      </form>
    </div>
  );
}
