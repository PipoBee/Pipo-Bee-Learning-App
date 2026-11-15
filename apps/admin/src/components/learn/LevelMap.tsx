import React from 'react';
import { Check, Lock, Sparkles } from 'lucide-react';
import { CurriculumLesson } from '../../services/curriculum';

type Props = {
  lessons: CurriculumLesson[];
  onSelectLesson?: (lesson: CurriculumLesson) => void;
};

export const LevelMap: React.FC<Props> = ({ lessons, onSelectLesson }) => {
  if (!lessons.length) {
    return (
      <div className="level-map empty" role="status">
        <p>No lessons yet. Check your connection and try again.</p>
      </div>
    );
  }

  return (
    <ol className="level-map" aria-label="Level 1 lesson path">
      {lessons.map((lesson, index) => {
        const locked = lesson.status === 'locked';
        const current = lesson.status === 'ready' || lesson.status === 'in_progress';
        const done = lesson.status === 'completed';
        const letter = (lesson.letterKey || lesson.title.slice(-1)).toUpperCase();

        return (
          <li key={lesson.id} className="level-map-item">
            {index > 0 && <span className="level-map-path" aria-hidden="true" />}
            <button
              type="button"
              className={`level-map-node${current ? ' is-current' : ''}${done ? ' is-done' : ''}${locked ? ' is-locked' : ''}`}
              disabled={locked}
              aria-label={
                locked
                  ? `${lesson.title}, locked`
                  : done
                    ? `${lesson.title}, completed, ${lesson.starsEarned} stars`
                    : `${lesson.title}, ready to practice`
              }
              onClick={() => {
                if (!locked) onSelectLesson?.(lesson);
              }}
            >
              <span className="level-map-letter" aria-hidden="true">
                {letter}
              </span>
              <span className="level-map-state" aria-hidden="true">
                {locked ? <Lock size={14} strokeWidth={2.4} /> : null}
                {done ? <Check size={14} strokeWidth={2.6} /> : null}
                {current ? <Sparkles size={14} strokeWidth={2.4} /> : null}
              </span>
            </button>
            <div className="level-map-meta">
              <strong>{lesson.title}</strong>
              <span>
                {locked
                  ? 'Locked'
                  : done
                    ? `${lesson.bestScore}% · ${lesson.starsEarned} star${lesson.starsEarned === 1 ? '' : 's'}`
                    : 'Ready'}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
};
