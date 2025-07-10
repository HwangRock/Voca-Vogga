"use client";

import useWordTest from "@/app/hooks/useWordTest";

export default function HomePage() {
  const {
    words,
    isTesting,
    currentIndex,
    inputValue,
    score,
    wrongWords,
    showResult,
    setInputValue,
    fetchAllWords,
    startTest,
    nextWord,
    toggleCheck,
    restartWithWrongWords,
  } = useWordTest();


  return (
    <main className="fade-in">
      <h1>HwangRock 영단어 테스트</h1>
      <h3>상특) 영단어장을 직접 만든다.</h3>

      {!isTesting && !showResult && (
        <div className="button-container">
          <button onClick={() => startTest(false)}>모든 단어 테스트</button>
          <button onClick={() => startTest(true)}>랜덤 20개 단어 테스트</button>
          <button onClick={fetchAllWords}>영단어장</button>
        </div>
      )}

      {isTesting && words.length > 0 && (
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
      )}

      {showResult && (
        <div className="test-result fade-in">
          <h2>테스트 결과</h2>
          <p>
            점수: {score} / {words.length} (
            {Math.round((score / words.length) * 100)}%)
          </p>

          {wrongWords.length > 0 ? (
            <>
              <h3>틀린 단어 목록</h3>
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
                      <span className="wrong-word-english">
                        {w.english}
                      </span>
                      <span className="wrong-word-wrong">
                        {w.wrongAnswer}
                      </span>
                      <span className="wrong-word-correct">
                        {w.korean}
                      </span>
                      {w.checked && (
                        <span className="excluded-text">
                          (제외됨 +1점)
                        </span>
                      )}
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
      )}

      {!isTesting && !showResult && words.length > 0 && (
        <ul>
          {words.map((w, i) => (
            <li key={i} className="wrong-word-row">
              <span className="wrong-word-english">{w.english}</span>
              <span className="wrong-word-wrong"></span>
              <span className="wrong-word-correct">{w.korean}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
