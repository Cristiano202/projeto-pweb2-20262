import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProfileHeader } from './ProfileHeader';

const meta = {
  title: 'Perfil/ProfileHeader',
  component: ProfileHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProfileHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComFoto: Story = {
  args: {
    nome: 'Maria Silva',
    curso: { id: 1, nome: 'Sistemas para Internet' },
    telefone: '(83) 99999-9999',
    fotoUrl: 'https://placehold.co/240x240/png',
  },
};

export const SemFoto: Story = {
  args: {
    nome: 'João Souza',
    curso: { id: 2, nome: 'Análise e Desenvolvimento de Sistemas' },
  },
};
