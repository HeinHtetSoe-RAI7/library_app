from pathlib import Path
import asyncio
from pypdf import PdfReader, PdfWriter

from queries.books import add_books_bulk, book_exists


def extract_year_from_creation_date(metadata):
    creation_date = metadata.get("/CreationDate")
    if (
        creation_date and len(creation_date) >= 6 and creation_date.startswith("D:")
    ):  # creation_date looks like "D:YYYYMMDDHHmmSS"
        return int(creation_date[2:6])  # extract YYYY as int
    return 0


def extract_pdf_metadata(folder: str) -> list:
    folder_path = Path(folder)
    all_metadata = []
    for file in folder_path.glob("*.pdf*"):
        try:
            reader = PdfReader(file)
            metadata = reader.metadata or {}
            year = extract_year_from_creation_date(metadata)
            num_pages = len(reader.pages)
            file_info = {
                "File": file.name,
                "Title": metadata.get("/Title", "Unknown Title"),
                "Author": metadata.get("/Author", "Unknown"),
                "Year": year,
                "Pages": num_pages,
            }
            file_info.update(metadata)
            all_metadata.append(file_info)
        except Exception as e:
            all_metadata.append({"File": file.name, "Error": str(e)})
    return all_metadata


def safe_str(val):
    if isinstance(val, bytes):
        val = val.decode("utf-8", errors="ignore")
    return str(val).replace("\x00", "")


async def scan_books(folder: str) -> dict:
    folder_path = Path(folder)
    data = await asyncio.to_thread(extract_pdf_metadata, str(folder_path))
    books_to_add = []
    errors = []
    skipped = []

    for data_item in data:
        if "Error" in data_item:
            errors.append(
                {
                    "file": safe_str(data_item.get("File", "Unknown file")),
                    "error": safe_str(data_item["Error"]),
                }
            )
        else:
            file_name = safe_str(data_item.get("File"))
            book_link = f"/books_static/{file_name}"
            if not await book_exists(book_link):
                books_to_add.append(
                    {
                        "title": safe_str(data_item.get("/Title", "Unknown Title")),
                        "author": safe_str(data_item.get("Author", "Unknown Author")),
                        "year": data_item.get("Year", 0),
                        "pages": data_item.get("Pages", 0),
                        "book_link": book_link,
                        "image_path": f"/images_static/{Path(file_name).stem}.jpg",
                    }
                )
            else:
                skipped.append(file_name)

    added_count = 0
    if books_to_add:
        await add_books_bulk(books_to_add)
        added_count = len(books_to_add)

    return {"added": added_count, "skipped": skipped, "errors": errors}


async def update_pdf_metadata(book_path, metadata_dict) -> None:
    def _update_pdf():
        pdf_path_obj = Path(book_path)
        if not pdf_path_obj.exists():
            print(f"File not found: {pdf_path_obj}")
            return
        try:
            reader = PdfReader(pdf_path_obj)
            writer = PdfWriter()
            for page in reader.pages:
                writer.add_page(page)
            metadata = reader.metadata or {}
            metadata.update(metadata_dict)
            writer.add_metadata(metadata)
            with open(pdf_path_obj, "wb") as f:
                writer.write(f)
        except Exception as e:
            print(f"Error updating PDF metadata for {pdf_path_obj}: {e}")

    await asyncio.to_thread(_update_pdf)


# async def scan_books(folder: str) -> dict:
#     folder_path = Path(folder)
#     data = await asyncio.to_thread(extract_pdf_metadata, str(folder_path))
#     books_to_add = []
#     errors = []
#     skipped = []

#     for data_item in data:
#         if "Error" in data_item:
#             errors.append({
#                 "file": data_item.get("File", "Unknown file"),
#                 "error": data_item["Error"]
#             })
#         else:
#             file_name = data_item.get("File")
#             book_link = f"/books/{file_name}"
#             if not await book_exists(book_link):
#                 books_to_add.append({
#                     "title": data_item.get("/Title", "Unknown Title"),
#                     "author": data_item.get("Author", "Unknown Author"),
#                     "year": data_item.get("Year", 0),
#                     "pages": data_item.get("Pages", 0),
#                     "book_link": book_link,
#                     "image_path": f"/images/{Path(file_name).stem}.jpg"
#                 })
#             else:
#                 skipped.append(file_name)
#     added_count = 0
#     if books_to_add:
#         await add_books_bulk(books_to_add)
#         added_count = len(books_to_add)
#     return {"added": added_count, "skipped": skipped, "errors": errors}
