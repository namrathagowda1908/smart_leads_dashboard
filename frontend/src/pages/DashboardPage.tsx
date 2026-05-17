import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthState } from '../hooks/useAuth';
import { useLeads } from '../hooks/useLeads';
import { useDebounce } from '../hooks/useDebounce';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import api from '../api/client';

const DashboardPage = () => {
  const { logout, user } = useAuthState();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isFetching, error } = useLeads({
    search: debouncedSearch,
    status: status || undefined,
    source: source || undefined,
    sort: sort === 'oldest' ? 'oldest' : undefined,
    page,
    limit: 10,
  });

  const navigate = useNavigate();
  const payload = data as any;
  const leads = payload?.data?.data ?? [];
  const meta = payload?.data?.meta;

  const welcomeText = useMemo(() => `Welcome back${user ? `, ${user.name}` : ''}!`, [user]);

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (status) params.append('status', status);
      if (source) params.append('source', source);
      if (sort === 'oldest') params.append('sort', 'oldest');

      const response = await api.get(`/leads/export?${params.toString()}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success('Leads exported successfully');
    } catch {
      toast.error('Failed to export leads');
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setSource('');
    setSort('latest');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">{welcomeText}</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate('/dashboard')} className="bg-slate-900">Refresh</Button>
            <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700">Export CSV</Button>
            <Button onClick={() => { logout(); toast.success('Logged out'); }} className="bg-red-600 hover:bg-red-700">Logout</Button>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-6 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700">Search</label>
                <input
                  value={search}
                  onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                  placeholder="Search by name or email..."
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700">Status</label>
                <select
                  value={status}
                  onChange={(event) => { setStatus(event.target.value); setPage(1); }}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700">Source</label>
                <select
                  value={source}
                  onChange={(event) => { setSource(event.target.value); setPage(1); }}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="">All Sources</option>
                  <option value="Website">Website</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Referral">Referral</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700">Sort</label>
                <select
                  value={sort}
                  onChange={(event) => { setSort(event.target.value); setPage(1); }}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>

              <Button onClick={handleClearFilters} className="bg-slate-500 hover:bg-slate-600">Clear</Button>
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Leads</h2>
              <p className="mt-1 text-sm text-slate-500">Manage and review your leads.</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              Failed to load leads. Please try again.
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center">
                      <span className="inline-flex items-center gap-2 text-slate-500"><Spinner /> Loading leads...</span>
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      <div className="space-y-2">
                        <p className="text-lg font-medium">No leads found</p>
                        {(debouncedSearch || status || source) && (
                          <p className="text-sm">Try adjusting your filters</p>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  leads.map((lead: any) => (
                    <tr key={lead._id || lead.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{lead.name}</td>
                      <td className="px-4 py-3 text-slate-600">{lead.email}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          lead.status === 'New' ? 'bg-blue-100 text-blue-700' :
                          lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700' :
                          lead.status === 'Qualified' ? 'bg-green-100 text-green-700' :
                          lead.status === 'Lost' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{lead.source}</td>
                      <td className="px-4 py-3 text-slate-600">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-sm text-slate-500">
              {meta ? `Showing ${leads.length} of ${meta.total} total leads on page ${meta.page}.` : ''}
              {isFetching && !isLoading && <span className="ml-2 inline">Refreshing...</span>}
            </div>

            {meta && meta.totalPages > 1 && (
              <div className="flex gap-2">
                <Button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`rounded px-3 py-1 text-sm font-medium ${
                          pageNum === page
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <Button
                  onClick={() => setPage(page + 1)}
                  disabled={!meta.hasNextPage}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
