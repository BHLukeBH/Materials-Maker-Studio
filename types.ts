export type ToolType = 'flashcards' | 'boardgame' | 'wordsearch';

export interface Flashcard {
  id: number;
  text: string;
  image: string | null; // DataURL
}

export type BoardGameTemplate = 'snake' | 'race' | 'bingo';

export interface BoardTile {
  id: number;
  text: string;
  color: string;
  isSpecial?: boolean; // Start/Finish
}

export interface WordSearchConfig {
  title: string;
  words: string[];
}
