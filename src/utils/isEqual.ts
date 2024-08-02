// オブジェクトの深い比較を行うヘルパー関数
export default function isEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
