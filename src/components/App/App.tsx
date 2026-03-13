import { useEffect, useState } from "react";
import "./App.css";
import styles from "./App..module.css"
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import type { Movie } from "../../types/movie";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import fetchMovies from "../../services/movieService";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from 'react-paginate';

export default function App() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
  });

useEffect(() => {
  if (!isLoading && data && data.results.length === 0) {
    toast("No movies found for your request.");
  }
}, [data, isLoading]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setMovie(null);
  };

  const handleSubmit = (query: string) => {
    setQuery(query);
  };

  const handleClickFilm = (movie: Movie): void => {
    openModal();
    setMovie(movie);
  };

  const totalMovies = data ? data.results.length : 0;

  const movies = data?.results || [];
  const totalPages = data?.total_pages ?? 0;
  const isPagination = totalPages > 1 

  return (
    <>
     
      <SearchBar onSubmit={handleSubmit} />
      <Toaster />

      {isLoading && <Loader />}
      {totalMovies !== 0 && (
        <MovieGrid onSelect={handleClickFilm} movies={movies} />
      )}

      {isPagination &&<ReactPaginate 
        pageCount={totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => setPage(selected + 1)}
        forcePage={page - 1}
        containerClassName={styles.pagination}
        activeClassName={styles.active}
        nextLabel="→"
        previousLabel="←"
      />}
      
      {isError && <ErrorMessage />}

      {isModalOpen && movie && (
        <MovieModal movie={movie} onClose={closeModal} />
      )}
    </>
  );
}
