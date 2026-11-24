import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Modal, type ModalProps } from './Modal';
import { Button } from './Button';

const meta = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controla a visibilidade do modal',
    },
    title: {
      control: 'text',
      description: 'Título exibido no cabeçalho do modal',
    },
    size: {
      control: 'select',
      options: ['md', 'lg'],
      description: 'Largura do modal',
    },
  },
  args: {
    open: true,
    title: 'Exemplo de Modal',
    onClose: () => {},
    children: 'Conteúdo do modal',
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper interativo para abrir/fechar o modal na story
function ModalDemo(props: Partial<ModalProps>) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <Button onClick={() => setOpen(true)}>Abrir Modal</Button>
      <Modal
        open={open}
        title={props.title || 'Título do Modal'}
        size={props.size || 'md'}
        onClose={() => setOpen(false)}
        footer={
          props.footer ?? (
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Confirmar
              </Button>
            </>
          )
        }
      >
        {props.children || (
          <p>
            Este é o conteúdo principal do modal. Ele fecha ao clicar no botão fechar (X),
            no botão Cancelar, no backdrop ou ao pressionar a tecla <strong>ESC</strong>.
          </p>
        )}
      </Modal>
    </div>
  );
}

export const Interactive: Story = {
  args: {
    open: false,
    title: 'Confirmação de Ação',
    onClose: () => {},
    children: null,
  },
  render: () => <ModalDemo title="Confirmação de Ação" />,
};

export const LargeModal: Story = {
  args: {
    open: false,
    title: 'Termos e Condições do Marketplace',
    size: 'lg',
    onClose: () => {},
    children: null,
  },
  render: () => (
    <ModalDemo
      title="Termos e Condições do Marketplace"
      size="lg"
    >
      <div>
        <p>
          O Marketplace IFPB Cajazeiras é exclusivo para negociações entre estudantes do campus.
        </p>
        <p style={{ marginTop: '1rem' }}>
          Não são permitidos pagamentos dentro da plataforma. As entregas e pagamentos devem ser combinados presencialmente no campus.
        </p>
      </div>
    </ModalDemo>
  ),
};

export const DangerAction: Story = {
  args: {
    open: false,
    title: 'Excluir Anúncio',
    onClose: () => {},
    children: null,
  },
  render: () => (
    <ModalDemo
      title="Excluir Anúncio"
      footer={
        <>
          <Button variant="secondary" onClick={() => {}}>
            Voltar
          </Button>
          <Button variant="danger" onClick={() => {}}>
            Sim, excluir
          </Button>
        </>
      }
    >
      <p style={{ color: '#b91c1c' }}>
        Tem certeza de que deseja remover este anúncio? Esta ação não poderá ser desfeita.
      </p>
    </ModalDemo>
  ),
};
