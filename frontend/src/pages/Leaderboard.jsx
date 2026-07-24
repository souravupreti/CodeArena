import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import TopNav from '../components/TopNav';
import { Award, Flame, Medal, Trophy } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

function Leaderboard() {
  const { user } = useSelector((state) => state.auth);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get('/user/leaderboard');
        setLeaderboard(data || []);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankBadge = (rank) => {
    if (rank <= 3) return <Medal size={22} className={rank === 1 ? 'text-[#ffa116]' : rank === 2 ? 'text-[#cfcfcf]' : 'text-[#cd7f32]'} />;
    return <span className="font-mono text-sm font-bold text-[#a3a3a3]">#{rank}</span>;
  };

  const getCoderTier = (solvedCount) => {
    if (solvedCount >= 15) return { name: 'Grandmaster', color: 'text-[#ff375f]', bg: 'bg-[#3a1d24]' };
    if (solvedCount >= 10) return { name: 'Master', color: 'text-[#ffa116]', bg: 'bg-[#3a301d]' };
    if (solvedCount >= 5) return { name: 'Expert', color: 'text-[#0a84ff]', bg: 'bg-[#172c44]' };
    if (solvedCount >= 2) return { name: 'Specialist', color: 'text-[#00b8a3]', bg: 'bg-[#14332f]' };
    return { name: 'Pupil', color: 'text-[#d4d4d4]', bg: 'bg-[#333333]' };
  };

  return (
    <div className="lc-page">
      <TopNav />

      <main className="mx-auto max-w-6xl px-5 py-8">
        <section className="mb-8 flex flex-col gap-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#3d2a12] px-3 py-1 text-xs font-semibold text-[#ffa116]">
            <Trophy size={14} />
            Global Rankings
          </div>
          <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
          <p className="max-w-2xl text-[#a3a3a3]">Ranked by total accepted problem submissions across CodeArena.</p>
        </section>

        {loading ? (
          <LoadingScreen variant="section" message="Calculating ratings..." />
        ) : leaderboard.length === 0 ? (
          <div className="lc-card flex h-64 flex-col items-center justify-center text-center">
            <Award className="mb-3 h-10 w-10 text-[#656565]" />
            <span className="font-bold text-white">No coders found</span>
            <span className="mt-1 text-sm text-[#8a8a8a]">Start solving problems to be on the leaderboard.</span>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {leaderboard.slice(0, 3).map((coder, index) => {
                const tier = getCoderTier(coder.solvedCount);
                return (
                  <div key={coder._id} className={`lc-card p-6 text-center ${index === 0 ? 'border-[#6f4d19]' : ''}`}>
                    <div className="mb-3 text-xs font-semibold uppercase text-[#8a8a8a]">{index + 1} Place</div>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#333333] text-2xl font-bold text-white">
                      {coder.firstName?.[0]?.toUpperCase()}
                    </div>
                    <h3 className="mt-3 truncate font-bold text-white">{coder.firstName} {coder.lastName}</h3>
                    <p className="truncate text-xs text-[#8a8a8a]">{coder.emailId}</p>
                    <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-bold ${tier.bg} ${tier.color}`}>{tier.name}</span>
                    <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-[#303030] px-4 py-2">
                      <Flame size={15} className="text-[#ffa116]" />
                      <span className="font-bold text-white">{coder.solvedCount} Solved</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lc-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#303030] text-xs uppercase text-[#a3a3a3]">
                    <tr>
                      <th className="w-24 px-5 py-4 text-center">Rank</th>
                      <th className="px-5 py-4">Coder</th>
                      <th className="px-5 py-4">Tier</th>
                      <th className="px-5 py-4 text-center">Solved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((coder, index) => {
                      const rank = index + 1;
                      const isCurrentUser = user?._id === coder._id;
                      const tier = getCoderTier(coder.solvedCount);
                      return (
                        <tr key={coder._id} className={`border-t border-[#303030] hover:bg-[#2a2a2a] ${isCurrentUser ? 'bg-[#2b241b]' : ''}`}>
                          <td className="px-5 py-4 text-center">{getRankBadge(rank)}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#333333] font-bold text-white">{coder.firstName?.[0]?.toUpperCase()}</div>
                              <div>
                                <div className={`font-semibold ${isCurrentUser ? 'text-[#ffa116]' : 'text-white'}`}>{coder.firstName} {coder.lastName} {isCurrentUser && '(You)'}</div>
                                <div className="text-xs text-[#8a8a8a]">{coder.emailId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${tier.bg} ${tier.color}`}>{tier.name}</span></td>
                          <td className="px-5 py-4 text-center font-bold text-white"><span className="inline-flex items-center gap-1.5"><Flame size={15} className="text-[#ffa116]" />{coder.solvedCount}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Leaderboard;
