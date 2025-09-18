'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Checkin() {
  const [km,setKm] = useState(0);
  const [file,setFile] = useState(null);

  async function submit(e){
    e.preventDefault();
    const { data:{ user } } = await supabase.auth.getUser();
    if(!user) return alert('Faça login');

    let foto_url = null;
    if(file){
      const name = `${user.id}-${Date.now()}.jpg`;
      const up = await supabase.storage.from(process.env.NEXT_PUBLIC_BUCKET_FOTOS).upload(name, file, { upsert:false });
      if(up.error) return alert(up.error.message);
      const pub = supabase.storage.from(process.env.NEXT_PUBLIC_BUCKET_FOTOS).getPublicUrl(name);
      foto_url = pub.data.publicUrl;
    }

    const { error } = await supabase.from('checkins').insert({
      motorista_user: user.id, km_inicio: km, base_codigo:'SSP27', veiculo_id: 1, foto_url
    });
    if(error) return alert(error.message);
    alert('Check-in feito!'); location.href='/app/checkout';
  }

  return (
    <form onSubmit={submit} className="p-6 space-y-3 max-w-sm mx-auto">
      <h1 className="text-xl font-bold">Check-in</h1>
      <input className="border p-2 w-full" type="number" placeholder="KM início"
        value={km} onChange={e=>setKm(parseInt(e.target.value||'0'))}/>
      <input className="border p-2 w-full" type="file" accept="image/*" capture="environment"
        onChange={e=>setFile(e.target.files?.[0]||null)} />
      <button className="bg-green-600 text-white px-4 py-2 w-full">Enviar</button>
    </form>
  );
}
