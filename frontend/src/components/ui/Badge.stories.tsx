import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Badge,
  BadgeEstado,
  BadgeModalidade,
  BadgeConservacao,
} from './Badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'info', 'danger', 'neutral', 'primary'],
      description: 'Estilo visual e cor de fundo do badge',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Tamanho da tag/pílula',
    },
    children: {
      control: 'text',
      description: 'Texto exibido dentro do badge',
    },
  },
  args: {
    children: 'Etiqueta',
    variant: 'neutral',
    size: 'sm',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Padrão',
    variant: 'neutral',
  },
};

export const Success: Story = {
  args: {
    children: 'Ativo / Disponível',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'Pausado',
    variant: 'warning',
  },
};

export const Info: Story = {
  args: {
    children: 'Reservado',
    variant: 'info',
  },
};

export const Danger: Story = {
  args: {
    children: 'Removido',
    variant: 'danger',
  },
};

export const Primary: Story = {
  args: {
    children: 'Venda',
    variant: 'primary',
  },
};

export const MediumSize: Story = {
  args: {
    children: 'Badge Médio',
    size: 'md',
    variant: 'info',
  },
};

/**
 * Demonstração dos estados oficiais de anúncios exigidos no RF03
 */
export const TodosEstadosAnuncio: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <BadgeEstado estado="ativo" />
      <BadgeEstado estado="pausado" />
      <BadgeEstado estado="reservado" />
      <BadgeEstado estado="vendido" />
      <BadgeEstado estado="concluido" />
    </div>
  ),
};

/**
 * Demonstração das modalidades (Venda e Doação)
 */
export const Modalidades: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <BadgeModalidade modalidade="venda" />
      <BadgeModalidade modalidade="doacao" />
    </div>
  ),
};

/**
 * Demonstração dos estados de conservação
 */
export const EstadosConservacao: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <BadgeConservacao conservacao="novo" />
      <BadgeConservacao conservacao="seminovo" />
      <BadgeConservacao conservacao="usado" />
    </div>
  ),
};
