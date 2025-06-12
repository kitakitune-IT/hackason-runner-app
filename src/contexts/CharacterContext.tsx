import { createContext, useState, useEffect, useContext } from 'react';
import type{ReactNode} from 'react';
import type { Character } from '../data/characterData';

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
  setTutorialStep: (step: number) => void; // ← 新しい命令
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
  const [tutorialStep, setTutorialStep] = useState<number>(() => Number(window.localStorage.getItem(TUTORIAL_KEY)) || 0);
  const [points, setPoints] = useState<number>(() => Number(window.localStorage.getItem(POINTS_KEY)) || 100);
  const [totalRunDuration, setTotalRunDuration] = useState<number>(() => Number(window.localStorage.getItem(TOTAL_DURATION_KEY)) || 0);
  const [totalAccumulatedPoints, setTotalAccumulatedPoints] = useState<number>(() => Number(window.localStorage.getItem(TOTAL_POINTS_KEY)) || 0);
  const [records, setRecords] = useState<RunRecord[]>(() => JSON.parse(window.localStorage.getItem(RECORDS_KEY) || '[]'));
  const [unlockedCharacterIds, setUnlockedCharacterIds] = useState<number[]>(() => JSON.parse(window.localStorage.getItem(UNLOCKED_KEY) || '[]'));
  const [slots, setSlots] = useState<(Character | null)[]>(() => JSON.parse(window.localStorage.getItem(SLOTS_KEY) || '[null, null, null, null]'));

  useEffect(() => { window.localStorage.setItem(TUTORIAL_KEY, tutorialStep.toString()); }, [tutorialStep]);
  useEffect(() => { window.localStorage.setItem(POINTS_KEY, points.toString()); }, [points]);
  useEffect(() => { window.localStorage.setItem(TOTAL_DURATION_KEY, totalRunDuration.toString()); }, [totalRunDuration]);
  useEffect(() => { window.localStorage.setItem(TOTAL_POINTS_KEY, totalAccumulatedPoints.toString()); }, [totalAccumulatedPoints]);
  useEffect(() => { window.localStorage.setItem(RECORDS_KEY, JSON.stringify(records)); }, [records]);
  useEffect(() => { window.localStorage.setItem(UNLOCKED_KEY, JSON.stringify(unlockedCharacterIds)); }, [unlockedCharacterIds]);
  useEffect(() => { window.localStorage.setItem(SLOTS_KEY, JSON.stringify(slots)); }, [slots]);

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

  const resetAllData = () => {
    setPoints(100);
    setTotalRunDuration(0);
    setTotalAccumulatedPoints(0);
    setRecords([]);
    setUnlockedCharacterIds([]);
    setSlots([null, null, null, null]);
    setTutorialStep(0);
  };

  const value = { points, totalRunDuration, totalAccumulatedPoints, records, unlockedCharacterIds, slots, tutorialStep, setTutorialStep, purchaseCharacter, updateSlot, addRecord, clearRecords, resetAllData };

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
};

export const useCharacterContext = () => {
  const context = useContext(CharacterContext);
  if (!context) { throw new Error('useCharacterContext must be used within a CharacterProvider'); }
  return context;
};