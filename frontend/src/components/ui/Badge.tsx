import type { HTMLAttributes, ReactNode } from 'react';
import type { EstadoAnuncio, ModalidadeAnuncio, EstadoConservacaoValor } from '../../types';
import './Badge.css';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'
  | 'neutral'
  | 'primary';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
}

export function Badge({
  variant = 'neutral',
  size = 'sm',
  className = '',
  children,
  ...rest
}: BadgeProps) {
  const classes = [
    'ui-badge',
    `ui-badge--${variant}`,
    `ui-badge--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}

/**
 * Utilitário para renderizar o Badge correto a partir do estado do anúncio
 */
export function BadgeEstado({ estado }: { estado: EstadoAnuncio }) {
  const configMap: Record<EstadoAnuncio, { rotulo: string; variant: BadgeVariant }> = {
    ativo: { rotulo: 'Ativo', variant: 'success' },
    pausado: { rotulo: 'Pausado', variant: 'warning' },
    reservado: { rotulo: 'Reservado', variant: 'info' },
    vendido: { rotulo: 'Vendido', variant: 'neutral' },
    concluido: { rotulo: 'Concluído', variant: 'neutral' },
  };

  const config = configMap[estado] || { rotulo: estado, variant: 'neutral' };

  return <Badge variant={config.variant}>{config.rotulo}</Badge>;
}

/**
 * Utilitário para renderizar o Badge da modalidade (Venda ou Doação)
 */
export function BadgeModalidade({ modalidade }: { modalidade: ModalidadeAnuncio }) {
  if (modalidade === 'doacao') {
    return <Badge variant="success">Doação</Badge>;
  }
  return <Badge variant="primary">Venda</Badge>;
}

/**
 * Utilitário para renderizar o Badge do estado de conservação
 */
export function BadgeConservacao({ conservacao }: { conservacao: EstadoConservacaoValor }) {
  const configMap: Record<EstadoConservacaoValor, { rotulo: string; variant: BadgeVariant }> = {
    novo: { rotulo: 'Novo', variant: 'success' },
    seminovo: { rotulo: 'Seminovo', variant: 'info' },
    usado: { rotulo: 'Usado', variant: 'neutral' },
  };

  const config = configMap[conservacao] || { rotulo: conservacao, variant: 'neutral' };

  return <Badge variant={config.variant}>{config.rotulo}</Badge>;
}
