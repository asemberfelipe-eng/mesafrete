'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Checkout() {
  const [km,setKm] = useState(0);

  async function submit(e){
    e.preventDefault();
    const { data:{ user } } = await supabase.auth.getUser();
    if(!user) return alert('Faça login');

    const { error } = await supabase.from('checkouts').insert({
      motorista_user: user.id, km_fim: km, base_codigo:'SSP27', veiculo_id: 1
    });
    if(error) return alert(error.message);

    await supabase.rpc('consolidar_dia', { p_user: user.id, p_base: 'SSP27' });
    alert('Checkout feito!'); location.href='/dashboard';
  }

  return (
    <form onSubmit={submit} className="p-6 space-y-3 max-w-sm mx-auto">
      <h1 className="text-xl font-bold">Checkout</h1>
      <input className="border p-2 w-full" type="number" placeholder="KM fim"
        value={km} onChange={e=>setKm(parseInt(e.target.value||'0'))}/>
      <button className="bg-blue-600 text-white px-4 py-2 w-full">Finalizar</button>
    </form>
  );
}
