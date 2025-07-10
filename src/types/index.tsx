export type Word = {
  english: string;
  korean: string;
};

export type WrongWord = {
  english: string;
  korean: string;
  wrongAnswer: string;
  checked: boolean;
};
