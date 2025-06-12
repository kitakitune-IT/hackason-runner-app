import { createContext, useState, useEffect, useContext } from 'react';
import type {ReactNode} from 'react';
import type { Character } from '../data/characterData';

export interface RunRecord {
  date: string;
  duration: number;
  points: number;
}

// ▼▼▼【新規】Type Guard関数をここで定義する ▼▼▼
// この関数がtrueを返せば、TypeScriptはcharacterがpriceプロパティを持つと確信する
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
  tutorialStep: number; // チュートリアルの段階
  purchaseCharacter: (character: Character) => boolean;
  updateSlot: (index: number, character: Character | null) => void;
  addRecord: (record: RunRecord) => void;
  clearRecords: () => void;
  advanceTutorialStep: () => void; // チュートリアルを次に進める命令
  resetAllData: () => void; // 全データをリセットする命令
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

const SLOTS_KEY = 'character-slots';
const POINTS_KEY = 'user-points';
const UNLOCKED_KEY = 'unlocked-characters';
const RECORDS_KEY = 'run-records';
const TOTAL_DURATION_KEY = 'total-duration';
const TOTAL_POINTS_KEY = 'total-points';
const TUTORIAL_KEY = 'tutorial-step'; // チュートリアル用のキーを追加

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
    const [tutorialStep, setTutorialStep] = useState<number>(() => Number(window.localStorage.getItem(TUTORIAL_KEY)) || 0);
  const [points, setPoints] = useState<number>(() => Number(window.localStorage.getItem(POINTS_KEY)) || 100);
  const [totalRunDuration, setTotalRunDuration] = useState<number>(() => Number(window.localStorage.getItem(TOTAL_DURATION_KEY)) || 0);
  const [totalAccumulatedPoints, setTotalAccumulatedPoints] = useState<number>(() => Number(window.localStorage.getItem(TOTAL_POINTS_KEY)) || 0);
  const [records, setRecords] = useState<RunRecord[]>(() => JSON.parse(window.localStorage.getItem(RECORDS_KEY) || '[]'));
  const [unlockedCharacterIds, setUnlockedCharacterIds] = useState<number[]>(() => JSON.parse(window.localStorage.getItem(UNLOCKED_KEY) || '[1]'));
  const [slots, setSlots] = useState<(Character | null)[]>(() => JSON.parse(window.localStorage.getItem(SLOTS_KEY) || '[null, null, null, null]'));
  
  useEffect(() => { window.localStorage.setItem(TUTORIAL_KEY, tutorialStep.toString()); }, [tutorialStep]);
  useEffect(() => { window.localStorage.setItem(POINTS_KEY, points.toString()); }, [points]);
  useEffect(() => { window.localStorage.setItem(TOTAL_DURATION_KEY, totalRunDuration.toString()); }, [totalRunDuration]);
  useEffect(() => { window.localStorage.setItem(TOTAL_POINTS_KEY, totalAccumulatedPoints.toString()); }, [totalAccumulatedPoints]);
  useEffect(() => { window.localStorage.setItem(RECORDS_KEY, JSON.stringify(records)); }, [records]);
  useEffect(() => { window.localStorage.setItem(UNLOCKED_KEY, JSON.stringify(unlockedCharacterIds)); }, [unlockedCharacterIds]);
  useEffect(() => { window.localStorage.setItem(SLOTS_KEY, JSON.stringify(slots)); }, [slots]);

  // ▼▼▼【修正】Type Guardを使って、購入処理を書き換える ▼▼▼
  const purchaseCharacter = (character: Character) => {
    // このif文を通過すれば、TypeScriptは、このブロック内では
    // `character.price`が必ず数値であることを、完全に理解してくれる。
    if (hasPrice(character) && points >= character.price && !unlockedCharacterIds.includes(character.id)) {
      setPoints(prev => prev - character.price);
      setUnlockedCharacterIds(prev => [...prev, character.id]);
            // ▼▼▼ チュートリアル判定を追加 ▼▼▼
      // もし、チュートリアルの段階が「1」で、かつ、購入したのがID「1」のミームなら、次の段階へ
      if (tutorialStep === 1 && character.id === 1) {
        advanceTutorialStep();
      }
      return true; // 購入成功
    }
    
    return false; // 条件を満たさない場合は失敗
  };

  const updateSlot = (index: number, character: Character | null) => {
    if (index >= 0 && index < 4) {
      const newSlots = [...slots] as [Character | null, Character | null, Character | null, Character | null];
      newSlots[index] = character;
      setSlots(newSlots);
      // ▼▼▼ チュートリアル判定を追加 ▼▼▼
      // もし、チュートリアルの段階が「3」で、かつ、更新したのが「スロット1」で、そこにキャラクターがセットされたなら、次の段階へ
      if (tutorialStep === 3 && index === 0 && character !== null) {
        advanceTutorialStep();
      }
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

  const clearRecords = () => {
    setRecords([]);
  };

  // ▼▼▼【新規】チュートリアルを進める命令と、全データをリセットする命令 ▼▼▼
  const advanceTutorialStep = () => {
    setTutorialStep(prev => prev + 1);
  };

  const resetAllData = () => {
    // すべての状態を、初期値に戻す
    setPoints(100);
    setTotalRunDuration(0);
    setTotalAccumulatedPoints(0);
    setRecords([]);
    setUnlockedCharacterIds([1]);
    setSlots([null, null, null, null]);
    setTutorialStep(0); // チュートリアルも完了状態に戻す
    // localStorageもクリアされる
  };

  const value = { points, totalRunDuration, totalAccumulatedPoints, records, unlockedCharacterIds, slots, tutorialStep, purchaseCharacter, updateSlot, addRecord, clearRecords, advanceTutorialStep, resetAllData };

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
};

export const useCharacterContext = () => {
  const context = useContext(CharacterContext);
  if (!context) { throw new Error('useCharacterContext must be used within a CharacterProvider'); }
  return context;
};