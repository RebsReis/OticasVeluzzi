export const metadata = { title: 'Políticas e termos' };

const sections = [
  { id: 'privacidade', t: 'Política de privacidade', d: 'Descreve quais dados pessoais são coletados, para quais finalidades, por quanto tempo ficam armazenados e como o titular exerce seus direitos previstos na LGPD — incluindo o tratamento das receitas oftalmológicas como dados sensíveis.' },
  { id: 'trocas', t: 'Política de troca e devolução', d: 'Prazos de arrependimento para compras online, condições para troca de armações e regras específicas para lentes produzidas sob medida.' },
  { id: 'termos', t: 'Termos de uso', d: 'Regras de utilização do site, condições comerciais, formas de pagamento e responsabilidades das partes.' },
];

export default function Policies() {
  return (
    <div className="container-v max-w-3xl pb-[calc(var(--section-spacing)+var(--bottom-nav))] pt-12">
      <h1 className="text-h2">Políticas e termos</h1>
      <p className="mt-4 rounded-sm bg-[#F6EBD3] p-4 text-sm text-warning">Os textos definitivos devem ser redigidos pela empresa (com apoio jurídico) e publicados pelo painel administrativo. Abaixo, o que cada documento deve cobrir.</p>
      {sections.map((s) => (
        <section key={s.id} id={s.id} className="mt-12 scroll-mt-40">
          <h2 className="text-h3">{s.t}</h2>
          <p className="mt-3 max-w-[65ch] text-lg text-muted">{s.d}</p>
        </section>
      ))}
    </div>
  );
}
