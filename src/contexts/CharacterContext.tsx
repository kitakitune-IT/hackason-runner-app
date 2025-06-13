// ▼▼▼【変更】ReactNodeを型としてインポート ▼▼▼
import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Character } from '../data/characterData';
import { addCharacter, getAllCharacters, deleteCharacter ,clearAllCharacters} from '../utils/db';
import type { CustomCharacterEntity } from '../utils/db';


export interface RunRecord {
  date: string;
  duration: number;
  points: number;
}

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
  setTutorialStep: (step: number) => void;
  purchaseCharacter: (character: Character) => boolean;
  updateSlot: (index: number, character: Character | null) => void;
  addRecord: (record: RunRecord) => void;
  clearRecords: () => void;
  resetAllData: () => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

const SLOTS_KEY = 'character-slots';
const POINTS_KEY = 'user-points';
const UNLOCKED_KEY = 'unlocked-characters';
const RECORDS_KEY = 'run-records';
const TOTAL_DURATION_KEY = 'total-duration';
const TOTAL_POINTS_KEY = 'total-points';
const TUTORIAL_KEY = 'tutorial-step';


export const CharacterProvider = ({ children }: { children: ReactNode }) => {
  // ▼▼▼【修正】リンターの誤検知を抑制するコメントを追加 ▼▼▼
  // これらのstateはContextのvalueとして外部のコンポーネントで利用されるため、実際には未使用ではありません。
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [tutorialStep, setTutorialStepState] = useState<number>(() => Number(window.localStorage.getItem(TUTORIAL_KEY)) || 0);
  const [points, setPoints] = useState<number>(() => Number(window.localStorage.getItem(POINTS_KEY)) || 100);
  const [totalRunDuration, setTotalRunDuration] = useState<number>(() => Number(window.localStorage.getItem(TOTAL_DURATION_KEY)) || 0);
  const [totalAccumulatedPoints, setTotalAccumulatedPoints] = useState<number>(() => Number(window.localStorage.getItem(TOTAL_POINTS_KEY)) || 0);
  const [records, setRecords] = useState<RunRecord[]>(() => JSON.parse(window.localStorage.getItem(RECORDS_KEY) || '[]'));
  const [unlockedCharacterIds, setUnlockedCharacterIds] = useState<number[]>(() => JSON.parse(window.localStorage.getItem(UNLOCKED_KEY) || '[]'));
  const [slots, setSlots] = useState<(Character | null)[]>(() => JSON.parse(window.localStorage.getItem(SLOTS_KEY) || '[null, null, null, null]'));
  const [customCharacters, setCustomCharacters] = useState<Character[]>([]);
  /* eslint-enable @typescript-eslint/no-unused-vars */

  // setTutorialStepがコンテキスト内で再定義されるため、元のuseStateのセッターを別名にする
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

  const loadCustomCharacters = async () => {
    const entities = await getAllCharacters();
    const characters: Character[] = entities.map((entity: CustomCharacterEntity) => ({
      id: entity.id!,
      name: entity.name,
      imageSrc: URL.createObjectURL(entity.imageFile),
    }));
    setCustomCharacters(characters);
  };

  useEffect(() => {
    loadCustomCharacters();
  }, []);

  useEffect(() => {
    return () => {
      customCharacters.forEach(char => {
        if (char.imageSrc.startsWith('blob:')) {
          URL.revokeObjectURL(char.imageSrc);
        }
      });
    };
  }, [customCharacters]);
  
  const addCustomCharacter = async (name: string, imageFile: File) => {
    await addCharacter(name, imageFile);
    await loadCustomCharacters();
  };

  const deleteCustomCharacter = async (dbId: number) => {
    await deleteCharacter(dbId);
    await loadCustomCharacters();
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
      const newSlots = [...slots] as [Character | null, Character | null, Character | null, Character | null];
      newSlots[index] = character;
      setSlots(newSlots);
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

  // ▼▼▼【変更】resetAllDataをasync関数にし、DBの削除処理を追加 ▼▼▼
  const resetAllData = async () => {
    // localStorageに保存されているデータをリセット
    setPoints(100);
    setTotalRunDuration(0);
    setTotalAccumulatedPoints(0);
    setRecords([]);
    setUnlockedCharacterIds([]);
    setSlots([null, null, null, null]);
    setTutorialStep(0);

    // IndexedDBに保存されているカスタムキャラクターをすべて削除
    await clearAllCharacters();
    // Reactのstateも空にする
    setCustomCharacters([]);
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