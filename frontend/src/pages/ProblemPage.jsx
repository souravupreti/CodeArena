import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams, NavLink } from 'react-router';
import axiosClient from '../utils/axiosClient';
import SubmissionHistory from '../components/SubmissionHistory';
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';
// import LoadingScreen from '../components/LoadingScreen';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Code2,
  FileText,
  FlaskConical,
  MessageCircle,
  Play,
  RotateCcw,
  Send,
  Sparkles,
} from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';
import TopNav from '../components/TopNav';

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const [fetchingHint, setFetchingHint] = useState(false);
  const [hintText, setHintText] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const editorRef = useRef(null);
  const { problemId } = useParams();
  const { handleSubmit } = useForm();

  const handleGetHint = async () => {
    if (!problem) return;
    setFetchingHint(true);
    setHintText('');
    try {
      const response = await axiosClient.post('/ai/chat', {
        messages: [
          {
            role: 'user',
            parts: [
              {
                text: `Provide a subtle, step-by-step hint for solving the problem "${problem.title}". DO NOT provide the complete solution or code. Give algorithmic intuition and guide me on how to think about the optimal approach.`,
              },
            ],
          },
        ],
        title: problem.title,
        description: problem.description,
        testCases: JSON.stringify(problem.visibleTestCases),
        templates: JSON.stringify(problem.templates)
      });
      setHintText(response.data.message);
    } catch (error) {
      console.error('Hint Error:', error);
      setHintText('Failed to retrieve hint. Please verify your connection or try again.');
    } finally {
      setFetchingHint(false);
    }
  };

  const normalizeLanguage = (language) => {
    const value = language?.toLowerCase();
    if (value === 'c++' || value === 'cpp') return 'cpp';
    if (value === 'javascript') return 'javascript';
    if (value === 'java') return 'java';
    return value;
  };

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const [problemResponse, solvedResponse] = await Promise.all([
          axiosClient.get(`/problem/problemById/${problemId}`),
          axiosClient.get('/problem/problemSolvedByUser').catch(() => ({ data: [] })),
        ]);
        const problemData = problemResponse.data;
       const initialCodeObj = problemData.templates?.find(
  (t) => normalizeLanguage(t.language) === selectedLanguage
);

if (initialCodeObj) {
  setCode(initialCodeObj.starterCode);
}

        setProblem(problemData);
        setIsSolved((solvedResponse.data || []).some((item) => item._id === problemId));
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

