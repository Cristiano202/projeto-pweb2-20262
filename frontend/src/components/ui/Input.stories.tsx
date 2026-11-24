import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Rótulo exibido acima do campo',
    },
    placeholder: {
      control: 'text',
      description: 'Texto de dica quando o campo está vazio',
    },
    error: {
      control: 'text',
      description: 'Mensagem de erro de validação',
    },
    helperText: {
      control: 'text',
      description: 'Texto de ajuda ou instrução abaixo do campo',
    },
    required: {
      control: 'boolean',
      description: 'Indica se o campo é obrigatório (marca com *)',
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o campo de entrada',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel'],
      description: 'Tipo do input HTML',
    },
  },
  args: {
    label: 'Nome do campo',
    placeholder: 'Digite algo...',
    required: false,
    disabled: false,
    type: 'text',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Nome completo',
    placeholder: 'Ex: Maria Silva',
  },
};

export const Required: Story = {
  args: {
    label: 'E-mail institucional',
    placeholder: 'estudante@academico.ifpb.edu.br',
    required: true,
    helperText: 'Apenas e-mails com domínio @academico.ifpb.edu.br',
  },
};

export const Password: Story = {
  args: {
    label: 'Senha',
    type: 'password',
    placeholder: '••••••••',
    required: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Telefone / WhatsApp',
    placeholder: '(83) 99999-9999',
    helperText: 'Opcional. Será exibido no seu perfil para contato.',
  },
};

export const WithError: Story = {
  args: {
    label: 'E-mail institucional',
    placeholder: 'estudante@gmail.com',
    value: 'estudante@gmail.com',
    error: 'O e-mail deve pertencer ao domínio @academico.ifpb.edu.br',
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Campo desabilitado',
    value: 'Valor fixo não editável',
    disabled: true,
  },
};
