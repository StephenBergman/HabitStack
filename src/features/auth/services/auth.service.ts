import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

import { supabase } from 'services/supabase';

/**
 * Returns the current Supabase session, if available.
 */
export async function getCurrentSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(`Failed to load auth session: ${error.message}`);
  }

  return data.session;
}

/**
 * Subscribes to Supabase auth session changes.
 */
export function subscribeToAuthSession(
  listener: (session: Session | null, event: AuthChangeEvent) => void,
): () => void {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    listener(session, event);
  });

  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Signs in with email/password credentials.
 */
export async function signInWithEmailPassword(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Registers a user with email/password credentials.
 */
export async function registerWithEmailPassword(
  email: string,
  password: string,
): Promise<Session | null> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.session;
}

/**
 * Signs out the current authenticated user.
 */
export async function signOutCurrentUser(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}
