export const formatBooks = (items, defaultGenre = "General") => {
  return items
    .filter(item => item.volumeInfo?.imageLinks?.thumbnail)

    .map((item, index) => ({
      id: index + 1,
      name: item.volumeInfo?.title || "Unknown Book",
      genre: defaultGenre,

      image: item.volumeInfo.imageLinks.thumbnail,

      price: Math.floor(Math.random() * 500) + 100,

      rating: (Math.random() * 2 + 3).toFixed(1),
    }));
};
