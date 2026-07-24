import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import TopNav from '../components/TopNav';
import { Check, Circle, Filter, Search, Trophy } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

const tagLabels = {
  array: 'Array',
  linkedList: 'Linked List',
  graph: 'Graph',
  dp: 'Dynamic Programming',
};

function Homepage() {
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ difficulty: 'all', tag: 'all', status: 'all' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [problemsRes, solvedRes] = await Promise.all([
          axiosClient.get('/problem/getAllProblem').catch((err) => {
            if (err.response?.status === 404) return { data: [] };
            throw err;
          }),
          user ? axiosClient.get('/problem/problemSolvedByUser').catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
        ]);
        setProblems((problemsRes.data || []).filter(Boolean));
        setSolvedProblems((solvedRes.data || []).filter(Boolean));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Unable to load problems. Please check backend connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const solvedIds = useMemo(() => new Set(solvedProblems.map((problem) => problem._id)), [solvedProblems]);

  const stats = useMemo(() => {
    const countByDifficulty = (difficulty) => problems.filter((p) => p.difficulty === difficulty).length;
    const solvedByDifficulty = (difficulty) => solvedProblems.filter((p) => p.difficulty === difficulty).length;
    return {
      total: problems.length,
      solved: solvedProblems.length,
      easy: countByDifficulty('easy'),
      medium: countByDifficulty('medium'),
      hard: countByDifficulty('hard'),
      solvedEasy: solvedByDifficulty('easy'),
      solvedMedium: solvedByDifficulty('medium'),
      solvedHard: solvedByDifficulty('hard'),
    };
  }, [problems, solvedProblems]);

  const topicCounts = useMemo(() => (
    Object.entries(tagLabels).map(([tag, label]) => ({
      tag,
      label,
      count: problems.filter((problem) => problem.tags === tag).length,
    }))
  ), [problems]);

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = (problem.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const matchesTag = filters.tag === 'all' || problem.tags === filters.tag;
    const isSolved = solvedIds.has(problem._id);
    const matchesStatus =
      filters.status === 'all' ||
      (filters.status === 'solved' && isSolved) ||
      (filters.status === 'unsolved' && !isSolved);

    return matchesSearch && matchesDifficulty && matchesTag && matchesStatus;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'text-[#00b8a3]';
      case 'medium':
        return 'text-[#ffc01e]';
      case 'hard':
        return 'text-[#ff375f]';
      default:
        return 'text-[#a3a3a3]';
    }
  };

  return (
    <div className="lc-page">
      <TopNav />

      <main className="mx-auto max-w-[1240px] px-5 py-8">
        <section className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="lc-card p-5">
            <p className="text-sm text-[#a3a3a3]">Total Problems</p>
            <p className="mt-2 text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="lc-card p-5">
            <p className="text-sm text-[#a3a3a3]">Solved</p>
            <p className="mt-2 text-3xl font-bold text-[#00b85a]">{stats.solved}</p>
          </div>
          <div className="lc-card p-5">
            <p className="text-sm text-[#a3a3a3]">Progress</p>
            <p className="mt-2 text-3xl font-bold text-white">{stats.total ? Math.round((stats.solved / stats.total) * 100) : 0}%</p>
          </div>
          <NavLink to="/leaderboard" className="lc-card group p-5 transition hover:border-[#4a4a4a]">
            <p className="flex items-center gap-2 text-sm text-[#a3a3a3]"><Trophy size={16} className="text-[#ffa116]" /> Leaderboard</p>
            <p className="mt-2 text-base font-semibold text-white group-hover:text-[#ffa116]">View rankings</p>
          </NavLink>
        </section>

        <section className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            ['Easy', stats.solvedEasy, stats.easy, 'text-[#00b8a3]', 'bg-[#00b8a3]'],
            ['Medium', stats.solvedMedium, stats.medium, 'text-[#ffc01e]', 'bg-[#ffc01e]'],
            ['Hard', stats.solvedHard, stats.hard, 'text-[#ff375f]', 'bg-[#ff375f]'],
          ].map(([label, solved, total, textColor, barColor]) => (
            <div key={label} className="lc-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className={`font-semibold ${textColor}`}>{label}</span>
                <span className="text-sm text-white">{solved}/{total}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#333333]">
                <div className={`h-full ${barColor}`} style={{ width: `${total ? (solved / total) * 100 : 0}%` }} />
              </div>
            </div>
          ))}
        </section>

        <section className="lc-card overflow-hidden">
          <div className="border-b border-[#303030] p-5">
            <div className="mb-5 flex flex-wrap gap-3">
              <button
                className={`rounded-full px-4 py-2 text-sm font-semibold ${filters.tag === 'all' ? 'bg-white text-[#1a1a1a]' : 'bg-[#303030] text-[#d4d4d4]'}`}
                onClick={() => setFilters({ ...filters, tag: 'all' })}
              >
                All Topics <span className="ml-1 text-xs opacity-70">{problems.length}</span>
              </button>
              {topicCounts.map((topic) => (
                <button
                  key={topic.tag}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${filters.tag === topic.tag ? 'bg-white text-[#1a1a1a]' : 'bg-[#303030] text-[#d4d4d4] hover:bg-[#3a3a3a]'}`}
                  onClick={() => setFilters({ ...filters, tag: topic.tag })}
                >
                  {topic.label} <span className="ml-1 text-xs opacity-70">{topic.count}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3a3a3]" />
                <input
                  className="lc-input w-full pl-11"
                  placeholder="Search problems"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <select className="lc-input rounded-md" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
                <option value="all">All Status</option>
                <option value="solved">Solved</option>
                <option value="unsolved">Unsolved</option>
              </select>
              <select className="lc-input rounded-md" value={filters.difficulty} onChange={(event) => setFilters({ ...filters, difficulty: event.target.value })}>
                <option value="all">All Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <button className="lc-btn lc-btn-muted" onClick={() => {
                setSearchTerm('');
                setFilters({ difficulty: 'all', tag: 'all', status: 'all' });
              }}>
                <Filter size={17} />
                Reset
              </button>
            </div>
          </div>

          {loading ? (
            <LoadingScreen variant="inline" message="Loading problems..." />
          ) : error ? (
            <div className="p-8 text-center text-sm text-[#ff6b6b]">{error}</div>
          ) : filteredProblems.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#8a8a8a]">No matching problems found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#303030] text-xs uppercase text-[#a3a3a3]">
                  <tr>
                    <th className="w-16 px-5 py-3 text-center">Status</th>
                    <th className="px-5 py-3">Title</th>
                    <th className="w-36 px-5 py-3">Difficulty</th>
                    <th className="w-52 px-5 py-3">Topic</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProblems.map((problem, index) => {
                    const isSolved = solvedIds.has(problem._id);
                    return (
                      <tr key={problem._id} className={`${index % 2 === 0 ? 'bg-[#242424]' : 'bg-[#1f1f1f]'} border-t border-[#303030] hover:bg-[#2d2d2d]`}>
                        <td className="px-5 py-4 text-center">
                          {isSolved ? <Check size={18} className="mx-auto text-[#00b85a]" /> : <Circle size={18} className="mx-auto text-[#656565]" />}
                        </td>
                        <td className="px-5 py-4">
                          <NavLink to={`/problem/${problem._id}`} className="font-semibold text-white hover:text-[#ffa116]">
                            {problem.title}
                          </NavLink>
                        </td>
                        <td className={`px-5 py-4 font-semibold capitalize ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</td>
                        <td className="px-5 py-4 text-[#d4d4d4]">{tagLabels[problem.tags] || problem.tags}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Homepage;
