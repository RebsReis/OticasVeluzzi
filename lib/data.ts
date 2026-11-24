/**
 * DADOS DEMONSTRATIVOS — Óticas Veluzzi
 * ------------------------------------------------------------------
 * Tudo neste arquivo é provisório e serve apenas para o protótipo visual.
 * Produtos, coleções, preços, condições comerciais e contatos NÃO são
 * informações reais da empresa. Na Fase 2 estes dados passam a vir da API
 * (FastAPI + PostgreSQL) e são editados pelo painel administrativo.
 */

export type FrameShape = 'redondo' | 'quadrado' | 'gatinho' | 'aviador' | 'retangular' | 'hexagonal';
export type Category = 'grau' | 'sol';
export type Gender = 'feminino' | 'masculino' | 'unissex';

export type ColorVariant = { name: string; frame: string; lens: string };

export type Product = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  collection: string; // exibido como "marca" até haver marcas cadastradas
  category: Category;
  gender: Gender;
  kids?: boolean;
  shape: FrameShape;
  material: 'Acetato' | 'Metal' | 'Titânio' | 'TR90';
  lensType: string;
  size: 'P' | 'M' | 'G';
  measures: { lens: number; bridge: number; temple: number; height: number };
  price: number;
  salePrice?: number;
  colors: ColorVariant[];
  stock: number;
  isNew?: boolean;
  sold: number;
  lensCompatible: boolean;
  description: string;
  /** Fotografias do produto (a 1ª é a principal; a 2ª aparece no hover). Sem fotos → ilustração provisória. */
  images?: string[];
};

export const storeSettings = {
  isDemo: true,
  maxInstallments: 10,
  minInstallment: 30,
  pixDiscount: 0.05,
  freeShippingFrom: 299,
  whatsapp: '', // configurar no painel — ex.: 5511999999999
  topbar: [
    'Frete grátis acima de R$ 299',
    'Até 10x sem juros no cartão',
    '5% de desconto no Pix',
    'Atendimento especializado de seg. a sáb.',
  ],
};

export const collections = [
  { slug: 'essencial', name: 'Coleção Essencial', note: 'Linhas atemporais para o dia a dia' },
  { slug: 'atelier', name: 'Coleção Atelier', note: 'Acetatos encorpados e acabamento à mão' },
  { slug: 'solar', name: 'Coleção Solar', note: 'Proteção UV400 com desenho editorial' },
  { slug: 'leve', name: 'Coleção Leve', note: 'Metal e titânio ultraleves' },
  { slug: 'mini', name: 'Coleção Mini', note: 'Armações resistentes para crianças' },
];

export type MenuCategory = {
  slug: string;
  label: string;
  groups: { title: string; links: { label: string; href: string }[] }[];
  promo?: { title: string; href: string };
};

const c = (q: string) => `/categoria/todos?${q}`;

