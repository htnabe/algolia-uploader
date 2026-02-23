import { describe, expect, test } from "vitest";
import IndexedItem, { normalizeIndexedItemArray } from "@/types/IndexedItem";

describe("normalizeIndexedItemArray", () => {
  test("should normalize each IndexedItem objs and sort by objectID", () => {
    const items: IndexedItem[] = [
      {
        name: "Smart Security Camera",
        brand: "SafeGuard",
        price: 89.99,
        inStock: false,
        rating: 4.2,
        description: "Monitor your home with 1080p video.",
        imageUrl: "https://example.com/images/camera.jpg",
        objectID: "prod_003",
      },
      {
        objectID: "prod_001",
        name: "Wireless Headphones",
        brand: "SoundMaster",
        price: 129.99,
        inStock: true,
        rating: 4.5,
        description: "Premium sound quality with noise cancellation.",
        imageUrl: "https://example.com/images/headphones.jpg",
      },
      {
        objectID: "prod_002",
        name: "Ultra-Slim Laptop",
        brand: "TechPro",
        price: 999,
        inStock: true,
        rating: 4.8,
        description: "Sleek design with powerful performance.",
        imageUrl: "https://example.com/images/laptop.jpg",
      },
    ];

    const expected: IndexedItem[] = [
      {
        objectID: "prod_001",
        brand: "SoundMaster",
        description: "Premium sound quality with noise cancellation.",
        imageUrl: "https://example.com/images/headphones.jpg",
        inStock: true,
        name: "Wireless Headphones",
        price: 129.99,
        rating: 4.5,
      },
      {
        objectID: "prod_002",
        brand: "TechPro",
        description: "Sleek design with powerful performance.",
        imageUrl: "https://example.com/images/laptop.jpg",
        inStock: true,
        name: "Ultra-Slim Laptop",
        price: 999,
        rating: 4.8,
      },
      {
        objectID: "prod_003",
        brand: "SafeGuard",
        description: "Monitor your home with 1080p video.",
        imageUrl: "https://example.com/images/camera.jpg",
        inStock: false,
        name: "Smart Security Camera",
        price: 89.99,
        rating: 4.2,
      },
    ];

    expect(normalizeIndexedItemArray(items)).toEqual(expected);
  });

  test("should return empty array if empty array is passed", () => {
    expect(normalizeIndexedItemArray([])).toEqual([]);
  });
});
