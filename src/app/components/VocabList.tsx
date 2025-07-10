import { Word } from "@/types";

type Props = {
  words: Word[];
};

export default function VocabList({ words }: Props) {
  return (
    <ul>
      {words.map((w, i) => (
        <li key={i} className="wrong-word-row">
          <span className="wrong-word-english">{w.english}</span>
          <span className="wrong-word-wrong"></span>
          <span className="wrong-word-correct">{w.korean}</span>
        </li>
      ))}
    </ul>
  );
}
