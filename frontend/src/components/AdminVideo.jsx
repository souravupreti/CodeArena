import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { NavLink } from 'react-router';
import { ArrowLeft, Upload, Trash2 } from 'lucide-react';

const AdminVideo = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete the video for this problem?')) return;
    
    try {
      await axiosClient.delete(`/video/delete/${id}`);
      alert('Video solution removed');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete video');
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#f8f9fa] font-mono text-xs text-gray-500">
        <div className="w-7 h-7 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-3"></div>
        <span>LOADING PROBLEMS...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] p-6 font-mono">
        <div className="max-w-4xl mx-auto p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 font-sans p-6 selection:bg-orange-100 selection:text-orange-600">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <NavLink to="/admin" className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
              <ArrowLeft size={16} />
            </NavLink>
            <div>
              <h1 className="text-2xl font-bold font-mono text-gray-900">
                VIDEO <span className="text-[#FFA116]">EDITORIALS</span>
              </h1>
              <p className="text-xs text-gray-500 font-mono">Upload or delete Cloudinary solution video streams</p>
            </div>
          </div>
        </div>

        {/* Problems List Table */}
        <div className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80 font-mono text-[11px] text-gray-500 font-semibold uppercase">
                  <th className="py-3.5 px-5 w-12 text-center">#</th>
                  <th className="py-3.5 px-5">TITLE</th>
                  <th className="py-3.5 px-5 w-32 text-center">DIFFICULTY</th>
                  <th className="py-3.5 px-5 w-32">TAGS</th>
                  <th className="py-3.5 px-5 w-44 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {problems.map((problem, index) => (
                  <tr key={problem._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-5 text-center font-mono font-bold text-gray-400">{index + 1}</td>
                    <td className="py-3.5 px-5 font-semibold text-gray-900">{problem.title}</td>
                    <td className="py-3.5 px-5 text-center font-mono">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border uppercase ${
                        problem.difficulty === 'easy' ? 'text-[#00B8A3] bg-emerald-50 border-emerald-200' :
                        problem.difficulty === 'medium' ? 'text-[#FFC01E] bg-amber-50 border-amber-200' :
                        'text-[#FF375F] bg-rose-50 border-rose-200'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-xs text-gray-600">
                      <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200">{problem.tags}</span>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <div className="flex items-center justify-center gap-2 font-mono text-xs">
                        <NavLink 
                          to={`/admin/upload/${problem._id}`}
                          className="px-3 py-1 rounded-md bg-gray-900 hover:bg-black text-white font-semibold shadow-2xs transition-all inline-flex items-center gap-1"
                        >
                          <Upload size={13} />
                          Upload
                        </NavLink>
                        <button 
                          onClick={() => handleDelete(problem._id)}
                          className="px-3 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-semibold transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminVideo;