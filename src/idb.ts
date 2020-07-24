type IDBMethod =
  | 'transaction'
  | 'add'
  | 'clear'
  | 'count'
  | 'createIndex'
  | 'delete'
  | 'get'
  | 'getAll'
  | 'getAllKeys'
  | 'getKey'
  | 'index'
  | 'openCursor'
  | 'openKeyCursor'
  | 'put';

const storeName = 'idb';

const dbp = new Promise((resolve, reject) => {
  const openreq = window.indexedDB.open('use-idb', 1);
  openreq.onerror = () => reject(openreq.error);
  openreq.onsuccess = () => resolve(openreq.result);
  openreq.onupgradeneeded = () => openreq.result.createObjectStore(storeName);
});

export const call = async (
  type: IDBTransactionMode,
  method: IDBMethod,
  ...args: any
): Promise<any> => {
  const db: any = await dbp;
  const transaction = db.transaction(storeName, type);
  const store = transaction.objectStore(storeName);

  return new Promise((resolve, reject) => {
    const req = store[method](...args);
    transaction.oncomplete = () => resolve(req);
    transaction.onabort = transaction.onerror = () => reject(transaction.error);
  });
};
export const keys = async () => (await call('readonly', 'getAllKeys')).result;
export const getItem = async (key: string) => (await call('readonly', 'get', key)).result;
export const setItem = (key: string, value: any) => call('readwrite', 'put', value, key);
export const removeItem = (key: string) => call('readwrite', 'delete', key);
export const clear = () => call('readwrite', 'clear');

export default { getItem, setItem, removeItem, clear, keys, call };
