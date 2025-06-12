import { createContext, useState, useEffect, useContext } from 'react';
import type {ReactNode} from 'react';
import type { Character } from '../data/characterData';
import { availableCharacters } from '../data/characterData';

const hasPrice = (character: Character): character is Character & { price: number } => {
  return typeof character.price === 'number';
};

interface CharacterContextType {
  points: number;
  unlockedCharacterIds: number[];
  slots: (Character | null)[];
  purchaseCharacter: (character: Character) => boolean;
  updateSlot: (index: number, character: Character | null) => void;
  addPoints: (amount: number) => void; // ← 新しい命令を追加
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

const SLOTS_KEY = 'character-slots';
const POINTS_KEY = 'user-points';
const UNLOCKED_KEY = 'unlocked-characters';

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
  const [points, setPoints] = useState<number>(() => {
    const savedPoints = window.localStorage.getItem(POINTS_KEY);
    return savedPoints ? parseInt(savedPoints, 10) : 100; // ← 初期ポイントを100に変更
  });

  const [unlockedCharacterIds, setUnlockedCharacterIds] = useState<number[]>(() => {
    const savedUnlocked = window.localStorage.getItem(UNLOCKED_KEY);
    return savedUnlocked ? JSON.parse(savedUnlocked) : [1];
  });

  const [slots, setSlots] = useState<(Character | null)[]>(() => {
    const savedSlots = window.localStorage.getItem(SLOTS_KEY);
    return savedSlots ? JSON.parse(savedSlots) : [availableCharacters[0], null, null, null];
  });

  useEffect(() => { window.localStorage.setItem(POINTS_KEY, points.toString()); }, [points]);
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
    const newSlots = [...slots];
    newSlots[index] = character;
    setSlots(newSlots);
  };

  // ▼▼▼【新規】ポイント加算処理 ▼▼▼
  const addPoints = (amount: number) => {
    if (amount > 0) {
      setPoints(prev => prev + amount);
    }
  };

  const value = { points, unlockedCharacterIds, slots, purchaseCharacter, updateSlot, addPoints };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacterContext = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacterContext must be used within a CharacterProvider');
  }
  return context;
};