import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const isReturningToCategories = sessionStorage.getItem('isReturningToCategories');

    // Se estamos voltando para a página de categorias, a lógica de restauração dela deve assumir.
    // Portanto, este componente não deve fazer nada.
    if (pathname.startsWith('/categorias') && isReturningToCategories) {
      sessionStorage.removeItem('isReturningToCategories');
      return;
    }

    // Para todas as outras navegações, rolar para o topo.
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
