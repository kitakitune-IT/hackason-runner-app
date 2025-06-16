import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Character } from '../data/characterData';
import { 
    addGif, getAllGifs, deleteGif, clearAllGifs,
    addStaticImage, getAllStaticImages, deleteStaticImage, clearAllStaticImages,
    addAlbumPhoto, getAllAlbumPhotos, deleteAlbumPhotos, clearAllAlbumPhotos
} from '../utils/db';
import type { CustomGifEntity, StaticImageEntity, AlbumPhotoEntity } from '../utils/db';

export interface RunRecord {
  date: string;
  duration: number;
  points: number;
}

export interface AlbumPhoto {
  id: number;
  src: string;
  createdAt: Date;
}

const fileToDataUrl = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const hasPrice = (character: Character): character is Character & { price: number } => {
  return typeof character.price === 'number';
};

interface CharacterContextType {
  points: number;
  totalRunDuration: number;
  totalAccumulatedPoints: number;
  records: RunRecord[];
  unlockedCharacterIds: number[];
  slots: (Character | null)[];
  tutorialStep: number;
  customCharacters: Character[]; 
  addCustomCharacter: (name: string, imageFile: File) => Promise<void>;
  deleteCustomCharacter: (dbId: number) => Promise<void>;
  staticImages: Character[];
  pngSlots: (Character | null)[];
  addStaticImage: (name: string, imageFile: File) => Promise<void>;
  deleteStaticImage: (dbId: number) => Promise<void>;
  updatePngSlot: (index: number, character: Character | null) => void;
  albumPhotos: AlbumPhoto[];
  addAlbumPhoto: (photoBlob: Blob) => Promise<void>;
  deleteAlbumPhotos: (ids: number[]) => Promise<void>;
  clearAllAlbumPhotos: () => Promise<void>;
  setTutorialStep: (step: number) => void;
  purchaseCharacter: (character: Character) => boolean;
  updateSlot: (index: number, character: Character | null) => void;
  addRecord: (record: RunRecord) => void;
  clearRecords: () => void;
  resetAllData: () => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

const SLOTS_KEY = 'character-slots';
const PNG_SLOTS_KEY = 'png-slots';
const POINTS_KEY = 'user-points';
const UNLOCKED_KEY = 'unlocked-characters';
const RECORDS_KEY = 'run-records';
const TOTAL_DURATION_KEY = 'total-duration';
const TOTAL_POINTS_KEY = 'total-points';
const TUTORIAL_KEY = 'tutorial-step';

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
  const [tutorialStep, setTutorialStepState] = useState<number>(() => Number(window.localStorage.getItem(TUTORIAL_KEY)) || 0);
  const [points, setPoints] = useState<number>(() => Number(window.localStorage.getItem(POINTS_KEY)) || 100);
  const [totalRunDuration, setTotalRunDuration] = useState<number>(() => Number(window.localStorage.getItem(TOTAL_DURATION_KEY)) || 0);
  const [totalAccumulatedPoints, setTotalAccumulatedPoints] = useState<number>(() => Number(window.localStorage.getItem(TOTAL_POINTS_KEY)) || 0);
  const [records, setRecords] = useState<RunRecord[]>(() => JSON.parse(window.localStorage.getItem(RECORDS_KEY) || '[]'));
  const [unlockedCharacterIds, setUnlockedCharacterIds] = useState<number[]>(() => JSON.parse(window.localStorage.getItem(UNLOCKED_KEY) || '[]'));
  const [slots, setSlots] = useState<(Character | null)[]>(() => JSON.parse(window.localStorage.getItem(SLOTS_KEY) || '[null, null, null, null]'));
  const [customCharacters, setCustomCharacters] = useState<Character[]>([]);
  const [staticImages, setStaticImages] = useState<Character[]>([]);
  const [pngSlots, setPngSlots] = useState<(Character | null)[]>(() => JSON.parse(window.localStorage.getItem(PNG_SLOTS_KEY) || '[null, null, null, null]'));
  const [albumPhotos, setAlbumPhotos] = useState<AlbumPhoto[]>([]);

  const setTutorialStep = (step: number) => {
    setTutorialStepState(step);
  };
  
  useEffect(() => { window.localStorage.setItem(TUTORIAL_KEY, tutorialStep.toString()); }, [tutorialStep]);
  useEffect(() => { window.localStorage.setItem(POINTS_KEY, points.toString()); }, [points]);
  useEffect(() => { window.localStorage.setItem(TOTAL_DURATION_KEY, totalRunDuration.toString()); }, [totalRunDuration]);
  useEffect(() => { window.localStorage.setItem(TOTAL_POINTS_KEY, totalAccumulatedPoints.toString()); }, [totalAccumulatedPoints]);
  useEffect(() => { window.localStorage.setItem(RECORDS_KEY, JSON.stringify(records)); }, [records]);
  useEffect(() => { window.localStorage.setItem(UNLOCKED_KEY, JSON.stringify(unlockedCharacterIds)); }, [unlockedCharacterIds]);
  useEffect(() => { window.localStorage.setItem(SLOTS_KEY, JSON.stringify(slots)); }, [slots]);
  useEffect(() => { window.localStorage.setItem(PNG_SLOTS_KEY, JSON.stringify(pngSlots)); }, [pngSlots]);

