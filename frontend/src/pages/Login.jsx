import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { loginUser } from '../authSlice';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

const loginSchema = z.object({
  emailId: z.string().email('Invalid Email'),
  password: z.string().min(8, 'Password is too weak'),
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => dispatch(loginUser(data));

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] p-6 text-white">
      <div className="w-full max-w-md rounded-lg border border-[#303030] bg-[#242424] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-4 flex h-14 w-14 items-center justify-center">
            <div className="absolute h-10 w-10 rotate-45 rounded-md border-[4px] border-l-[#ffa116] border-t-[#ffa116] border-r-white/80 border-b-white/80" />
            <div className="absolute h-4 w-4 rounded-full bg-[#242424]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Code<span className="text-[#ffa116]">Arena</span></h1>
          <p className="mt-1 text-sm text-[#a3a3a3]">Sign in to continue solving</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-[#703038] bg-[#3a1d24] p-3.5 font-mono text-xs text-rose-200">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#ff375f]" />
            <span>{typeof error === 'string' ? error : error.message || 'Login failed'}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-1.5 block font-mono text-xs font-semibold uppercase text-[#b8b8b8]">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="coder@codearena.com"
                className={`w-full rounded-md border bg-[#1a1a1a] px-3.5 py-2.5 pl-10 font-mono text-sm text-white outline-none transition placeholder:text-[#747474] ${errors.emailId ? 'border-[#ff375f]' : 'border-[#3a3a3a] focus:border-[#ffa116]'}`}
                {...register('emailId')}
              />
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8a8a]" />
            </div>
            {errors.emailId && <span className="mt-1 block font-mono text-xs text-[#ff6b6b]">{errors.emailId.message}</span>}
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-xs font-semibold uppercase text-[#b8b8b8]">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className={`w-full rounded-md border bg-[#1a1a1a] px-3.5 py-2.5 pl-10 pr-10 font-mono text-sm text-white outline-none transition placeholder:text-[#747474] ${errors.password ? 'border-[#ff375f]' : 'border-[#3a3a3a] focus:border-[#ffa116]'}`}
                {...register('password')}
              />
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8a8a]" />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a8a] transition hover:text-white" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="mt-1 block font-mono text-xs text-[#ff6b6b]">{errors.password.message}</span>}
          </div>

          <button type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-[#00b85a] px-4 py-3 font-mono text-sm font-semibold text-white transition hover:bg-[#00a650] disabled:opacity-50" disabled={loading}>
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Signing in...</span>
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 border-t border-[#303030] pt-6 text-center">
          <span className="font-mono text-xs text-[#a3a3a3]">
            New to CodeArena? <NavLink to="/signup" className="font-semibold text-[#ffa116] hover:text-[#ffb84d] hover:underline">Create an Account</NavLink>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
