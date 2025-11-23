// Manage Movies Home page for Admin
// Can add a new movie, edit movie info, or delete a movie from the database and system. 
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/SearchBar";

export default function ManageMovies() {
    const router = useRouter();
    // Using state
    const [allMovies, setAllMovies] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteMovie, setDeleteMovie] = useState(null);

    // Fetch movies from /api/movies
    useEffect(() => {
        // Handling memory leaks 
        let alive = true;
        async function fetchMovies() {
            try {
                setLoading(true);
                setError("");
                const res = await fetch("/api/movies");
                const data = await res.json();

                const arr = Array.isArray(data)
                    ? data  
                    : Array.isArray(data?.movies)
                    ? data.movies
                    : []; // arr
                
                if (alive) {
                    setAllMovies(arr);
                } // if 
            } catch (error) {
                if (alive) {
                    setError(error.message || "Failed to fetch movies. ");
                } // if 
            } finally {
                if (alive) {
                    setLoading(false);
                } // if 
            } // try-catch-finally
        } // fetchMovies 

        // Calling function
        fetchMovies();
        return () => {
            alive = false;
        }; // return
    }, []); // useEffect 

    // Handle searching existing movie table 
    const handleSearch = (searchTerm) => {
        setSearch(searchTerm);
    }; // handleSearch

    // Filter movie table by searched movie title 
    const filteredMovies = allMovies
        .filter((movie) => 
            movie.title.toLowerCase().includes(search.toLowerCase())
        ) // filter
        // A to Z sorting 
        .sort((a, b) => a.title.localeCompare(b.title)); // filteredMovies
    
    // Handle editing/updating a movie
    const handleEdit = (movieId) => {
        router.push(`/admin/update-movie?id=${movieId}`);
    }; // handleEdit 

    // Handle deleting a movie 
    const handleDelete = (movie) => {
        setDeleteMovie(movie);
        setShowDeleteConfirm(true);
    }; // handleDelete

    // Handle deleting a movie after confirming 
    const confirmDelete = async () => {
        try {
            const res = await fetch(`/api/movies/${deleteMovie._id}`, {
                method: "DELETE", 
            }); // res

            if (!res.ok) throw new Error("Failed to delete movie.");

            // Remove from local state
            setAllMovies(allMovies.filter((m) => m._id !== deleteMovie._id));
            setShowDeleteConfirm(false);
            setDeleteMovie(null);
        } catch (error) {
            alert(error.message);
        } // try-catch 
    }; // confirmDelete

    // Handle not deleting a movie 
    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setDeleteMovie(null);
    }; // cancelDelete

     // Display loading message while waiting for movies to render & load 
    if (loading) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-xl" style={{ color: '#FFFFFF' }}>Loading movies...</p>
        </div>
        ); // return
    } // if 

    return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
        <div className="container mx-auto p-8">
            <div className="flex flex-col items-center mb-6">
                <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--off-white)" }}>
                    Manage Movies
                </h1>
                <button onClick={() => router.push("/admin/addMovie")} className="px-8 py-4 rounded-lg font-semibold transition text-lg"
                    style={{ backgroundColor: "var(--red)", color: "var(--off-white)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--light-red)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--red)")}
                    >
                        Add Movie
                </button>
            </div>

        <SearchBar onSearch={handleSearch} onGenreFilter={() => {}} genres={[]} showGenreFilter={false} showTitle={false}/>

        {error && (
            <p className="text-center py-4" style={{ color: "var(--pastel-red)" }}> {error} </p>
        )}

        {filteredMovies.length === 0 ? (
            <p className="text-center py-8" style={{ color: "var(--dark-gray)" }}>
                No movies found.
            </p>
            ) : (
            <div className="mt-6 overflow-x-auto">
                <table className="w-full border-collapse" style={{ borderColor: "var(--dark-gray)" }}>
                    <tbody>
                        {filteredMovies.map((movie) => (
                            <tr key={movie._id} style={{ borderBottom: "1px solid var(--dark-gray)" }} className="hover:bg-opacity-10"
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(161, 22, 26, 0.1)")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                            >
                                <td className="p-4" style={{ color: "var(--off-white)" }}>
                                {movie.title}
                                </td>
                                <td className="p-4 text-center">
                                    <button onClick={() => handleEdit(movie._id)} className="px-4 py-2 rounded transition" style={{ backgroundColor: "var(--light-red)", color: "var(--off-white)" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--pastel-red)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--light-red)")}
                                    >
                                    Edit
                                    </button>
                                </td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => router.push(`/admin/schedule-movie?id=${movie._id}`)}
                                        className="px-4 py-2 rounded transition"
                                        style={{ backgroundColor: "var(--light-red)", color: "var(--off-white)" }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--pastel-red)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--light-red)")}
                                    >
                                        Schedule
                                    </button>
                                    </td>

                                <td className="p-4 text-center">
                                <button onClick={() => handleDelete(movie)} className="px-4 py-2 rounded transition" style={{ backgroundColor: "var(--dark-red)", color: "var(--off-white)" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--red)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--dark-red)")}
                                    >
                                    Delete
                                </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
        </div>
        {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="rounded-lg p-6 max-w-md w-full mx-4" style={{ backgroundColor: "var(--dark2)" }}>
                    <h2 className="text-xl font-bold mb-4" style={{ color: "var(--off-white)" }}>
                        Confirm Delete
                    </h2>
                        <p className="mb-6" style={{ color: "var(--dark-gray)" }}>
                            Are you sure you want to delete "{deleteMovie?.title}"?
                        </p>
                        <div className="flex gap-4 justify-end">
                            <button onClick={cancelDelete} className="px-4 py-2 rounded transition" style={{ backgroundColor: "var(--dark-gray)", color: "var(--darkest)" }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--light-gray)")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--dark-gray)")}
                                >
                                    No
                            </button>
                            <button onClick={confirmDelete} className="px-4 py-2 rounded transition" style={{ backgroundColor: "var(--red)", color: "var(--off-white)" }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--light-red)")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--red)")}
                                >
                                    Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    ); // return 
} // ManageMovies