export const menu: MenuCategory[] = [
  {
    slug: 'oculos-de-grau', label: 'Óculos de grau',
    groups: [
      { title: 'Formatos', links: [{ label: 'Redondo', href: c('cat=grau&shape=redondo') }, { label: 'Quadrado', href: c('cat=grau&shape=quadrado') }, { label: 'Gatinho', href: c('cat=grau&shape=gatinho') }, { label: 'Retangular', href: c('cat=grau&shape=retangular') }] },
      { title: 'Materiais', links: [{ label: 'Acetato', href: c('cat=grau&material=Acetato') }, { label: 'Metal', href: c('cat=grau&material=Metal') }, { label: 'Titânio', href: c('cat=grau&material=Titânio') }] },
      { title: 'Para quem', links: [{ label: 'Feminino', href: c('cat=grau&gender=feminino') }, { label: 'Masculino', href: c('cat=grau&gender=masculino') }, { label: 'Infantil', href: '/categoria/infantil' }] },
    ],
    promo: { title: 'Monte seus óculos com lentes de grau', href: '/categoria/oculos-de-grau' },
  },
  {
    slug: 'oculos-de-sol', label: 'Óculos de sol',
    groups: [
      { title: 'Formatos', links: [{ label: 'Aviador', href: c('cat=sol&shape=aviador') }, { label: 'Gatinho', href: c('cat=sol&shape=gatinho') }, { label: 'Quadrado', href: c('cat=sol&shape=quadrado') }, { label: 'Hexagonal', href: c('cat=sol&shape=hexagonal') }] },
      { title: 'Lentes', links: [{ label: 'Polarizadas', href: c('cat=sol&lens=Polarizada') }, { label: 'Degradê', href: c('cat=sol&lens=Degradê') }, { label: 'Espelhadas', href: c('cat=sol&lens=Espelhada') }] },
      { title: 'Para quem', links: [{ label: 'Feminino', href: c('cat=sol&gender=feminino') }, { label: 'Masculino', href: c('cat=sol&gender=masculino') }] },
    ],
    promo: { title: 'Coleção Solar: proteção UV400', href: '/categoria/oculos-de-sol' },
  },
  { slug: 'feminino', label: 'Feminino', groups: [{ title: 'Feminino', links: [{ label: 'Óculos de grau', href: c('cat=grau&gender=feminino') }, { label: 'Óculos de sol', href: c('cat=sol&gender=feminino') }, { label: 'Formato gatinho', href: c('gender=feminino&shape=gatinho') }] }] },
  { slug: 'masculino', label: 'Masculino', groups: [{ title: 'Masculino', links: [{ label: 'Óculos de grau', href: c('cat=grau&gender=masculino') }, { label: 'Óculos de sol', href: c('cat=sol&gender=masculino') }, { label: 'Formato aviador', href: c('gender=masculino&shape=aviador') }] }] },
  { slug: 'infantil', label: 'Infantil', groups: [{ title: 'Infantil', links: [{ label: 'Coleção Mini', href: '/categoria/infantil' }, { label: 'Armações flexíveis (TR90)', href: c('material=TR90') }] }] },
  { slug: 'lentes', label: 'Lentes', groups: [{ title: 'Tipos de lente', links: [{ label: 'Visão simples', href: '/categoria/lentes' }, { label: 'Multifocal', href: '/categoria/lentes' }, { label: 'Leitura', href: '/categoria/lentes' }] }, { title: 'Tratamentos', links: [{ label: 'Antirreflexo', href: '/categoria/lentes' }, { label: 'Filtro de luz azul', href: '/categoria/lentes' }, { label: 'Fotossensível', href: '/categoria/lentes' }] }] },
  { slug: 'marcas', label: 'Marcas', groups: [{ title: 'Coleções', links: collections.map((col) => ({ label: col.name, href: c(`collection=${encodeURIComponent(col.name)}`) })) }] },
  { slug: 'acessorios', label: 'Acessórios', groups: [{ title: 'Acessórios', links: [{ label: 'Estojos', href: '/categoria/acessorios' }, { label: 'Cordões', href: '/categoria/acessorios' }, { label: 'Kits de limpeza', href: '/categoria/acessorios' }] }] },
  { slug: 'lancamentos', label: 'Lançamentos', groups: [{ title: 'Lançamentos', links: [{ label: 'Todos os lançamentos', href: '/categoria/lancamentos' }] }] },
  { slug: 'ofertas', label: 'Ofertas', groups: [{ title: 'Ofertas', links: [{ label: 'Todas as ofertas', href: '/categoria/ofertas' }] }] },
];

const p = (x: Omit<Product, 'id' | 'sku'> & { n: number }): Product => ({ ...x, id: String(x.n), sku: `VLZ-${String(1000 + x.n)}` });

const desc = {
  grau: 'Armação pensada para o uso diário, com equilíbrio entre leveza e presença. Plaquetas ajustáveis e hastes com ponteiras confortáveis acompanham horas de uso sem pressão atrás das orelhas.',
  sol: 'Óculos de sol com lentes de proteção UV400 e desenho editorial. A armação acompanha o rosto com firmeza e o acabamento valoriza cada detalhe sob a luz natural.',
};

