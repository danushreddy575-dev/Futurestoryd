const getPriceDetails = (saleInfo) => {
  if (saleInfo?.saleability === "FREE") {
    return {
      price: 0,
      priceLabel: "Free ebook",
    };
  }

  const salePrice = saleInfo?.retailPrice || saleInfo?.listPrice;

  if (saleInfo?.saleability === "FOR_SALE" && salePrice?.amount) {
    return {
      price: salePrice.amount,
      priceLabel: `${salePrice.currencyCode || ""} ${salePrice.amount}`.trim(),
    };
  }

  return {
    price: null,
    priceLabel: "Check store prices",
  };
};

export const formatBooks = (items, defaultGenre = "General") => {
  return items
    .filter(item => item.volumeInfo?.imageLinks?.thumbnail)

    .map((item, index) => {
      const priceDetails = getPriceDetails(item.saleInfo);

      return {
        id: item.id || `${defaultGenre}-${index + 1}`,
        name: item.volumeInfo?.title || "Unknown Book",
        genre: defaultGenre,

        image: item.volumeInfo.imageLinks.thumbnail,
        authors: item.volumeInfo?.authors || [],
        description: item.volumeInfo?.description || "",
        pageCount: item.volumeInfo?.pageCount || null,
        publisher: item.volumeInfo?.publisher || "",
        publishedDate: item.volumeInfo?.publishedDate || "",
        averageRating: item.volumeInfo?.averageRating || null,
        ratingsCount: item.volumeInfo?.ratingsCount || null,
        previewLink: item.volumeInfo?.previewLink || "",
        infoLink: item.volumeInfo?.infoLink || "",

        ...priceDetails,

        rating: item.volumeInfo?.averageRating || (Math.random() * 2 + 3).toFixed(1),
      };
    });
};
