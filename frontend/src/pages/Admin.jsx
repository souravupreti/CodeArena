import { Plus, Trash2, Video, ArrowLeft } from 'lucide-react';
import { NavLink } from 'react-router';

function Admin() {
  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem with test cases, templates, and reference solutions.',
      icon: Plus,
      route: '/admin/create',
      tone: 'text-[#00b85a] bg-[#14332f]',
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove stale or incorrect problems from the platform database.',
      icon: Trash2,
      route: '/admin/delete',
      tone: 'text-[#ff6b6b] bg-[#3a1d24]',
    },
    {
      id: 'video',
      title: 'Video Solutions',
      description: 'Upload and manage Cloudinary video editorials for problem walkthroughs.',
      icon: Video,
      route: '/admin/video',
      tone: 'text-[#ffa116] bg-[#3d2a12]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between border-b border-[#303030] pb-5">
          <div className="flex items-center gap-3">
            <NavLink to="/" className="rounded-md bg-[#303030] p-2 text-[#b8b8b8] transition hover:bg-[#3a3a3a] hover:text-white">
              <ArrowLeft size={18} />
            </NavLink>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin <span className="text-[#ffa116]">Panel</span></h1>
              <p className="mt-1 text-sm text-[#a3a3a3]">Manage problem sets, video editorials, and database content.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div key={option.id} className="lc-card flex min-h-64 flex-col justify-between p-6 transition hover:border-[#4a4a4a]">
                <div>
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-lg ${option.tone}`}>
                    <IconComponent size={24} />
                  </div>
                  <h2 className="mb-2 text-lg font-bold text-white">{option.title}</h2>
                  <p className="text-sm leading-6 text-[#a3a3a3]">{option.description}</p>
                </div>
                <NavLink to={option.route} className="lc-btn lc-btn-muted mt-7 w-full">
                  Open Control
                </NavLink>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Admin;
