// src/utils/db.ts

export interface CustomGifEntity {
  id?: number;
  name: string;
  imageFile: File;
}

export interface StaticImageEntity {
  id?: number;
  name: string;
  imageFile: File;
}

export interface AlbumPhotoEntity {
  id?: number;
  photoBlob: Blob;
  createdAt: Date;
}

const DB_NAME = 'user-data-db';
const GIF_STORE_NAME = 'customGifs';
const PNG_STORE_NAME = 'staticImages';
const ALBUM_STORE_NAME = 'albumPhotos';
const DB_VERSION = 2;

let db: IDBDatabase;

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

    request.onupgradeneeded = (event) => {
      const db = request.result;
      
      // バージョン1から2への更新時に古いストアを削除
      if (event.oldVersion < 2 && db.objectStoreNames.contains('customCharacters')) {
          db.deleteObjectStore('customCharacters');
      }
      if (!db.objectStoreNames.contains(GIF_STORE_NAME)) {
        db.createObjectStore(GIF_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(PNG_STORE_NAME)) {
        db.createObjectStore(PNG_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(ALBUM_STORE_NAME)) {
        db.createObjectStore(ALBUM_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// ========== GIF Characters ==========
export async function addGif(name: string, imageFile: File): Promise<void> {
  const db = await initDB();
  const transaction = db.transaction(GIF_STORE_NAME, 'readwrite');
  const store = transaction.objectStore(GIF_STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.add({ name, imageFile });
    request.onsuccess = () => resolve();
    // ▼▼▼【修正】未使用の引数 'e' を '_e' に変更 ▼▼▼
    request.onerror = (_e) => reject(request.error);
  });
}
export async function getAllGifs(): Promise<CustomGifEntity[]> {
  const db = await initDB();
  const transaction = db.transaction(GIF_STORE_NAME, 'readonly');
  const store = transaction.objectStore(GIF_STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export async function deleteGif(id: number): Promise<void> {
  const db = await initDB();
  const transaction = db.transaction(GIF_STORE_NAME, 'readwrite');
  const store = transaction.objectStore(GIF_STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
export async function clearAllGifs(): Promise<void> {
  const db = await initDB();
  const transaction = db.transaction(GIF_STORE_NAME, 'readwrite');
  const store = transaction.objectStore(GIF_STORE_NAME);
  return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
  });
}

// ========== Static Images (PNG) ==========
export async function addStaticImage(name: string, imageFile: File): Promise<void> {
  const db = await initDB();
  const transaction = db.transaction(PNG_STORE_NAME, 'readwrite');
  const store = transaction.objectStore(PNG_STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.add({ name, imageFile });
    request.onsuccess = () => resolve();
    // ▼▼▼【修正】未使用の引数 'e' を '_e' に変更 ▼▼▼
    request.onerror = (_e) => reject(request.error);
  });
}
export async function getAllStaticImages(): Promise<StaticImageEntity[]> {
  const db = await initDB();
  const transaction = db.transaction(PNG_STORE_NAME, 'readonly');
  const store = transaction.objectStore(PNG_STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export async function deleteStaticImage(id: number): Promise<void> {
  const db = await initDB();
  const transaction = db.transaction(PNG_STORE_NAME, 'readwrite');
  const store = transaction.objectStore(PNG_STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
export async function clearAllStaticImages(): Promise<void> {
    const db = await initDB();
    const transaction = db.transaction(PNG_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(PNG_STORE_NAME);
    return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// ========== Album Photos ==========
export async function addAlbumPhoto(photoBlob: Blob): Promise<void> {
  const db = await initDB();
  const transaction = db.transaction(ALBUM_STORE_NAME, 'readwrite');
  const store = transaction.objectStore(ALBUM_STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.add({ photoBlob, createdAt: new Date() });
    request.onsuccess = () => resolve();
    // ▼▼▼【修正】未使用の引数 'e' を '_e' に変更 ▼▼▼
    request.onerror = (_e) => reject(request.error);
  });
}
export async function getAllAlbumPhotos(): Promise<AlbumPhotoEntity[]> {
  const db = await initDB();
  const transaction = db.transaction(ALBUM_STORE_NAME, 'readonly');
  const store = transaction.objectStore(ALBUM_STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()));
    request.onerror = () => reject(request.error);
  });
}
export async function deleteAlbumPhotos(ids: number[]): Promise<void> {
    const db = await initDB();
    const transaction = db.transaction(ALBUM_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(ALBUM_STORE_NAME);
    return new Promise((resolve, reject) => {
        const promises = ids.map(id => {
            return new Promise<void>(res => {
                const req = store.delete(id);
                req.onsuccess = () => res();
            });
        });
        Promise.all(promises).then(() => resolve());
        transaction.onerror = () => reject(transaction.error);
    });
}
export async function clearAllAlbumPhotos(): Promise<void> {
    const db = await initDB();
    const transaction = db.transaction(ALBUM_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(ALBUM_STORE_NAME);
    return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}