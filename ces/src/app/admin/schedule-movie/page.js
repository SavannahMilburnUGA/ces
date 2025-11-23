"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SHOWROOMS = ["Showroom 1", "Showroom 2", "Showroom 3"];

export default function ScheduleMoviePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieId = searchParams.get("id");

  const [movie, setMovie] = useState(null);
  const [showroom, setShowroom] = useState(SHOWROOMS[0]);
  const [dateTime, setDateTime] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Load movie with existing showtimes
  useEffect(() => {
    if (!movieId) return;

    async function fetchMovie() {
      try {
        setLoading(true);
        const res = await fetch(`/api/movies/${movieId}`);
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        setError("Failed to load movie.");
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [movieId]);

  //Add a showtime
  async function handleAddShowtime(e) {
    e.preventDefault();
    setError("");

    if (!dateTime) {
      setError("Please select a date and time.");
      return;
    }

    try {
      const res = await fetch("/api/schedule-showtime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, showroom, dateTime }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong scheduling the showtime.");
        return;
      }

      // append new showtime to state
      setMovie((prev) => ({
        ...prev,
        showtimes: [...(prev.showtimes || []), data],
      }));

      setDateTime("");
    } catch (err) {
      setError("Something went wrong scheduling the showtime.");
    }
  }

  // Delete a showtime
  async function handleDeleteShowtime(st) {
    setError("");

    try {
      const res = await fetch("/api/schedule-showtime", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId,
          showroom: st.showroom,
          dateTime: st.dateTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to delete showtime.");
        return;
      }

      // Remove from local state
      setMovie((prev) => ({
        ...prev,
        showtimes: (prev.showtimes || []).filter(
          (s) =>
            !(
              s.showroom === st.showroom &&
              new Date(s.dateTime).getTime() ===
                new Date(st.dateTime).getTime()
            )
        ),
      }));
    } catch (err) {
      setError("Something went wrong deleting the showtime.");
    }
  }

  if (loading || !movie) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--background)" }}
      >
        <p className="text-xl" style={{ color: "var(--off-white)" }}>
          Loading movie...
        </p>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen flex justify-center p-6"
      style={{ background: "var(--background)" }}
    >
      <section
        className="w-full max-w-3xl rounded-2xl border shadow-xl p-6 md:p-8"
        style={{
          backgroundColor: "var(--dark2)",
          borderColor: "var(--dark-red)",
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--off-white)" }}
          >
            Schedule Showtimes – {movie.title}
          </h1>
          <button
            onClick={() => router.push("/admin/manage-movies")}
            className="px-4 py-2 rounded-lg transition"
            style={{
              backgroundColor: "var(--dark-gray)",
              color: "var(--darkest)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--light-gray)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--dark-gray)")
            }
          >
            Admin Home
          </button>
        </div>

        {error && (
          <p className="mb-4" style={{ color: "var(--pastel-red)" }}>
            {error}
          </p>
        )}

        {/* Existing showtimes with Delete button */}
        <h2
          className="text-xl font-semibold mb-3"
          style={{ color: "var(--off-white)" }}
        >
          Existing Showtimes
        </h2>
        {movie.showtimes && movie.showtimes.length > 0 ? (
          <ul className="mb-6 divide-y divide-gray-700">
            {movie.showtimes
              .slice()
              .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
              .map((st, idx) => (
                <li
                  key={idx}
                  className="py-2 flex justify-between items-center"
                >
                  <span>
                    <span className="font-semibold">{st.showroom}</span>{" "}
                    –{" "}
                    {new Date(st.dateTime).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                  <button
                    onClick={() => handleDeleteShowtime(st)}
                    className="px-3 py-1 text-sm rounded-lg transition"
                    style={{
                      backgroundColor: "var(--dark-red)",
                      color: "var(--off-white)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#b91c1c")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "var(--dark-red)")
                    }
                  >
                    Delete
                  </button>
                </li>
              ))}
          </ul>
        ) : (
          <p className="mb-6 text-sm" style={{ color: "var(--light-gray)" }}>
            No showtimes scheduled yet.
          </p>
        )}

        {/* Add showtime form */}
        <h2
          className="text-xl font-semibold mb-3"
          style={{ color: "var(--off-white)" }}
        >
          Add Showtime
        </h2>

        <form onSubmit={handleAddShowtime} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <label style={{ color: "var(--off-white)" }}>
              Showroom
              <select
                value={showroom}
                onChange={(e) => setShowroom(e.target.value)}
                className="w-full mt-1 rounded-lg border p-2"
                style={{
                  backgroundColor: "var(--dark2)",
                  color: "var(--off-white)",
                  borderColor: "var(--dark-gray)",
                }}
              >
                {SHOWROOMS.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ color: "var(--off-white)" }}>
              Date &amp; Time
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full mt-1 rounded-lg border p-2"
                style={{
                  backgroundColor: "var(--dark2)",
                  color: "var(--off-white)",
                  borderColor: "var(--dark-gray)",
                }}
                required
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-4 w-full md:w-auto px-6 py-2 rounded-lg font-semibold transition"
            style={{
              backgroundColor: "var(--dark-red)",
              color: "var(--off-white)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#b91c1c")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--dark-red)")
            }
          >
            Add Showtime
          </button>
        </form>
      </section>
    </main>
  );
}
