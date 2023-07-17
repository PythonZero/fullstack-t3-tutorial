import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function withAuthorization<T extends React.JSX.IntrinsicAttributes>(
  Component: React.ComponentType<T>
) {
  return function WithAuthorization(props: T) {
    const router = useRouter();
    const { data: session, status: sessionStatus } = useSession();

    useEffect(() => {
      if (sessionStatus === 'unauthenticated') {
        router.push('/api/auth/signin')
          .catch((error) => {
            // Handle the error if needed
            console.error('An error occurred while navigating to login:', error);
          });
      }
    }, [sessionStatus, router]);

    if (sessionStatus === 'unauthenticated') {
      return null; // You can render an unauthorized message or component here if needed
    }

    return <Component {...props} />;
  };
}
