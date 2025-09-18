'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Login() {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  async function signIn(e){
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    location.href = '/dashboard';
  }

  return (
    <form onSubmit={signIn} className="p-6 max-w-sm mx-auto space-y-3">
      <h1 className="text-xl font-bold">Entrar</h1>
      <input className="border p-2 w-full" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border p-2 w-full" type="password" placeholder="senha" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="bg-black text-white px-4 py-2 w-full">Entrar</button>
    </form>
  );
}
