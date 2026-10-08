// Shared role cycling hook — single source of truth for both hero and editor card
import { useState, useEffect } from 'react';

export const ROLES = [
  'Python Developer',
  'Web Application Engineer',
  'Problem Solver',
  'Full Stack Developer',
  'UI/UX Enthusiast',
];

const TYPE_SPEED   = 60;
const DELETE_SPEED = 25;
const PAUSE_MS     = 1600;

export function useRoleCycler() {
  const [displayText, setDisplayText] = useState('');
  const [roleIdx, setRoleIdx]         = useState(0);
  const [phase, setPhase]             = useState('typing'); // 'typing' | 'pausing' | 'deleting'
  const [charIdx, setCharIdx]         = useState(0);

  useEffect(() => {
    let timer;

    if (phase === 'typing') {
      if (charIdx < ROLES[roleIdx].length) {
        timer = setTimeout(() => {
          setCharIdx(c => c + 1);
          setDisplayText(ROLES[roleIdx].slice(0, charIdx + 1));
        }, TYPE_SPEED);
      } else {
        timer = setTimeout(() => setPhase('pausing'), PAUSE_MS);
      }
    } else if (phase === 'pausing') {
      timer = setTimeout(() => setPhase('deleting'), PAUSE_MS);
    } else if (phase === 'deleting') {
      if (charIdx > 0) {
        timer = setTimeout(() => {
          setCharIdx(c => c - 1);
          setDisplayText(ROLES[roleIdx].slice(0, charIdx - 1));
        }, DELETE_SPEED);
      } else {
        const next = (roleIdx + 1) % ROLES.length;
        setRoleIdx(next);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timer);
  }, [phase, charIdx, roleIdx]);

  return { displayText, roleIdx, phase };
}