export const products: Product[] = [
  p({ n: 1, slug: 'classic-black', name: 'Classic Black', collection: 'Coleção Essencial', category: 'grau', gender: 'unissex', shape: 'retangular', material: 'Acetato', lensType: 'Lente demonstrativa', size: 'M', measures: { lens: 52, bridge: 18, temple: 145, height: 42 }, price: 489, colors: [{ name: 'Preto fosco', frame: '#1E2230', lens: '#E9EEF0' }], stock: 12, sold: 340, lensCompatible: true, images: ['/products/classic-black-1.webp'], description: desc.grau }),
  p({ n: 2, slug: 'urban-brown', name: 'Urban Brown', collection: 'Coleção Solar', category: 'sol', gender: 'masculino', shape: 'aviador', material: 'Metal', lensType: 'Polarizada', size: 'G', measures: { lens: 58, bridge: 14, temple: 140, height: 50 }, price: 629, salePrice: 529, colors: [{ name: 'Dourado / Marrom', frame: '#B8913F', lens: '#5A3B22' }, { name: 'Grafite / Verde', frame: '#4A4C47', lens: '#3D4A37' }], stock: 6, sold: 280, lensCompatible: false, description: desc.sol }),
  p({ n: 3, slug: 'giulia', name: 'Giulia', collection: 'Coleção Atelier', category: 'grau', gender: 'feminino', shape: 'gatinho', material: 'Acetato', lensType: 'Lente demonstrativa', size: 'M', measures: { lens: 53, bridge: 17, temple: 140, height: 41 }, price: 559, colors: [{ name: 'Azul e rosa', frame: '#2F4A8A', lens: '#F1D9DC' }], stock: 9, isNew: true, sold: 120, lensCompatible: true, images: ['/products/giulia-1.webp'], description: desc.grau }),
  p({ n: 4, slug: 'riviera', name: 'Riviera', collection: 'Coleção Solar', category: 'sol', gender: 'feminino', shape: 'redondo', material: 'Acetato', lensType: 'Degradê', size: 'M', measures: { lens: 55, bridge: 18, temple: 145, height: 46 }, price: 589, colors: [{ name: 'Caramelo', frame: '#A0603A', lens: '#5B2A2A' }], stock: 14, isNew: true, sold: 210, lensCompatible: false, images: ['/products/riviera-1.webp'], description: desc.sol }),
  p({ n: 5, slug: 'lorenzo', name: 'Lorenzo', collection: 'Coleção Leve', category: 'grau', gender: 'masculino', shape: 'retangular', material: 'Titânio', lensType: 'Lente demonstrativa', size: 'G', measures: { lens: 55, bridge: 18, temple: 145, height: 38 }, price: 799, salePrice: 679, colors: [{ name: 'Grafite', frame: '#3F423B', lens: '#ECEFF0' }, { name: 'Prata', frame: '#A9ABA6', lens: '#ECEFF0' }], stock: 4, sold: 190, lensCompatible: true, description: desc.grau }),
  p({ n: 6, slug: 'aurora', name: 'Aurora', collection: 'Coleção Leve', category: 'grau', gender: 'feminino', shape: 'redondo', material: 'Metal', lensType: 'Lente demonstrativa', size: 'P', measures: { lens: 48, bridge: 20, temple: 140, height: 44 }, price: 449, colors: [{ name: 'Dourado', frame: '#B8913F', lens: '#ECEFF0' }, { name: 'Rosé', frame: '#B88A7A', lens: '#ECEFF0' }], stock: 18, sold: 260, lensCompatible: true, description: desc.grau }),
  p({ n: 7, slug: 'marco', name: 'Marco', collection: 'Coleção Essencial', category: 'grau', gender: 'masculino', shape: 'quadrado', material: 'Acetato', lensType: 'Lente demonstrativa', size: 'G', measures: { lens: 54, bridge: 19, temple: 145, height: 44 }, price: 469, salePrice: 399, colors: [{ name: 'Oliva', frame: '#4E5146', lens: '#ECEFF0' }, { name: 'Preto', frame: '#1E1F1C', lens: '#ECEFF0' }], stock: 10, sold: 310, lensCompatible: true, description: desc.grau }),
  p({ n: 8, slug: 'capri', name: 'Capri', collection: 'Coleção Solar', category: 'sol', gender: 'unissex', shape: 'redondo', material: 'Acetato', lensType: 'Degradê', size: 'M', measures: { lens: 51, bridge: 21, temple: 145, height: 49 }, price: 549, colors: [{ name: 'Marrom e dourado', frame: '#5C4636', lens: '#6B5A48' }], stock: 0, sold: 150, lensCompatible: false, images: ['/products/capri-1.webp'], description: desc.sol }),
  p({ n: 9, slug: 'helena', name: 'Helena', collection: 'Coleção Atelier', category: 'sol', gender: 'feminino', shape: 'hexagonal', material: 'Metal', lensType: 'Degradê', size: 'M', measures: { lens: 54, bridge: 19, temple: 140, height: 48 }, price: 659, salePrice: 559, colors: [{ name: 'Dourado / Verde', frame: '#B8913F', lens: '#4D5A45' }], stock: 7, sold: 95, lensCompatible: false, description: desc.sol }),
  p({ n: 10, slug: 'theo', name: 'Theo', collection: 'Coleção Mini', category: 'grau', gender: 'unissex', kids: true, shape: 'redondo', material: 'TR90', lensType: 'Lente demonstrativa', size: 'P', measures: { lens: 44, bridge: 16, temple: 125, height: 38 }, price: 329, colors: [{ name: 'Azul', frame: '#3F5D78', lens: '#ECEFF0' }, { name: 'Verde', frame: '#5E7A55', lens: '#ECEFF0' }], stock: 15, isNew: true, sold: 70, lensCompatible: true, description: 'Armação infantil em TR90, material flexível e resistente a quedas. Hastes com ponteiras emborrachadas mantêm os óculos firmes durante brincadeiras.' }),
  p({ n: 11, slug: 'luna', name: 'Luna', collection: 'Coleção Mini', category: 'grau', gender: 'feminino', kids: true, shape: 'gatinho', material: 'TR90', lensType: 'Lente demonstrativa', size: 'P', measures: { lens: 45, bridge: 15, temple: 125, height: 36 }, price: 329, colors: [{ name: 'Lilás', frame: '#8E7A9E', lens: '#ECEFF0' }, { name: 'Rosa', frame: '#C98E92', lens: '#ECEFF0' }], stock: 11, sold: 64, lensCompatible: true, description: 'Armação infantil em TR90, leve e flexível, com formato gatinho suave e ponteiras confortáveis.' }),
  p({ n: 12, slug: 'verona', name: 'Verona', collection: 'Coleção Atelier', category: 'grau', gender: 'unissex', shape: 'redondo', material: 'Acetato', lensType: 'Lente demonstrativa', size: 'M', measures: { lens: 49, bridge: 21, temple: 145, height: 45 }, price: 619, colors: [{ name: 'Champagne', frame: '#B89A65', lens: '#ECEFF0' }, { name: 'Cristal', frame: '#D9D6CC', lens: '#ECEFF0' }], stock: 8, isNew: true, sold: 88, lensCompatible: true, description: desc.grau }),
  p({ n: 13, slug: 'enzo', name: 'Enzo', collection: 'Coleção Solar', category: 'sol', gender: 'unissex', shape: 'quadrado', material: 'Acetato', lensType: 'Degradê', size: 'G', measures: { lens: 56, bridge: 18, temple: 145, height: 47 }, price: 599, colors: [{ name: 'Marrom translúcido', frame: '#5A3B26', lens: '#C79A6B' }], stock: 13, sold: 230, lensCompatible: false, images: ['/products/enzo-1.webp'], description: desc.sol }),
  p({ n: 14, slug: 'bianca', name: 'Bianca', collection: 'Coleção Essencial', category: 'grau', gender: 'feminino', shape: 'gatinho', material: 'Acetato', lensType: 'Lente demonstrativa', size: 'M', measures: { lens: 52, bridge: 17, temple: 140, height: 38 }, price: 429, salePrice: 369, colors: [{ name: 'Preto', frame: '#1E1F1C', lens: '#ECEFF0' }], stock: 16, sold: 205, lensCompatible: true, images: ['/products/bianca-1.webp', '/products/bianca-2.webp'], description: desc.grau }),
  p({ n: 15, slug: 'milano', name: 'Milano', collection: 'Coleção Solar', category: 'sol', gender: 'unissex', shape: 'redondo', material: 'Acetato', lensType: 'Polarizada', size: 'M', measures: { lens: 57, bridge: 15, temple: 140, height: 49 }, price: 889, colors: [{ name: 'Preto fosco', frame: '#1E1F1C', lens: '#55575A' }], stock: 3, isNew: true, sold: 40, lensCompatible: false, images: ['/products/milano-1.webp'], description: desc.sol }),
  p({ n: 16, slug: 'dante', name: 'Dante', collection: 'Coleção Atelier', category: 'grau', gender: 'masculino', shape: 'hexagonal', material: 'Metal', lensType: 'Lente demonstrativa', size: 'M', measures: { lens: 51, bridge: 20, temple: 145, height: 43 }, price: 579, colors: [{ name: 'Ouro velho', frame: '#9C7F45', lens: '#ECEFF0' }, { name: 'Grafite', frame: '#3F423B', lens: '#ECEFF0' }], stock: 5, sold: 110, lensCompatible: true, description: desc.grau }),
];

