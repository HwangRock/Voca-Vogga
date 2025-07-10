import { Word } from "@/types";

type Props = {
  words: Word[];
  currentIndex: number;
  inputValue: string;
  setInputValue: (v: string) => void;
  nextWord: () => void;
};

export default function TestPanel({
  words,
  currentIndex,
  inputValue,
  setInputValue,
  nextWord,
}: Props) {
  return (
    <div className="test-container fade-in">
      <p className="test-progress">
        {currentIndex + 1} / {words.length}
      </p>

      <h2>{words[currentIndex].english}</h2>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="뜻을 입력하세요"
        className="test-input"
      />

      <div className="next-button-wrapper">
        <button onClick={nextWord}>다음</button>
      </div>
    </div>
  );
}
