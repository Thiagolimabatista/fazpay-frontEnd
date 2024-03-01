/* eslint-disable import/no-extraneous-dependencies */
// Libs
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { useMemo, useEffect, useReducer, useCallback, createContext } from 'react';
import {
  getAuth,
  signOut,
  UserCredential,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

import httpRequest from 'src/utils/httpRequest';

import { FIREBASE_API } from 'src/config-global';
// Types

import { AuthUserType, ActionMapType, AuthStateType, FirebaseContextType } from 'src/auth/types';

enum Types {
  INITIAL = 'INITIAL',
}

type Payload = {
  [Types.INITIAL]: {
    isAuthenticated: boolean;
    user: AuthUserType;
  };
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext<FirebaseContextType | null>(null);

// ----------------------------------------------------------------------

const firebaseApp = initializeApp(FIREBASE_API);

const DB = getFirestore(firebaseApp);

export const storage = getStorage(firebaseApp);
export const AUTH = getAuth(firebaseApp);
export const getDB = DB;

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      onAuthStateChanged(AUTH, async (user) => {
        if (user) {
          let profile = {};

          try {
            const response = await httpRequest(`/users/${user.uid}`, undefined, 'get');
            profile = response;
          } catch (error) {
            console.error('Erro ao obter perfil do usuário:', error);
          }

          dispatch({
            type: Types.INITIAL,
            payload: {
              isAuthenticated: true,
              user: {
                ...user,
                ...profile,
              },
            },
          });
        } else {
          dispatch({
            type: Types.INITIAL,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGAR O USUÁRIO NA PLATAFORMA
  const login = useCallback(
    (email: string, password: string): Promise<UserCredential> =>
      signInWithEmailAndPassword(AUTH, email, password),
    []
  );

  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      try {
        const res = await createUserWithEmailAndPassword(AUTH, email, password);
        if (res.user) {
          const id = res.user.uid;
          await httpRequest('/users', {
            id,
            email,
            firstName,
            lastName,
          });

          await initialize();
        }
      } catch (error) {
        console.error('Erro ao registrar usuário:', error);
      }
    },
    [initialize]
  );

  const logout = useCallback(() => {
    signOut(AUTH);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: 'firebase',
      login,
      register,
      logout,
      initialize,
    }),
    [state.isAuthenticated, state.isInitialized, state.user, login, register, logout, initialize]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
