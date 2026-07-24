import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import LoadingScreen from './LoadingScreen';

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        setSubmissions(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch submission history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return <span className="rounded-full bg-[#14332f] px-2.5 py-1 text-xs font-bold text-[#00b8a3]">Accepted</span>;
      case 'wrong':
        return <span className="rounded-full bg-[#3a1d24] px-2.5 py-1 text-xs font-bold text-[#ff6b6b]">Wrong Answer</span>;
      case 'error':
        return <span className="rounded-full bg-[#3a301d] px-2.5 py-1 text-xs font-bold text-[#ffc01e]">Runtime Error</span>;
      default:
        return <span className="rounded-full bg-[#333333] px-2.5 py-1 text-xs font-bold text-[#d4d4d4]">{status}</span>;
    }
  };

  const formatMemory = (memory) => {
    if (!memory) return '0 kB';
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  if (loading) {
    return <LoadingScreen variant="inline" message="Fetching submissions..." />;
  }

  if (error) {
    return <div className="rounded-lg border border-[#703038] bg-[#3a1d24] p-3.5 font-mono text-xs text-rose-200">{error}</div>;
  }

  return (
    <div>
      {submissions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#3a3a3a] bg-[#1a1a1a] p-8 text-center font-mono text-xs text-[#8a8a8a]">
          No submissions found for this problem yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[#303030] bg-[#1a1a1a]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="bg-[#303030] font-mono text-xs uppercase text-[#a3a3a3]">
                <tr>
                  <th className="w-12 px-4 py-3 text-center">#</th>
                  <th className="px-4 py-3">Lang</th>
                  <th className="px-4 py-3">Verdict</th>
                  <th className="px-4 py-3 text-center">Runtime</th>
                  <th className="px-4 py-3 text-center">Memory</th>
                  <th className="px-4 py-3 text-center">Passed</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3 text-center">Code</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs text-[#e5e5e5]">
                {submissions.map((sub, index) => (
                  <tr key={sub._id} className="border-t border-[#303030] hover:bg-[#242424]">
                    <td className="px-4 py-3 text-center font-bold text-[#747474]">{index + 1}</td>
                    <td className="px-4 py-3 font-bold uppercase">{sub.language}</td>
                    <td className="px-4 py-3">{getStatusBadge(sub.status)}</td>
                    <td className="px-4 py-3 text-center">{sub.runtime}s</td>
                    <td className="px-4 py-3 text-center">{formatMemory(sub.memory)}</td>
                    <td className="px-4 py-3 text-center font-bold">{sub.testCasesPassed}/{sub.testCasesTotal}</td>
                    <td className="px-4 py-3 text-xs text-[#8a8a8a]">{new Date(sub.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <button className="rounded-md bg-[#333333] px-3 py-1 text-xs transition hover:bg-[#444444]" onClick={() => setSelectedSubmission(sub)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl overflow-hidden rounded-lg border border-[#303030] bg-[#242424] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#303030] bg-[#303030] p-4">
              <h3 className="font-mono text-sm font-bold text-white">
                Submission Source: <span className="uppercase text-[#ffa116]">{selectedSubmission.language}</span>
              </h3>
              <button onClick={() => setSelectedSubmission(null)} className="rounded-md px-2 py-1 text-[#a3a3a3] hover:bg-[#3a3a3a] hover:text-white">
                x
              </button>
            </div>
            <div className="p-5">
              <div className="mb-4 flex flex-wrap gap-2">
                {getStatusBadge(selectedSubmission.status)}
                <span className="rounded-full bg-[#333333] px-2.5 py-1 text-xs font-bold text-[#d4d4d4]">Runtime: {selectedSubmission.runtime}s</span>
                <span className="rounded-full bg-[#333333] px-2.5 py-1 text-xs font-bold text-[#d4d4d4]">Memory: {formatMemory(selectedSubmission.memory)}</span>
                <span className="rounded-full bg-[#333333] px-2.5 py-1 text-xs font-bold text-[#d4d4d4]">Passed: {selectedSubmission.testCasesPassed}/{selectedSubmission.testCasesTotal}</span>
              </div>
              {selectedSubmission.errorMessage && (
                <div className="mb-4 rounded-lg border border-[#703038] bg-[#3a1d24] p-3 text-xs leading-relaxed text-rose-200">
                  {selectedSubmission.errorMessage}
                </div>
              )}
              <pre className="max-h-96 overflow-x-auto rounded-lg border border-[#303030] bg-[#0f0f0f] p-4 text-xs leading-relaxed text-[#f5f5f5]">
                <code>{selectedSubmission.code}</code>
              </pre>
            </div>
            <div className="flex justify-end border-t border-[#303030] bg-[#303030] p-3">
              <button className="lc-btn lc-btn-muted py-1.5 text-xs" onClick={() => setSelectedSubmission(null)}>
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;
