'use client';
import Link from 'next/link';
import { useState } from 'react';
import { User, Package, MapPin, Heart, RotateCcw, FileText, Headset, Lock } from 'lucide-react';

const areas = [
  { icon: User, t: 'Dados pessoais' },
  { icon: MapPin, t: 'Endereços' },
  { icon: Package, t: 'Pedidos e entregas' },
  { icon: Heart, t: 'Favoritos', href: '/favoritos' },
  { icon: RotateCcw, t: 'Trocas e devoluções' },
  { icon: FileText, t: 'Minhas receitas' },
  { icon: Headset, t: 'Atendimento', href: '/#atendimento' },
];

export default function AccountPage() {
  const [tab, setTab] = useState<'login' | 'signup' | 'reset'>('login');
  const [sent, setSent] = useState(false);
  return (
    <div className="container-v grid gap-12 pb-[calc(var(--section-spacing)+var(--bottom-nav))] pt-12 lg:grid-cols-[440px_1fr] lg:gap-20">
      <section className="rounded-xl bg-surface p-[var(--card-padding)] shadow-md">
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-full bg-background p-1" role="tablist">
          {(['login', 'signup'] as const).map((k) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => { setTab(k); setSent(false); }} className={`h-11 rounded-full text-sm font-bold ${tab === k ? 'bg-secondary text-white' : ''}`}>{k === 'login' ? 'Entrar' : 'Criar conta'}</button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="grid gap-4">
          {tab === 'signup' && <label className="field"><span>Nome completo</span><input className="input" required autoComplete="name" /></label>}
          <label className="field"><span>E-mail</span><input type="email" className="input" required autoComplete="email" /></label>
          {tab !== 'reset' && <label className="field"><span>Senha</span><input type="password" className="input" required minLength={8} autoComplete={tab === 'login' ? 'current-password' : 'new-password'} /></label>}
          {tab === 'signup' && <label className="flex gap-3 text-sm"><input type="checkbox" required className="mt-1 h-5 w-5 flex-none accent-[#4E5146]" /> Li e aceito os <Link href="/politicas#termos" className="underline">Termos de uso</Link> e a <Link href="/politicas#privacidade" className="underline">Política de privacidade</Link>.</label>}
          <button className="btn btn-primary">{tab === 'login' ? 'Entrar' : tab === 'signup' ? 'Criar conta' : 'Enviar link de recuperação'}</button>
          {tab === 'login' && <button type="button" onClick={() => { setTab('reset'); setSent(false); }} className="text-sm font-semibold underline">Esqueci minha senha</button>}
          {sent && <p role="status" className="rounded-sm bg-primary-light p-3 text-sm">{tab === 'reset' ? 'Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.' : tab === 'signup' ? 'Conta criada! Bem-vindo(a) à Óticas Veluzzi.' : 'Login realizado com sucesso.'}</p>}
        </form>
        <p className="mt-6 flex gap-2 text-xs text-muted"><Lock size={14} className="flex-none" /> Senhas armazenadas com hash e sessões protegidas.</p>
      </section>
      <section>
        <p className="eyebrow">Área do cliente</p>
        <h1 className="mt-3 text-h2">Tudo sobre seus pedidos em um só lugar.</h1>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {areas.map(({ icon: Icon, t, href }) => {
            const inner = <><Icon size={20} className="text-accent" /><span className="font-semibold">{t}</span>{!href && <span className="ml-auto text-xs text-muted">Após login</span>}</>;
            return <li key={t}>{href ? <Link href={href} className="flex min-h-[64px] items-center gap-3 rounded-md border border-line bg-surface px-5 hover:border-accent">{inner}</Link> : <div className="flex min-h-[64px] items-center gap-3 rounded-md border border-line bg-surface px-5 opacity-80">{inner}</div>}</li>;
          })}
        </ul>
      </section>
    </div>
  );
}
