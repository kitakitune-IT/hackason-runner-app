import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Character } from '../data/characterData';
import { availableCharacters } from '../data/characterData';

// 4つのスロットを表現する型。キャラクターが入っているか、空（null）か。
type Slots = [Character | null, Character | null, Character | null, Character | null];

interface CharacterContextType {
  slots: Slots;
  updateSlot: (index: number, character: Character) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

// localStorageに保存するためのキー
const STORAGE_KEY = 'character-slots';

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
  // アプリ起動時に、localStorageから保存されたデータを読み込む
  const [slots, setSlots] = useState<Slots>(() => {
    try {
      const savedSlotsJSON = window.localStorage.getItem(STORAGE_KEY);
      if (savedSlotsJSON) {
        const savedSlots = JSON.parse(savedSlotsJSON);
        // データが4つの要素を持つ配列であることを確認
        if (Array.isArray(savedSlots) && savedSlots.length === 4) {
          return savedSlots as Slots;
        }
      }
    } catch (error) {
      console.error("Failed to load slots from localStorage", error);
    }
    // 保存されたデータがない、または不正な場合は、初期状態（1番目のスロットにデフォルトキャラ）を返す
    return [availableCharacters[0], null, null, null];
  });

  // slotsの状態が変わるたびに、自動でlocalStorageに保存する
  useEffect(() => {
    try {
      const slotsJSON = JSON.stringify(slots);
      window.localStorage.setItem(STORAGE_KEY, slotsJSON);
    } catch (error) {
      console.error("Failed to save slots to localStorage", error);
    }
  }, [slots]);

  // スロットの中身を更新するための関数
  const updateSlot = (index: number, character: Character) => {
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