import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
      description: 'Variante visual do botão',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamanho do botão',
    },
    loading: {
      control: 'boolean',
      description: 'Exibe spinner de carregamento e desabilita cliques',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Ocupa 100% da largura do contêiner',
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o botão',
    },
    children: {
      control: 'text',
      description: 'Conteúdo interno do botão',
    },
  },
  args: {
    children: 'Clique aqui',
    variant: 'primary',
    size: 'md',
    loading: false,
    fullWidth: false,
    disabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Botão Primário',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Botão Secundário',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Botão Perigo / Excluir',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Salvando...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Desabilitado',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Botão Pequeno',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Botão Grande',
  },
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  args: {
    fullWidth: true,
    children: 'Botão Largura Total',
  },
};
