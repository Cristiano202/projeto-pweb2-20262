import { useEffect } from 'react';
import { useAppDispatch } from './store';
import { restaurarSessaoThunk } from './store/authSlice';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(restaurarSessaoThunk());
    }
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;