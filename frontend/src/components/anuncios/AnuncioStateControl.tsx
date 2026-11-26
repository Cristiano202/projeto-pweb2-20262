import { useState, type FormEvent } from 'react';
import type { EstadoAnuncio, ModalidadeAnuncio } from '../../types';
import { Button } from '../ui';
import './Anuncios.css';

interface AnuncioStateControlProps {
  modalidade: ModalidadeAnuncio;
  estadoAtual: EstadoAnuncio;
  carregando?: boolean;
  erro?: string | null;
  onChange: (estado: EstadoAnuncio) => void;
}

export function AnuncioStateControl({
  modalidade,
  estadoAtual,
  carregando = false,
  erro,
  onChange,
}: AnuncioStateControlProps) {
  const [estadoSelecionado, setEstadoSelecionado] = useState(estadoAtual);
  const estados: { valor: EstadoAnuncio; rotulo: string }[] = [
    { valor: 'ativo', rotulo: 'Ativo' },
    { valor: 'pausado', rotulo: 'Pausado' },
    { valor: 'reservado', rotulo: 'Reservado' },
    modalidade === 'venda'
      ? { valor: 'vendido', rotulo: 'Vendido' }
      : { valor: 'concluido', rotulo: 'Concluído' },
  ];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (estadoSelecionado !== estadoAtual) onChange(estadoSelecionado);
  }

  return (
    <form className="anuncio-state-control" onSubmit={handleSubmit}>
      <label htmlFor="anuncio-estado">Estado do anúncio</label>
      <div className="anuncio-state-control-row">
        <select
          id="anuncio-estado"
          value={estadoSelecionado}
          onChange={(event) => setEstadoSelecionado(event.target.value as EstadoAnuncio)}
        >
          {estados.map((estado) => (
            <option key={estado.valor} value={estado.valor}>{estado.rotulo}</option>
          ))}
        </select>
        <Button
          type="submit"
          variant="secondary"
          loading={carregando}
          disabled={estadoSelecionado === estadoAtual}
        >
          Atualizar estado
        </Button>
      </div>
      {erro && <p className="anuncio-field-error" role="alert">{erro}</p>}
    </form>
  );
}
