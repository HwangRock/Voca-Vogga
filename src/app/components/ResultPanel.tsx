import { WrongWord } from "@/types";

type Props = {
  score: number;
  wordsLength: number;
  wrongWords: WrongWord[];
  toggleCheck: (i: number) => void;
  restartWithWrongWords: () => void;
};

export default function ResultPanel({
  score,
  wordsLength,
  wrongWords,
  toggleCheck,
  restartWithWrongWords,
}: Props) {
  return (
    <div className="test-result fade-in">
      <h2>테스트 결과</h2>
      <p>
        점수: {score} / {wordsLength} (
        {Math.round((score / wordsLength) * 100)}%)
      </p>

      {wrongWords.length > 0 ? (
        <>
          <h3>틀린 단어 목록</h3>
          <h4 style={{ textAlign: "center" }}>
            맞았다고 생각하는 단어는 체크를 누르세요
            </h4>
          <ul>
            {wrongWords.map((w, i) => (
              <li key={i} className="wrong-word-row">
                <label className="wrong-word-label">
                  <input
                    type="checkbox"
                    checked={w.checked}
                    onChange={() => toggleCheck(i)}
                    className="wrong-word-checkbox"
                  />
                  <span className="wrong-word-english">{w.english}</span>
                  <span className="wrong-word-wrong">{w.wrongAnswer}</span>
                  <span className="wrong-word-correct">{w.korean}</span>
                </label>
              </li>
            ))}
          </ul>
          <button onClick={restartWithWrongWords}>
            틀린 단어 재테스트
          </button>
          <p>돌아가려면 F5를 누르세요.</p>
        </>
      ) : (
        <p>
          모든 단어를 맞췄어요! 🎉 <br />
          돌아가려면 F5를 누르세요.
        </p>
      )}
    </div>
  );
}
