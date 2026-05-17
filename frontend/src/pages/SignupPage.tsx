import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import api from '../api/client';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormData = z.infer<typeof schema>;

const SignupPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/auth/register', data);
      toast.success('Account created successfully. Please sign in.');
      navigate('/login');
    } catch (error) {
      toast.error('Signup failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-3xl font-semibold text-slate-900">Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <label className="block text-sm font-medium text-slate-700">
            Name
            <Input type="text" autoComplete="name" {...register('name')} />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <Input type="email" autoComplete="username" {...register('email')} />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <Input type="password" autoComplete="new-password" {...register('password')} />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </label>
          <Button type="submit" className="w-full justify-center">
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-slate-900 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
