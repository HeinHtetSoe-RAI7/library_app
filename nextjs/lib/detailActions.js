import api from "@/lib/axios";

/**
 * Toggle favourite status of a book.
 */
export async function toggleFavourite(bookId, isFavourite) {
  if (!bookId) throw new Error("Book ID is required");

  if (!isFavourite) {
    await api.post("/favourites", { book_id: bookId });
    return true;
  } else {
    await api.delete(`/favourites/${bookId}`);
    return false;
  }
}

/**
 * Update book details.
 */
export async function updateBook(book, formData) {
  if (!book?.id) throw new Error("Book not found");

  const payload = {
    book_id: book.id,
    book_link: book.book_link,
    title: formData.title,
    author: formData.author,
    year: formData.year ? Number(formData.year) : undefined,
    image_path: formData.image_path,
  };

  const res = await api.post("/books/update", payload, {
    headers: { "Content-Type": "application/json" },
  });

  return res.data;
}

/**
 * Upsert Note for each book
 */
export async function upsertNote(bookId, note) {
  if (!bookId) throw new Error("Book ID is required");

  const payload = {
    book_id: bookId,
    note: note,
  };

  try {
    const res = await api.post("/notes", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    console.error("Error upserting note:", err);
    throw err;
  }
}
/**
 * Add to recent on Read button clicked
 */
export async function addToRecent(bookId) {
  try {
    await api.post("/recents", { book_id: bookId });
  } catch (err) {
    console.error("Failed to add to recent", err);
    throw err;
  }
}

// // Handle favourite button click
// const handleFavouriteClick = async () => {
//   setFavLoading(true);
//   try {
//     if (!favourite) {
//       await api.post("/add_favourite", { book_id: book.id });
//       setFavourite(true);
//     } else {
//       await api.delete(`/remove_favourite/${book.id}`);
//       setFavourite(false);
//     }
//   } catch (error) {
//     alert(
//       "Favourite failed: " + (error.response?.data?.detail || error.message)
//     );
//   } finally {
//     setFavLoading(false);
//   }
// };

// const handleEditSubmit = async (formData) => {
//   const payload = {
//     book_id: book.id,
//     book_link: book.book_link,
//     title: formData.title,
//     author: formData.author,
//     year: formData.year ? Number(formData.year) : undefined,
//     image_path: formData.image_path,
//   };
//   try {
//     const res = await api.post("/update", payload, {
//       headers: { "Content-Type": "application/json" },
//     });
//     alert("Book updated successfully!");
//     setCurrentBook((prev) => ({ ...prev, ...formData }));
//     setEditOpen(false);
//   } catch (error) {
//     alert(
//       "Update failed: " + (error.response?.data?.detail || error.message)
//     );
//   }
// };
