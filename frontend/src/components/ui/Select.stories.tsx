import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const options = [
  { value: 'eletronicos', label: 'Eletrônicos' },
  { value: 'livros', label: 'Livros' },
  { value: 'moveis', label: 'Móveis' },
];

const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    label: 'Categoria',
    options,
    placeholder: 'Selecione uma categoria',
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Preenchido: Story = {
  args: { defaultValue: 'livros' },
};

export const ComErro: Story = {
  args: { error: 'Selecione uma categoria válida.' },
};

export const ComTextoAuxiliar: Story = {
  args: { helperText: 'Escolha a categoria que melhor descreve o anúncio.' },
};

export const Desabilitado: Story = {
  args: { disabled: true, placeholder: 'Nenhuma opção disponível' },
};
