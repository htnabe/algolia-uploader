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
