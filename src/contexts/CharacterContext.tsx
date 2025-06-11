import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Character } from '../data/characterData'; // "type"のインポートを修正
import { availableCharacters } from '../data/characterData';

type Slots = [Character | null, Character | null, Character | null, Character | null];

// ▼▼▼【修正点1】updateSlotが `Character | null` を受け取れるように、型定義を変更 ▼▼▼
interface CharacterContextType {
  slots: Slots;
  updateSlot: (index: number, character: Character | null) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);
const STORAGE_KEY = 'character-slots';

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
  const [slots, setSlots] = useState<Slots>(() => {
    try {
      const savedSlotsJSON = window.localStorage.getItem(STORAGE_KEY);
      if (savedSlotsJSON) {
        const savedSlots = JSON.parse(savedSlotsJSON);
        if (Array.isArray(savedSlots) && savedSlots.length === 4) {
          return savedSlots as Slots;
        }
      }
    } catch (error) {
      console.error("Failed to load slots from localStorage", error);
    }
    return [availableCharacters[0], null, null, null];
  });

  useEffect(() => {
    try {
      const slotsJSON = JSON.stringify(slots);
      window.localStorage.setItem(STORAGE_KEY, slotsJSON);
    } catch (error) {
      console.error("Failed to save slots to localStorage", error);
    }
  }, [slots]);

  // ▼▼▼【修正点2】関数の引数の型も、`Character | null` に変更 ▼▼▼
  const updateSlot = (index: number, character: Character | null) => {
    if (index >= 0 && index < 4) {
      const newSlots = [...slots] as Slots;
      newSlots[index] = character;
      setSlots(newSlots);
    }
  };

  const value = { slots, updateSlot };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacterSlots = () => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacterSlots must be used within a CharacterProvider');
  }
  return context;
};