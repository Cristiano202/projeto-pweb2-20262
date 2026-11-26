import type { Meta, StoryObj } from '@storybook/react-vite';
import { AnuncioStateControl } from './AnuncioStateControl';

const meta = {
  title: 'Anúncios/AnuncioStateControl',
  component: AnuncioStateControl,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AnuncioStateControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VendaAtiva: Story = {
  args: {
    modalidade: 'venda',
    estadoAtual: 'ativo',
    onChange: () => {},
  },
};

export const DoacaoConcluida: Story = {
  args: {
    modalidade: 'doacao',
    estadoAtual: 'concluido',
    onChange: () => {},
  },
};
