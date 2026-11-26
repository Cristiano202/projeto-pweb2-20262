import type { Meta, StoryObj } from '@storybook/react-vite';
import { AnuncioGallery } from './AnuncioGallery';

const meta = {
  title: 'Anúncios/AnuncioGallery',
  component: AnuncioGallery,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AnuncioGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GaleriaComVariasFotos: Story = {
  args: {
    titulo: 'Fone de ouvido Bluetooth',
    capaUrl: 'https://placehold.co/800x600/png?text=Capa',
    fotos: [
      { id: 1, url: 'https://placehold.co/800x600/png?text=Capa', capa: true },
      { id: 2, url: 'https://placehold.co/800x600/png?text=Foto+2', capa: false },
      { id: 3, url: 'https://placehold.co/800x600/png?text=Foto+3', capa: false },
    ],
  },
};

export const FotoUnica: Story = {
  args: {
    titulo: 'Livro de cálculo',
    capaUrl: 'https://placehold.co/800x600/png?text=Livro',
    fotos: [{ id: 1, url: 'https://placehold.co/800x600/png?text=Livro', capa: true }],
  },
};