export const accessories = [
  { slug: 'estojo-couro', name: 'Estojo rígido', price: 89 },
  { slug: 'kit-limpeza', name: 'Kit de limpeza', price: 49 },
  { slug: 'cordao', name: 'Cordão de corrente', price: 69 },
];

/* ---------- Personalização de lentes (valores demonstrativos) ---------- */
export const lensTypes = [
  { id: 'frame-only', name: 'Somente armação', desc: 'Leve apenas a armação e faça as lentes depois.', price: 0, needsPrescription: false },
  { id: 'plano', name: 'Lente sem grau', desc: 'Para quem usa óculos como acessório ou proteção de tela.', price: 120, needsPrescription: false },
  { id: 'simples', name: 'Visão simples', desc: 'Corrige miopia, hipermetropia ou astigmatismo em uma distância.', price: 260, needsPrescription: true },
  { id: 'multifocal', name: 'Multifocal', desc: 'Visão nítida para longe, intermediário e perto em uma só lente.', price: 890, needsPrescription: true },
  { id: 'leitura', name: 'Lente para leitura', desc: 'Foco confortável para leitura e distâncias curtas.', price: 220, needsPrescription: true },
];

export const treatments = [
  { id: 'ar', name: 'Antirreflexo', desc: 'Reduz reflexos e melhora a nitidez.', price: 140 },
  { id: 'foto', name: 'Fotossensível', desc: 'Escurece sob o sol e clareia em ambientes internos.', price: 320 },
  { id: 'uv', name: 'Proteção UV', desc: 'Bloqueia os raios UVA e UVB.', price: 60 },
  { id: 'blue', name: 'Filtro de luz azul', desc: 'Mais conforto diante de telas.', price: 180 },
];

