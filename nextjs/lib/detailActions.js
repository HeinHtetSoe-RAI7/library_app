import api from "@/lib/axios";

/**
 * Toggle favourite status of a book.
 */
export async function toggleFavourite(bookId, isFavourite) {
  if (!bookId) throw new Error("Book ID is required");

  if (!isFavourite) {
    await api.post("/add_favourite", { book_id: bookId });
    return true;
  } else {
    await api.delete(`/remove_favourite/${bookId}`);
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

  const res = await api.post("/update", payload, {
    headers: { "Content-Type": "application/json" },
  });

  return res.data;
}
