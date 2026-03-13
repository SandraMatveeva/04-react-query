import axios from "axios";
import type { Movie } from "../types/movie";

interface ResponseResult {
  results: Movie[];
  total_pages: number
}

export default async function fetchMovies(query: string, page: number): Promise<ResponseResult>  {
   const result = await axios.get<ResponseResult>(
    `https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    },
  );

  return result.data
}
