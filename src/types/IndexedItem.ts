export default interface IndexedItem {
  objectID: string;
  [key: string]: unknown;
}

// Guard the IndexedItem type
export function isIndexedItem(item: unknown): item is IndexedItem {
  return (
    typeof item === "object" &&
    item !== null &&
    "objectID" in item &&
    typeof (item as IndexedItem).objectID === "string"
  );
}

/**
 * Normalized item sorted with IndexedItem key
 * @param item IndexedItem
 * @returns IndexedItem with unified key order
 */
function normalizeIndexedItem(item: IndexedItem): IndexedItem {
  const sortedKeys = Object.keys(item).sort();
  const normalizedItem: IndexedItem = { objectID: item.objectID };

  for (const key of sortedKeys) {
    if (key !== "objectID") {
      normalizedItem[key] = item[key];
    }
  }

  return normalizedItem;
}

/**
 * Normalize IndexedItem array
 * @param items IndexedItem array
 * @returns normalized IndexedItem array
 */
export function normalizeIndexedItemArray(items: IndexedItem[]): IndexedItem[] {
  return items
    .map(normalizeIndexedItem)
    .sort((a, b) => a.objectID.localeCompare(b.objectID));
}
