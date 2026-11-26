import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { AnuncioCard } from './AnuncioCard';

const anuncio = {
  id: 1,
  titulo: 'Notebook Lenovo ThinkPad usado',
  modalidade: 'venda' as const,
  preco: 2450,
  estado: 'ativo' as const,
  estadoConservacao: 'seminovo' as const,
  categoria: { id: 1, nome: 'Eletrônicos', slug: 'eletronicos' },
  capaUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
  anunciante: { id: 1, nome: 'Maria Silva' },
  publicadoEm: '2026-11-25T12:00:00',
};

const meta = {
  title: 'Anúncios/AnuncioCard',
  component: AnuncioCard,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ width: '280px' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: { anuncio },
} satisfies Meta<typeof AnuncioCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Venda: Story = {};

export const Doacao: Story = {
  args: {
    anuncio: {
      ...anuncio,
      titulo: 'Mesa de estudo para doação',
      modalidade: 'doacao',
      preco: null,
      estadoConservacao: 'usado',
      categoria: { id: 2, nome: 'Móveis', slug: 'moveis' },
      capaUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800',
    },
  },
};

export const ComAnunciante: Story = {
  args: { mostrarAnunciante: true },
};

export const SemImagem: Story = {
  args: { anuncio: { ...anuncio, capaUrl: '' } },
};
