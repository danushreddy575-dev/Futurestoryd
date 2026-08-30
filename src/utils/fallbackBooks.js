const fallbackLibrary = {
  Fiction: [
    ["fallback-fiction-gatsby", "The Great Gatsby", "F. Scott Fitzgerald", "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg"],
    ["fallback-fiction-pride", "Pride and Prejudice", "Jane Austen", "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg"],
    ["fallback-fiction-alchemist", "The Alchemist", "Paulo Coelho", "https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg"],
    ["fallback-fiction-hobbit", "The Hobbit", "J.R.R. Tolkien", "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg"],
    ["fallback-fiction-1984", "1984", "George Orwell", "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg"],
    ["fallback-fiction-kite", "The Kite Runner", "Khaled Hosseini", "https://covers.openlibrary.org/b/isbn/9781594631931-L.jpg"],
  ],
  Nonfiction: [
    ["fallback-nonfiction-atomic", "Atomic Habits", "James Clear", "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg"],
    ["fallback-nonfiction-money", "The Psychology of Money", "Morgan Housel", "https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg"],
    ["fallback-nonfiction-educated", "Educated", "Tara Westover", "https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg"],
    ["fallback-nonfiction-sapiens", "Sapiens", "Yuval Noah Harari", "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg"],
    ["fallback-nonfiction-deep", "Deep Work", "Cal Newport", "https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg"],
    ["fallback-nonfiction-mindset", "Mindset", "Carol S. Dweck", "https://covers.openlibrary.org/b/isbn/9780345472328-L.jpg"],
  ],
  Comics: [
    ["fallback-comics-solo", "Solo Leveling", "Chugong", "https://covers.openlibrary.org/b/isbn/9781975319434-L.jpg"],
    ["fallback-comics-batman", "Batman: Year One", "Frank Miller", "https://covers.openlibrary.org/b/isbn/9781401207526-L.jpg"],
    ["fallback-comics-onepiece", "One Piece", "Eiichiro Oda", "https://covers.openlibrary.org/b/isbn/9781569319017-L.jpg"],
    ["fallback-comics-watchmen", "Watchmen", "Alan Moore", "https://covers.openlibrary.org/b/isbn/9780930289232-L.jpg"],
    ["fallback-comics-naruto", "Naruto, Vol. 1", "Masashi Kishimoto", "https://covers.openlibrary.org/b/isbn/9781569319000-L.jpg"],
    ["fallback-comics-maus", "Maus", "Art Spiegelman", "https://covers.openlibrary.org/b/isbn/9780679406419-L.jpg"],
  ],
  Children: [
    ["fallback-children-charlotte", "Charlotte's Web", "E. B. White", "https://covers.openlibrary.org/b/isbn/9780064400558-L.jpg"],
    ["fallback-children-matilda", "Matilda", "Roald Dahl", "https://covers.openlibrary.org/b/isbn/9780142410370-L.jpg"],
    ["fallback-children-gruffalo", "The Gruffalo", "Julia Donaldson", "https://covers.openlibrary.org/b/isbn/9780142403877-L.jpg"],
    ["fallback-children-wild", "Where the Wild Things Are", "Maurice Sendak", "https://covers.openlibrary.org/b/isbn/9780060254926-L.jpg"],
    ["fallback-children-potter", "Harry Potter", "J. K. Rowling", "https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg"],
    ["fallback-children-prince", "The Little Prince", "Antoine de Saint-Exupery", "https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg"],
  ],
};

const ratings = ["4.7", "4.5", "4.4", "4.6", "4.3", "4.8"];

export const getFallbackBooks = (genre = "Fiction", limit = 10) => {
  const source = fallbackLibrary[genre] || fallbackLibrary.Fiction;

  return Array.from({ length: limit }, (_, index) => {
    const [id, name, author, image] = source[index % source.length];

    return {
      id: `${id}-${index + 1}`,
      name,
      genre,
      image,
      authors: [author],
      description: "",
      pageCount: null,
      publisher: "",
      publishedDate: "",
      averageRating: Number(ratings[index % ratings.length]),
      ratingsCount: null,
      previewLink: "",
      infoLink: "",
      price: null,
      priceLabel: "Check store prices",
      rating: ratings[index % ratings.length],
    };
  });
};

export const getFallbackSearchBooks = (query = "", limit = 12) => {
  const cleanQuery = query.toLowerCase();
  const allBooks = Object.keys(fallbackLibrary).flatMap((genre) =>
    getFallbackBooks(genre, fallbackLibrary[genre].length)
  );
  const matches = allBooks.filter((book) => {
    const author = book.authors?.[0] || "";
    return (
      book.name.toLowerCase().includes(cleanQuery) ||
      author.toLowerCase().includes(cleanQuery) ||
      book.genre.toLowerCase().includes(cleanQuery)
    );
  });

  return (matches.length ? matches : allBooks).slice(0, limit);
};
