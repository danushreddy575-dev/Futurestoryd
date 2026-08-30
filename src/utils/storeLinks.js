export const getStoreLinks = (book) => {
  const query = encodeURIComponent(
    [book.name, ...(book.authors || [])].filter(Boolean).join(" ")
  );

  return [
    {
      name: "Google Books",
      description: "Preview, ebook info, and Google listing",
      url: book.infoLink || `https://books.google.com/books?q=${query}`,
    },
    {
      name: "Amazon",
      description: "Check paperback, Kindle, and delivery options",
      url: `https://www.amazon.in/s?k=${query}`,
    },
    {
      name: "Flipkart",
      description: "Compare Indian marketplace listings",
      url: `https://www.flipkart.com/search?q=${query}`,
    },
    {
      name: "BookFinder",
      description: "Search new, used, and international editions",
      url: `https://www.bookfinder.com/search/?keywords=${query}`,
    },
    {
      name: "AbeBooks",
      description: "Find used, rare, and imported copies",
      url: `https://www.abebooks.com/servlet/SearchResults?kn=${query}`,
    },
    {
      name: "Google Shopping",
      description: "Scan prices across multiple sellers",
      url: `https://www.google.com/search?tbm=shop&q=${query}`,
    },
  ];
};