  // ▼▼▼【重要】全てのロード関数を、データURLを直接使うように修正 ▼▼▼
  const loadCustomCharacters = async () => {
    const entities = await getAllGifs();
    const characters: Character[] = entities.map((entity: CustomGifEntity) => ({
      id: entity.id!, name: entity.name, imageSrc: entity.imageDataUrl
    }));
    setCustomCharacters(characters);
  };
  
  const loadStaticImages = async () => {
    const entities = await getAllStaticImages();
    const images: Character[] = entities.map((entity: StaticImageEntity) => ({
        id: entity.id!, name: entity.name, imageSrc: entity.imageDataUrl
    }));
    setStaticImages(images);
  };

  const loadAlbumPhotos = async () => {
    const entities = await getAllAlbumPhotos();
    const photos: AlbumPhoto[] = entities.map((entity: AlbumPhotoEntity) => ({
        id: entity.id!, src: entity.photoDataUrl, createdAt: entity.createdAt
    }));
    setAlbumPhotos(photos);
  };
  
  useEffect(() => {
    loadCustomCharacters();
    loadStaticImages();
    loadAlbumPhotos();
  }, []);
  
  const addCustomCharacter = async (name: string, imageFile: File) => {
    const imageDataUrl = await fileToDataUrl(imageFile);
    await addGif(name, imageDataUrl);
    await loadCustomCharacters();
  };

  const deleteCustomCharacter = async (dbId: number) => {
    await deleteGif(dbId);
    await loadCustomCharacters();
  };

  const addStaticImageFunc = async (name: string, imageFile: File) => {
    const imageDataUrl = await fileToDataUrl(imageFile);
    await addStaticImage(name, imageDataUrl);
    await loadStaticImages();
  };

  const deleteStaticImageFunc = async (dbId: number) => {
    await deleteStaticImage(dbId);
    await loadStaticImages();
  };

  const addAlbumPhotoFunc = async (photoBlob: Blob) => {
    const photoDataUrl = await fileToDataUrl(photoBlob);
    await addAlbumPhoto(photoDataUrl);
    await loadAlbumPhotos();
  };

  const deleteAlbumPhotosFunc = async (ids: number[]) => {
    await deleteAlbumPhotos(ids);
    await loadAlbumPhotos();
  };

  const clearAllAlbumPhotosFunc = async () => {
    await clearAllAlbumPhotos();
    await loadAlbumPhotos();
  };
  
  const purchaseCharacter = (character: Character) => {
    if (hasPrice(character) && points >= character.price && !unlockedCharacterIds.includes(character.id)) {
      setPoints(prev => prev - character.price);
      setUnlockedCharacterIds(prev => [...prev, character.id]);
      return true;
    }
    return false;
  };

  const updateSlot = (index: number, character: Character | null) => {
    if (index >= 0 && index < 4) {
      const newSlots = [...slots];
      newSlots[index] = character;
      setSlots(newSlots);
    }
  };
  
  const updatePngSlot = (index: number, character: Character | null) => {
    if (index >= 0 && index < 4) {
      const newSlots = [...pngSlots];
      newSlots[index] = character;
      setPngSlots(newSlots);
    }
  };

  const addRecord = (record: RunRecord) => {
    if (record.duration > 0) {
      setRecords(prev => [record, ...prev]);
      setPoints(prev => prev + record.points);
      setTotalRunDuration(prev => prev + record.duration);
      setTotalAccumulatedPoints(prev => prev + record.points);
    }
  };

  const clearRecords = () => { setRecords([]); };

  const resetAllData = async () => {
    setPoints(100);
    setTotalRunDuration(0);
    setTotalAccumulatedPoints(0);
    setRecords([]);
    setUnlockedCharacterIds([]);
    setSlots([null, null, null, null]);
    setPngSlots([null, null, null, null]);
    setTutorialStep(0);

    await clearAllGifs();
    await clearAllStaticImages();
    await clearAllAlbumPhotos();
    
    setCustomCharacters([]);
    setStaticImages([]);
    setAlbumPhotos([]);
  };
  
  const value: CharacterContextType = { 
    points, 
    totalRunDuration, 
    totalAccumulatedPoints, 
    records, 
    unlockedCharacterIds, 
    slots,
    tutorialStep, 
    customCharacters,
    addCustomCharacter,
    deleteCustomCharacter,
    staticImages,
    pngSlots,
    addStaticImage: addStaticImageFunc,
    deleteStaticImage: deleteStaticImageFunc,
    updatePngSlot,
    albumPhotos,
    addAlbumPhoto: addAlbumPhotoFunc,
    deleteAlbumPhotos: deleteAlbumPhotosFunc,
    clearAllAlbumPhotos: clearAllAlbumPhotosFunc,
    setTutorialStep, 
    purchaseCharacter, 
    updateSlot, 
    addRecord, 
    clearRecords, 
    resetAllData 
  };

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
};

export const useCharacterContext = () => {
  const context = useContext(CharacterContext);
  if (!context) { throw new Error('useCharacterContext must be used within a CharacterProvider'); }
  return context;
};