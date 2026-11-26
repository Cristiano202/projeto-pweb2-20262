import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { ProfileAdCard } from './ProfileAdCard';

const meta = {
  title: 'Perfil/ProfileAdCard',
  component: ProfileAdCard,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ maxWidth: 300 }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProfileAdCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Venda: Story = {
  args: {
    anuncio: {
      id: 1,
      titulo: 'Notebook usado',
      modalidade: 'venda',
      preco: 1250,
      estado: 'ativo',
      estadoConservacao: 'seminovo',
      categoria: { id: 1, nome: 'Eletrônicos', slug: 'eletronicos' },
      capaUrl: 'https://placehold.co/600x400/png',
      anunciante: { id: 10, nome: 'Maria Silva' },
      publicadoEm: '2026-11-25T12:00:00',
    },
  },
};

export const RemovidoPeloAdministrador: Story = {
  args: {
    anuncio: {
      id: 2,
      titulo: 'Livro de Engenharia',
      modalidade: 'doacao',
      preco: null,
      estado: 'ativo',
      estadoConservacao: 'usado',
      categoria: { id: 2, nome: 'Livros', slug: 'livros' },
      capaUrl: 'https://placehold.co/600x400/png',
      anunciante: { id: 10, nome: 'Maria Silva' },
      publicadoEm: '2026-11-24T12:00:00',
      motivoRemocao: 'Conteúdo inadequado',
    },
  },
};
