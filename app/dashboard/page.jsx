'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Dashboard(){
  const [dias,setDias] = useState([]);
  const [checkins,setCheckins] = useState(0);
  const [tickets,setTickets] = useState(0);
  const hoje = new Date().toISOString().slice(0,10);

  useEffect(()=>{ (async()=>{
    const u = (await supabase.auth.getUser()).data.user;
    if(!u){ location.href='/login'; return; }

    const { data: d } = await supabase.from('dias').select('*').eq('data',hoje).eq('base_codigo','SSP27');
    setDias(d||[]);

    const { count: cks } = await supabase.from('checkins').select('id', { count:'exact', head:true }).eq('data',hoje).eq('base_codigo','SSP27');
    setCheckins(cks||0);

    const { count: t } = await supabase.from('manutencoes').select('id', { count:'exact', head:true }).neq('status','fechado');
    setTickets(t||0);
  })(); },[]);

  const custoDia = useMemo(()=> (dias||[]).reduce((s,d)=>s+(d.valor_pago||0),0),[dias]);
  const kmTotal  = useMemo(()=> (dias||[]).reduce((s,d)=>s+(d.km_total||0),0),[dias]);

  function exportCSV(){
    const rows = [['data','motorista_user','km_total','valor_pago','completo']];
    (dias||[]).forEach(d=>rows.push([d.data,d.motorista_user,String(d.km_total||0),String(d.valor_pago||0),String(d.completo)]));
    const csv = rows.map(r=>r.join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=`dias_${hoje}_SSP27.csv`; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard — {hoje}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card title="Ativos hoje" value={dias.length || checkins}/>
        <Card title="Custo do dia (R$)" value={custoDia.toFixed(2)}/>
        <Card title="KM total" value={kmTotal}/>
      </div>
      <button onClick={exportCSV} className="bg-black text-white px-4 py-2 rounded">Exportar CSV</button>
      <div className="flex gap-3">
        <a className="underline" href="/app/checkin">Check-in</a>
        <a className="underline" href="/app/checkout">Checkout</a>
        <a className="underline" href="/login" onClick={async(e)=>{e.preventDefault(); await supabase.auth.signOut(); location.href='/login';}}>Sair</a>
      </div>
    </div>
  );
}

function Card({title,value}) {
  return <div className="border rounded p-4"><div className="text-sm text-gray-600">{title}</div><div className="text-2xl font-bold">{value}</div></div>;
}
