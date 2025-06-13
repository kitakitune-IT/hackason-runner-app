// src/utils/db.ts

// DBに保存するキャラクターの型定義
export interface CustomCharacterEntity {
  id?: number; // IndexedDBで自動採番されるID
  name: string;
  imageFile: File;
}

const DB_NAME = 'user-characters-db';
const STORE_NAME = 'customCharacters';
const DB_VERSION = 1;

let db: IDBDatabase;

// データベースを初期化・接続する関数
function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => {
      console.error('IndexedDBのオープンに失敗しました');
      reject(request.error);
    };
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// カスタムキャラクターをDBに追加する関数
export async function addCharacter(name: string, imageFile: File): Promise<void> {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.add({ name, imageFile });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// 保存されている全てのカスタムキャラクターを取得する関数
export async function getAllCharacters(): Promise<CustomCharacterEntity[]> {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// 指定したIDのカスタムキャラクターを削除する関数
export async function deleteCharacter(id: number): Promise<void> {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// ▼▼▼【新規】全てのカスタムキャラクターを削除する関数を追加 ▼▼▼
export async function clearAllCharacters(): Promise<void> {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  return new Promise((resolve, reject) => {
    // .clear()メソッドでストア内の全データを削除する
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}