import type { Meta, StoryObj } from '@storybook/react-vite';
import { AnuncioForm } from './AnuncioForm';

const meta = {
  title: 'Anúncios/AnuncioForm',
  component: AnuncioForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AnuncioForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const categorias = [
  { id: 1, nome: 'Eletrônicos', slug: 'eletronicos' },
  { id: 2, nome: 'Livros', slug: 'livros' },
];

export const CriarVenda: Story = {
  args: {
    categorias,
    onSubmit: () => {},
  },
};

export const CriarDoacao: Story = {
  args: {
    categorias,
    initialModalidade: 'doacao',
    onSubmit: () => {},
  },
  render: (args) => <AnuncioForm {...args} />,
};
