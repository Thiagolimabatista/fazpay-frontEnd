import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  return <Container>{children}</Container>;
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  const [checked, setChecked] = useState(false);

  const checkAuthentication = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/auth/jwt/login');
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
