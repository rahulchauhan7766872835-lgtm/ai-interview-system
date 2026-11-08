import React, { useState } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, Code2 } from 'lucide-react';

interface CodeSandboxProps {
  initialCode?: string;
  language?: string;
  onChange: (code: string) => void;
}

export const CodeSandbox: React.FC<CodeSandboxProps> = ({
  initialCode = '// Write your solution here\nfunction solution() {\n  return true;\n}',
  language = 'typescript',
  onChange
}) => {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState(language);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCode(val);
    onChange(val);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(initialCode);
    onChange(initialCode);
    setConsoleOutput(null);
  };

  const handleRunCode = () => {
    try {
      // Safe client sandbox execution for JavaScript/TypeScript syntax
      const logs: string[] = [];
      const customConsole = {
        log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
        error: (...args: any[]) => logs.push('[ERROR] ' + args.join(' ')),
        warn: (...args: any[]) => logs.push('[WARN] ' + args.join(' '))
      };

      // Wrap in function execution
      const runFn = new Function('console', `
        try {
          ${code}
        } catch (e) {
          console.error(e.message);
        }
      `);

      runFn(customConsole);
      setConsoleOutput(logs.length > 0 ? logs.join('\n') : 'Code executed cleanly with no stdout output.');
    } catch (err: any) {
      setConsoleOutput(`Runtime Execution Error:\n${err.message}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300">Live Code Sandbox</span>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded px-2 py-0.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="sql">SQL</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors text-xs flex items-center space-x-1"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors text-xs flex items-center space-x-1"
            title="Reset code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRunCode}
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center space-x-1 shadow transition-colors"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Run</span>
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="relative flex-1 min-h-[220px]">
        <textarea
          value={code}
          onChange={handleCodeChange}
          spellCheck={false}
          className="w-full h-full p-4 bg-slate-900/90 text-indigo-100 font-mono text-xs md:text-sm resize-none focus:outline-none leading-relaxed selection:bg-indigo-600/40"
          placeholder="// Type your code solution here..."
        />
      </div>

      {/* Console output drawer */}
      {consoleOutput !== null && (
        <div className="border-t border-slate-800 bg-slate-950 p-3 max-h-36 overflow-y-auto">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
              <Terminal className="w-3 h-3" />
              <span>Console Output</span>
            </span>
            <button 
              onClick={() => setConsoleOutput(null)}
              className="text-[10px] text-slate-500 hover:text-slate-300"
            >
              Clear
            </button>
          </div>
          <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed">
            {consoleOutput}
          </pre>
        </div>
      )}
    </div>
  );
};
