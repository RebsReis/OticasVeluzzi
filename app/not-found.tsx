import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="container-v py-24 text-center">
      <p className="eyebrow">Erro 404</p>
      <h1 className="mt-3 text-h2">Página não encontrada.</h1>
      <p className="mt-3 text-muted">O endereço pode ter mudado ou o produto não está mais disponível.</p>
      <Link href="/" className="btn btn-primary mt-8">Voltar para a loja</Link>
    </div>
  );
}
