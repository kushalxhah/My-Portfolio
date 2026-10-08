import React, { useState, useEffect } from 'react';
import './CodeEditorMockup.css';

const TYPE_SPEED = 15; // initial code type-in

const beforeRole = [
  { text: '// Kushal Shah\'s Profile\n', type: 'comment' },
  { text: 'class ', type: 'keyword' },
  { text: 'Developer ', type: 'class-name' },
  { text: '{\n  ', type: 'punctuation' },
  { text: 'constructor', type: 'keyword' },
  { text: '() {\n    ', type: 'punctuation' },
  { text: 'this', type: 'keyword-this' },
  { text: '.', type: 'punctuation' },
  { text: 'name ', type: 'property' },
  { text: '= ', type: 'operator' },
  { text: '"Kushal Shah"', type: 'string' },
  { text: ';\n    ', type: 'punctuation' },
  { text: 'this', type: 'keyword-this' },
  { text: '.', type: 'punctuation' },
  { text: 'role ', type: 'property' },
  { text: '= ', type: 'operator' },
  { text: '"', type: 'string' },
];

const afterRole = [
  { text: '"', type: 'string' },
  { text: ';\n    ', type: 'punctuation' },
  { text: 'this', type: 'keyword-this' },
  { text: '.', type: 'punctuation' },
  { text: 'journey ', type: 'property' },
  { text: '= ', type: 'operator' },
  { text: '"LJU (2024 - 2028)"', type: 'string' },
  { text: ';\n  }\n', type: 'punctuation' },
  { text: 'getCoreFocus', type: 'function' },
  { text: '() {\n    ', type: 'punctuation' },
  { text: 'return ', type: 'keyword' },
  { text: '[\n      ', type: 'punctuation' },
  { text: '"Interactive Web Apps"', type: 'string' },
  { text: ', ', type: 'punctuation' },
  { text: '\n      "Clean Architecture"', type: 'string' },
  { text: ',\n      ', type: 'punctuation' },
  { text: '"Database Optimization"', type: 'string' },
  { text: '\n    ];\n  }\n}', type: 'punctuation' },
];

const colorMap = {
  comment: '#6a9955', keyword: '#569cd6', 'class-name': '#4ec9b0',
  punctuation: '#d4d4d4', 'keyword-this': '#569cd6', property: '#9cdcfe',
  operator: '#d4d4d4', string: '#ce9178', function: '#dcdcaa',
};

function tokensToCharColors(tokens) {
  const arr = [];
  for (const token of tokens) {
    const color = colorMap[token.type] || '#d4d4d4';
    for (const ch of token.text) arr.push({ ch, color });
  }
  return arr;
}

function splitIntoLines(charColors) {
  const lines = [[]];
  for (const item of charColors) {
    if (item.ch === '\n') lines.push([]);
    else lines[lines.length - 1].push(item);
  }
  return lines;
}

const TOTAL_LINES = 15;
const INITIAL_ROLE = 'Python Developer';

// CodeEditorMockup receives roleText from parent (App.jsx shared state)
export default function CodeEditorMockup({ roleText = INITIAL_ROLE }) {
  const [initDone, setInitDone]   = useState(false);
  const [initTyped, setInitTyped] = useState('');

  const fullInitCode = [
    ...beforeRole,
    { text: INITIAL_ROLE, type: 'string' },
    ...afterRole,
  ].map(t => t.text).join('');

  // Phase 1: type-in the full code once on mount
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= fullInitCode.length) {
        clearInterval(interval);
        setInitDone(true);
        return;
      }
      setInitTyped(fullInitCode.slice(0, i + 1));
      i++;
    }, TYPE_SPEED);
    return () => clearInterval(interval);
  }, []);

  // Build colored lines
  const beforeColors = tokensToCharColors(beforeRole);
  // After init, use the live roleText prop from parent
  const roleColors   = Array.from(initDone ? roleText : INITIAL_ROLE)
    .map(ch => ({ ch, color: '#ce9178' }));
  const afterColors  = tokensToCharColors(afterRole);

  let coloredLines;
  if (!initDone) {
    const allTokens = [
      ...beforeRole, { text: INITIAL_ROLE, type: 'string' }, ...afterRole,
    ];
    const typed = tokensToCharColors(allTokens).slice(0, initTyped.length);
    coloredLines = splitIntoLines(typed);
  } else {
    coloredLines = splitIntoLines([...beforeColors, ...roleColors, ...afterColors]);
  }

  const lastLineIndex = TOTAL_LINES - 1;

  return (
    <div className="vscode-editor-card">
      <div className="vscode-titlebar">
        <div className="vscode-controls">
          <span className="control close" />
          <span className="control minimize" />
          <span className="control maximize" />
        </div>
        <div className="vscode-filename">
          <svg className="js-icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h18v18H3V3z" fill="#f7df1e" />
            <path d="M12 12h3v3h-3v-3z" fill="#000" />
            <path d="M18 18h-3v-5h3v5zm-6-2h-3v-2h3v2zm0-3h-3v-2h3v2z" fill="#000" />
          </svg>
          developer.js
        </div>
        <div className="vscode-spacer" />
      </div>

      <div className="vscode-editor-body">
        <div className="vscode-line-numbers">
          {Array.from({ length: TOTAL_LINES }).map((_, i) => (
            <div key={i} className="line-num">{i + 1}</div>
          ))}
        </div>

        <pre className="vscode-code">
          <code>
            {Array.from({ length: TOTAL_LINES }).map((_, i) => {
              const showCursor = !initDone
                ? i === coloredLines.length - 1
                : i === lastLineIndex;
              return (
                <div key={i} className="code-line">
                  {(coloredLines[i] || []).map((item, j) => (
                    <span key={j} style={{ color: item.color }}>{item.ch}</span>
                  ))}
                  {showCursor && <span className="vscode-cursor">|</span>}
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}
