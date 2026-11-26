import type { ReactNode } from 'react';
import type { Curso } from '../../types';
import '../../pages/Profile.css';

export interface ProfileHeaderProps {
  nome: string;
  curso: Curso;
  telefone?: string | null;
  fotoUrl?: string | null;
  actions?: ReactNode;
}

export function ProfileHeader({
  nome,
  curso,
  telefone,
  fotoUrl,
  actions,
}: ProfileHeaderProps) {
  return (
    <section className="profile-header-card">
      <div className="profile-avatar">
        {fotoUrl
          ? <img src={fotoUrl} alt={`Foto de ${nome}`} />
          : <span aria-hidden="true">{nome.charAt(0).toUpperCase()}</span>}
      </div>
      <div className="profile-info">
        <h1>{nome}</h1>
        <p><strong>Curso:</strong> {curso.nome}</p>
        {telefone && <p><strong>Contato:</strong> {telefone}</p>}
      </div>
      {actions && <div className="profile-edit-link">{actions}</div>}
    </section>
  );
}
