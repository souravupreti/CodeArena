import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import TopNav from '../components/TopNav';
import { CheckCircle2, ChevronRight, Clock, Trophy } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

const tagLabels = {
  array: 'Array',
  linkedList: 'Linked List',
  graph: 'Graph',
  dp: 'Dynamic Programming',
};

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [allProblems, setAllProblems] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const [solvedRes, allRes, submissionsRes] = await Promise.all([
          axiosClient.get('/problem/problemSolvedByUser').catch(() => ({ data: [] })),
          axiosClient.get('/problem/getAllProblem').catch((err) => {
            if (err.response?.status === 404) return { data: [] };
            throw err;
          }),
          axiosClient.get('/submission/my').catch(() => ({ data: [] })),
        ]);
        setSolvedProblems(solvedRes.data || []);
        setAllProblems(allRes.data || []);
        setRecentSubmissions(submissionsRes.data || []);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfileData();
  }, [user]);

  const getCounts = (list) => {
    const easy = list.filter((p) => p.difficulty === 'easy').length;
    const medium = list.filter((p) => p.difficulty === 'medium').length;
    const hard = list.filter((p) => p.difficulty === 'hard').length;
    return { easy, medium, hard, total: list.length };
  };

  const solvedStats = getCounts(solvedProblems);
  const totalStats = getCounts(allProblems);
  const solvedPercent = totalStats.total ? Math.round((solvedStats.total / totalStats.total) * 100) : 0;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'text-[#00b8a3] bg-[#14332f]';
      case 'wrong':
        return 'text-[#ff6b6b] bg-[#3a1d24]';
      case 'error':
        return 'text-[#ffc01e] bg-[#3a301d]';
      case 'pending':
        return 'text-[#7ab7ff] bg-[#172c44]';
      default:
        return 'text-[#d4d4d4] bg-[#333333]';
    }
  };

  const getVerdictLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'Accepted';
      case 'wrong':
        return 'Wrong Answer';
      case 'error':
        return 'Runtime Error';
      case 'pending':
        return 'Pending';
      default:
        return status || 'Unknown';
    }
  };

  const formatMemory = (memory) => {
    if (!memory) return '0 kB';
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="lc-page">
      <TopNav />

      {loading ? (
        <LoadingScreen variant="section" message="Loading profile..." />
      ) : (
        <main className="mx-auto grid max-w-[1240px] grid-cols-1 gap-7 px-5 py-8 lg:grid-cols-[330px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <section className="lc-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-[#74a5ff] text-4xl font-bold text-[#10224a]">
                  {user?.firstName?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h1 className="truncate text-xl font-bold text-white">{user?.firstName} {user?.lastName || ''}</h1>
                  <p className="truncate text-sm text-[#a3a3a3]">{user?.emailId}</p>
                  <p className="mt-2 text-xs uppercase text-[#8a8a8a]">Role: <span className="font-semibold text-white">{user?.role}</span></p>
                </div>
              </div>
            </section>

            <section className="lc-card p-6">
              <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-white">
                <Trophy size={18} className="text-[#ffa116]" />
                Problem Stats
              </h2>
              <div className="mb-5 text-center">
                <div className="text-5xl font-bold text-white">{solvedStats.total}<span className="text-xl text-[#8a8a8a]">/{totalStats.total}</span></div>
                <p className="mt-1 text-sm text-[#00b85a]">{solvedPercent}% solved</p>
              </div>
              <div className="space-y-4">
                {[
                  ['Easy', solvedStats.easy, totalStats.easy, 'text-[#00b8a3]', 'bg-[#00b8a3]'],
                  ['Medium', solvedStats.medium, totalStats.medium, 'text-[#ffc01e]', 'bg-[#ffc01e]'],
                  ['Hard', solvedStats.hard, totalStats.hard, 'text-[#ff375f]', 'bg-[#ff375f]'],
                ].map(([label, solved, total, textColor, barColor]) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className={`font-semibold ${textColor}`}>{label}</span>
                      <span className="text-white">{solved}/{total}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#333333]">
                      <div className={`h-full ${barColor}`} style={{ width: `${total ? (solved / total) * 100 : 0}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>

          <section className="space-y-6">
            <section className="lc-card p-6">
              <h2 className="mb-4 flex items-center gap-2 font-bold text-white">
                <CheckCircle2 size={18} className="text-[#00b85a]" />
                Solved Problems ({solvedProblems.length})
              </h2>
              {solvedProblems.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[#3a3a3a] py-10 text-center text-sm text-[#8a8a8a]">
                  No problems solved yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {solvedProblems.map((problem) => (
                    <NavLink key={problem._id} to={`/problem/${problem._id}`} className="flex items-center justify-between rounded-md bg-[#303030] px-4 py-3 transition hover:bg-[#3a3a3a]">
                      <div>
                        <p className="font-semibold text-white">{problem.title}</p>
                        <p className="text-xs text-[#a3a3a3]">{tagLabels[problem.tags] || problem.tags}</p>
                      </div>
                      <ChevronRight size={16} className="text-[#8a8a8a]" />
                    </NavLink>
                  ))}
                </div>
              )}
            </section>

            <section className="lc-card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-[#303030] px-6 py-4 font-bold text-white">
                <Clock size={18} className="text-[#ffa116]" />
                Recent Submissions
              </div>
              {recentSubmissions.length === 0 ? (
                <div className="py-12 text-center text-sm text-[#8a8a8a]">No submission history recorded yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#303030] text-xs uppercase text-[#a3a3a3]">
                      <tr>
                        <th className="px-5 py-3">Problem</th>
                        <th className="px-5 py-3">Language</th>
                        <th className="px-5 py-3">Verdict</th>
                        <th className="px-5 py-3 text-center">Runtime</th>
                        <th className="px-5 py-3 text-center">Memory</th>
                        <th className="px-5 py-3">Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSubmissions.slice(0, 12).map((sub) => (
                        <tr key={sub._id} className="border-t border-[#303030] hover:bg-[#2a2a2a]">
                          <td className="px-5 py-4 font-semibold text-white">
                            {sub.problemId ? (
                              <NavLink to={`/problem/${sub.problemId._id}`} className="hover:text-[#ffa116]">{sub.problemId.title}</NavLink>
                            ) : (
                              <span className="text-[#747474]">Deleted problem</span>
                            )}
                          </td>
                          <td className="px-5 py-4 uppercase text-[#b8b8b8]">{sub.language}</td>
                          <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(sub.status)}`}>{getVerdictLabel(sub.status)}</span></td>
                          <td className="px-5 py-4 text-center">{sub.runtime}s</td>
                          <td className="px-5 py-4 text-center">{formatMemory(sub.memory)}</td>
                          <td className="px-5 py-4 text-xs text-[#8a8a8a]">{new Date(sub.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </section>
        </main>
      )}
    </div>
  );
}

export default Profile;
