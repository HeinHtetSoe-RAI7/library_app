import api from "./axios";

export const scanBooks = async (folder) => {
  const url = folder ? `/scan?folder=${encodeURIComponent(folder)}` : "/scan";
  const response = await api.get(url);
  return response.data.message;
};

export const clearAllRecents = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to clear all recent books?"
  );
  if (!confirmed) return null;

  const response = await api.delete("/clear_all");
  return response.data.message;
};

export const clearFavourites = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to clear all favourite books?"
  );
  if (!confirmed) return null;

  const response = await api.delete("/remove_all_favourites");
  return response.data.message;
};

// // Function to scan books
// const scanBooks = async (folder) => {
//   const url = folder
//     ? `/scan_books?folder=${encodeURIComponent(folder)}`
//     : "/scan_books";
//   setScanLoading(true);

//   try {
//     const response = await api.get(url);
//     setSnackbarMessage(response.data.message);
//     fetchBooks(""); // refresh book list
//   } catch (error) {
//     setError("Failed to scan books: " + error);
//   } finally {
//     setScanLoading(false);
//   }
// };

// // Function to clear all recent books
// const clearAllRecents = async () => {
//   const confirmed = window.confirm(
//     "Are you sure you want to clear all recent books?"
//   );
//   if (!confirmed) {
//     return;
//   }
//   // Remove recents
//   try {
//     const response = await api.delete("/clear_all");
//     setRecents([]);
//     setSnackbarMessage(response.data.message);
//   } catch (error) {
//     setError("Failed to clear recent books: " + error);
//   }
// };
