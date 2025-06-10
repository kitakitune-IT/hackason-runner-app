// 1. まず、用意した画像をすべてインポートする
import memeCharacter from '../assets/spinning-cat-stop.gif'; // ファイル名はあなたが入れたものに合わせてね
import catlikeCharacter from '../assets/catlike.gif';
import emuCharacter from '../assets/emu-14760_256.gif';
import horseCharacter from '../assets/horse_256.gif';

// 2. キャラクターの型を定義する
export interface Character {
  id: number;
  name: string;
  imageSrc: string;
}

// 3. インポートした画像を、キャラクターのデータと紐づけてリスト化する
export const availableCharacters: Character[] = [
  { id: 1, name: 'ミーム', imageSrc: memeCharacter },
  { id: 2, name: '猫っぽいの', imageSrc: catlikeCharacter },
  { id: 3, name: 'エミュー', imageSrc: emuCharacter },
  { id: 4, name: '馬', imageSrc: horseCharacter },
  // ...もし画像が増えたら、ここに追加していく
];