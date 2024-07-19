import { useState, useEffect } from "react";

const Key = "4ed86282";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, SetIsLoading] = useState(false);
  const [error, SetError] = useState("");

  useEffect(
    function () {
      //  callBack?.();

      const controller = new AbortController();
      async function fetchMovies() {
        try {
          SetIsLoading(true);

          SetError("");

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${Key}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("something went wrong with fetching movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("movie not found");

          setMovies(data.Search);
        } catch (err) {
          if (err.name !== "AbortError") {
            SetError(err.message);
          }
        } finally {
          SetIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        SetError("");
        return;
      }

      //handleCloseMovie()
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
