import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store';
import { Button } from '../components/ui';
import './NotFoundPage.css';

export function NotFoundPage() {
  const navigate = useNavigate();
  const { token, perfil } = useAppSelector((state) => state.auth);

  const destino = !token
    ? '/login'
    : perfil === 'ADMIN'
      ? '/admin/anuncios'
      : '/vendas';

  const rotulo = perfil === 'ADMIN' ? 'Ir para anúncios' : 'Ir para o início';

  return (
    <main className="not-found-page">
      <section className="not-found-card" role="main" aria-labelledby="not-found-title">
        <span className="not-found-code" aria-hidden="true">404</span>
        <p className="not-found-brand">BRICS DO IF</p>
        <h1 id="not-found-title">Página não encontrada</h1>
        <p className="not-found-description">
          A página que você tentou acessar não existe ou foi movida.
        </p>
        <div className="not-found-actions">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Voltar
          </Button>
          <Link to={destino}>
            <Button type="button">{rotulo}</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