/* ---------- Helpers ---------- */
export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const finalPrice = (prod: Product) => prod.salePrice ?? prod.price;
export function installments(total: number) {
  const n = Math.max(1, Math.min(storeSettings.maxInstallments, Math.floor(total / storeSettings.minInstallment)));
  return { n, value: total / n };
}
export const discountPct = (prod: Product) => (prod.salePrice ? Math.round((1 - prod.salePrice / prod.price) * 100) : 0);
export const getProduct = (slug: string) => products.find((x) => x.slug === slug);

export const pageCategories: Record<string, { title: string; intro: string; filter: (x: Product) => boolean }> = {
  todos: { title: 'Todos os óculos', intro: 'Armações de grau e óculos de sol selecionados pela Veluzzi.', filter: () => true },
  'oculos-de-grau': { title: 'Óculos de grau', intro: 'Armações que unem conforto visual e personalidade. Escolha a armação e personalize as lentes.', filter: (x) => x.category === 'grau' && !x.kids },
  'oculos-de-sol': { title: 'Óculos de sol', intro: 'Proteção UV400 com desenho editorial para os dias de luz.', filter: (x) => x.category === 'sol' },
  feminino: { title: 'Feminino', intro: 'Formatos delicados e marcantes para todos os estilos.', filter: (x) => x.gender === 'feminino' && !x.kids },
  masculino: { title: 'Masculino', intro: 'Linhas firmes, materiais nobres e acabamento preciso.', filter: (x) => x.gender === 'masculino' },
  infantil: { title: 'Infantil', intro: 'Armações flexíveis e resistentes para acompanhar cada fase.', filter: (x) => !!x.kids },
  lentes: { title: 'Armações para lentes de grau', intro: 'Escolha a armação e personalize lentes e tratamentos em poucos passos.', filter: (x) => x.lensCompatible },
  marcas: { title: 'Coleções', intro: 'Navegue pelas coleções do catálogo.', filter: () => true },
  acessorios: { title: 'Acessórios', intro: 'Estojos, cordões e itens de cuidado para seus óculos.', filter: () => false },
  lancamentos: { title: 'Lançamentos', intro: 'As novidades que acabaram de chegar.', filter: (x) => !!x.isNew },
  ofertas: { title: 'Ofertas', intro: 'Modelos selecionados com condições especiais.', filter: (x) => !!x.salePrice },
};