useEffect(() => {
  if (!problem) return;

  const initialCodeObj = problem.templates?.find(
    (t) => normalizeLanguage(t.language) === selectedLanguage
  );

  if (initialCodeObj) {
    setCode(initialCodeObj.starterCode);
  }
}, [selectedLanguage, problem]);

  const handleEditorChange = (value) => setCode(value || '');
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };
  const handleLanguageChange = (language) => setSelectedLanguage(language);

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage,
      });
      setRunResult(response.data);
      setActiveRightTab('testcase');
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({ success: false, error: 'Internal server error', testCases: [] });
      setActiveRightTab('testcase');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code,
        language: selectedLanguage,
      });
      setSubmitResult(response.data);
      if (response.data?.accepted) setIsSolved(true);
      setActiveRightTab('result');
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult(null);
      setActiveRightTab('result');
    } finally {
      setLoading(false);
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript':
        return 'javascript';
      case 'java':
        return 'java';
      case 'cpp':
        return 'cpp';
      default:
        return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-[#00b8a3] bg-[#14332f]';
      case 'medium':
        return 'text-[#ffc01e] bg-[#3a301d]';
      case 'hard':
        return 'text-[#ff375f] bg-[#3a1d24]';
      default:
        return 'text-[#a3a3a3] bg-[#333333]';
    }
  };

  if (loading && !problem) {
    return <LoadingScreen variant="fullscreen" message="Loading workspace..." />;
  }
  const leftTabs = [
    ['description', 'Description', FileText],
    ['editorial', 'Editorial', BookOpen],
    ['solutions', 'Solutions', FlaskConical],
    ['submissions', 'Submissions', RotateCcw],
    ['chatAI', 'Chat AI', MessageCircle],
  ];

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0f0f0f] text-[#f5f5f5]">
      <header >
        {/* <div className="flex items-center gap-2">
          <NavLink to="/" className="rounded-md p-2 text-[#b8b8b8] hover:bg-[#2b2b2b] hover:text-white">
            <ArrowLeft size={18} />
          </NavLink>
          <span className="h-7 w-px bg-[#303030]" />
          <span className="font-semibold">Problem List</span>
          <button className="rounded-md p-2 text-[#8a8a8a] hover:bg-[#2b2b2b] hover:text-white">
            <RotateCcw size={17} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="lc-btn lc-btn-muted h-9 px-4" onClick={handleRun} disabled={loading}>
            <Play size={16} />
            {loading ? 'Running' : 'Run'}
          </button>
          <button className="lc-btn lc-btn-primary h-9 px-4" onClick={handleSubmitCode} disabled={loading}>
            <Send size={16} />
            {loading ? 'Submitting' : 'Submit'}
          </button>
        </div> */}
        <TopNav />
      </header>

      <div className="flex min-h-0 flex-1 gap-2 p-2">
        <section className="flex w-1/2 flex-col overflow-hidden rounded-lg border border-[#3a3a3a] bg-[#1f1f1f]">
          <div className="flex overflow-x-auto border-b border-[#303030] bg-[#303030] px-3 text-sm">
            {leftTabs.map(([tab, label, Icon]) => (
              <button
                key={tab}
                className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-3 font-semibold transition ${
                  activeLeftTab === tab
                    ? 'border-[#ffa116] bg-[#242424] text-white'
                    : 'border-transparent text-[#b8b8b8] hover:text-white'
                }`}
                onClick={() => setActiveLeftTab(tab)}
              >
                <Icon size={16} className={activeLeftTab === tab ? 'text-[#0a84ff]' : 'text-[#8a8a8a]'} />
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {problem && activeLeftTab === 'description' && (
              <div>
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold text-white">{problem.title}</h1>
                  {isSolved && (
                    <span className="ml-auto flex items-center gap-1.5 text-sm text-[#00b85a]">
                      Solved <CheckCircle2 size={17} />
                    </span>
                  )}
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                  <span className="rounded-full bg-[#333333] px-3 py-1 text-xs text-[#d4d4d4]">{problem.tags}</span>
                  <button
                    onClick={handleGetHint}
                    disabled={fetchingHint}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#3d2a12] px-3 py-1 text-xs font-bold text-[#ffa116] transition hover:bg-[#4b3417] disabled:opacity-50"
                  >
                    <Sparkles size={12} className={fetchingHint ? 'animate-spin' : ''} />
                    {fetchingHint ? 'Analyzing...' : 'Hint'}
                  </button>
                </div>

                {hintText && (
                  <div className="relative mb-6 rounded-lg border border-[#4b3417] bg-[#2b241b] p-4 text-sm text-[#f5f5f5]">
                    <button
                      onClick={() => setHintText('')}
                      className="absolute right-2.5 top-2.5 rounded px-1.5 py-0.5 text-xs font-bold text-[#a3a3a3] hover:bg-[#3a3a3a] hover:text-white"
                    >
                      x
                    </button>
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase text-[#ffa116]">
                      <Sparkles size={14} />
                      Gemini AI logic hint
                    </div>
                    <div className="whitespace-pre-wrap leading-relaxed">{hintText}</div>
                  </div>
                )}

                <div className="whitespace-pre-wrap text-[15px] leading-7 text-white">{problem.description}</div>

                <div className="mt-9">
                  <h3 className="mb-4 text-base font-bold text-white">Examples</h3>
                  <div className="space-y-4">
                    {problem.visibleTestCases.map((example, index) => (
                      <div key={index} className="border-l-2 border-[#3a3a3a] bg-[#242424] p-4 font-mono text-sm">
                        <h4 className="mb-2 font-bold text-white">Example {index + 1}:</h4>
                        <div className="space-y-1.5 text-[#cfcfcf]">
                          <div>
                            <strong className="text-white">Input:</strong>{' '}
                            <code className="rounded bg-[#333333] px-1.5 py-0.5 text-[#e5e5e5]">{example.input}</code>
                          </div>
                          <div>
                            <strong className="text-white">Output:</strong>{' '}
                            <code className="rounded bg-[#333333] px-1.5 py-0.5 text-[#e5e5e5]">{example.output}</code>
                          </div>
                          {example.explanation && (
                            <div>
                              <strong className="text-white">Explanation:</strong> {example.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {problem && activeLeftTab === 'editorial' && (
              <div>
                <h2 className="mb-4 text-lg font-bold text-white">Editorial Video & Solution Walkthrough</h2>
                {problem.secureUrl ? (
                  <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration} />
                ) : (
                  <div className="rounded-lg border border-dashed border-[#3a3a3a] bg-[#1a1a1a] p-8 text-center text-sm text-[#8a8a8a]">
                    No editorial video has been uploaded for this problem yet.
                  </div>
                )}
              </div>
            )}

            {problem && activeLeftTab === 'solutions' && (
              <div>
                <h2 className="mb-4 text-lg font-bold text-white">Reference Solutions</h2>
                <div className="space-y-6">
                  <div className="rounded-lg border border-dashed border-[#3a3a3a] bg-[#1a1a1a] p-8 text-center">
  <h3 className="text-lg font-semibold text-white">
    Solutions are locked
  </h3>

  <p className="mt-2 text-sm text-[#8a8a8a]">
    Submit an accepted solution to unlock the official solution.
  </p>
</div>
                </div>
              </div>
            )}

            {problem && activeLeftTab === 'submissions' && (
              <div>
                <h2 className="mb-4 text-lg font-bold text-white">My Submission Logs</h2>
                <SubmissionHistory problemId={problemId} />
              </div>
            )}

            {problem && activeLeftTab === 'chatAI' && (
              <div>
                <h2 className="mb-4 text-lg font-bold text-white">Interactive AI Tutor</h2>
                <ChatAi problem={problem} />
              </div>
            )}
          </div>
        </section>

        <section className="flex w-1/2 flex-col overflow-hidden rounded-lg border border-[#303030] bg-[#1f1f1f]">
          <div className="flex border-b border-[#303030] bg-[#303030] px-3 text-sm">
            {['code', 'testcase', 'result'].map((tab) => (
              <button
                key={tab}
                className={`flex items-center gap-1.5 border-b-2 px-4 py-3 font-semibold capitalize transition ${
                  activeRightTab === tab
                    ? 'border-[#ffa116] bg-[#242424] text-white'
                    : 'border-transparent text-[#b8b8b8] hover:text-white'
                }`}
                onClick={() => setActiveRightTab(tab)}
              >
                {tab === 'code' && <Code2 size={16} className="text-[#00b85a]" />}
                {tab === 'testcase' ? 'Testcase Console' : tab}
              </button>
            ))}
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            {activeRightTab === 'code' && (
              <form onSubmit={handleSubmit(handleSubmitCode)} className="flex min-h-0 flex-1 flex-col">
                <div className="flex items-center justify-between border-b border-[#303030] bg-[#242424] p-3">
                  <div className="flex gap-2">
                    {['javascript', 'java', 'cpp'].map((lang) => (
                      <button
                        type="button"
                        key={lang}
                        className={`rounded-md px-3 py-1 font-mono text-xs font-semibold transition ${
                          selectedLanguage === lang
                            ? 'bg-[#3a3a3a] text-white'
                            : 'bg-transparent text-[#b8b8b8] hover:bg-[#303030] hover:text-white'
                        }`}
                        onClick={() => handleLanguageChange(lang)}
                      >
                        {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="min-h-0 flex-1">
                  <Editor
                    height="100%"
                    language={getLanguageForMonaco(selectedLanguage)}
                    value={code}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    theme="vs-dark"
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      insertSpaces: true,
                      wordWrap: 'on',
                      lineNumbers: 'on',
                      glyphMargin: false,
                      folding: true,
                      lineDecorationsWidth: 10,
                      lineNumbersMinChars: 3,
                      renderLineHighlight: 'line',
                      selectOnLineNumbers: true,
                      roundedSelection: false,
                      readOnly: false,
                      cursorStyle: 'line',
                      mouseWheelZoom: true,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between border-t border-[#303030] bg-[#242424] p-3">
                  <button type="button" className="lc-btn lc-btn-muted py-1.5 font-mono text-xs" onClick={() => setActiveRightTab('testcase')}>
                    Console
                  </button>
                  <div className="flex gap-2">
                    <button type="button" className="lc-btn lc-btn-muted py-1.5 text-xs" onClick={handleRun} disabled={loading}>
                      {loading ? 'Compiling...' : 'Run'}
                    </button>
                    <button type="button" className="lc-btn lc-btn-primary py-1.5 text-xs" onClick={handleSubmitCode} disabled={loading}>
                      {loading ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeRightTab === 'testcase' && (
              <div className="flex-1 overflow-y-auto bg-[#1f1f1f] p-5 font-mono text-xs">
                <h3 className="mb-4 text-xs font-bold uppercase text-white">Test Execution Results</h3>
                {runResult ? (
                  <div className={`mb-4 rounded-lg border p-4 ${runResult.success ? 'border-[#145c49] bg-[#10251f] text-emerald-100' : 'border-[#703038] bg-[#2b1518] text-rose-100'}`}>
                    {runResult.success ? (
                      <div>
                        <h4 className="mb-2 text-sm font-bold text-emerald-300">All Visible Test Cases Passed</h4>
                        <p className="text-xs text-emerald-200">Runtime: {runResult.runtime} sec | Memory: {runResult.memory} KB</p>
                      </div>
                    ) : (
                      <h4 className="mb-2 text-sm font-bold text-rose-300">Test Case Failed / Error</h4>
                    )}
                    <div className="mt-4 space-y-2">
                      {(runResult.testCases || []).map((tc, i) => (
                        <div key={i} className="rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] p-3 text-[#d4d4d4]">
                          <div><strong>Input:</strong> {tc.stdin}</div>
                          <div><strong>Expected:</strong> {tc.expected_output}</div>
                          <div><strong>Output:</strong> {tc.stdout}</div>
                          <div className={tc.status_id == 3 ? 'mt-1 font-bold text-emerald-400' : 'mt-1 font-bold text-rose-400'}>
                            {tc.status_id == 3 ? 'Passed' : 'Failed'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-[#8a8a8a]">Click "Run" to evaluate code against sample test suites.</div>
                )}
              </div>
            )}

            {activeRightTab === 'result' && (
              <div className="flex-1 overflow-y-auto bg-[#1f1f1f] p-5 font-mono text-xs">
                <h3 className="mb-4 text-xs font-bold uppercase text-white">Batch Submission Result</h3>
                {submitResult ? (
                  <div className={`rounded-lg border p-4 ${submitResult.accepted ? 'border-[#145c49] bg-[#10251f] text-emerald-100' : 'border-[#703038] bg-[#2b1518] text-rose-100'}`}>
                    {submitResult.accepted ? (
                      <div>
                        <h4 className="text-base font-bold text-emerald-300">Accepted</h4>
                        <div className="mt-3 space-y-1 text-xs text-emerald-200">
                          <p>Test Cases Passed: <strong>{submitResult.passedTestCases}/{submitResult.totalTestCases}</strong></p>
                          <p>Runtime: <strong>{submitResult.runtime} sec</strong></p>
                          <p>Memory: <strong>{submitResult.memory} KB</strong></p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-base font-bold text-rose-300">{submitResult.error || 'Wrong Answer'}</h4>
                        <div className="mt-3 space-y-1 text-xs text-rose-200">
                          <p>Test Cases Passed: <strong>{submitResult.passedTestCases}/{submitResult.totalTestCases}</strong></p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[#8a8a8a]">Click "Submit" to run solution against hidden test cases.</div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProblemPage;
