import IndexedItem from "./IndexedItem";

export default interface Operations {
  update: IndexedItem[];
  add: IndexedItem[];
  delete: IndexedItem[];
}
