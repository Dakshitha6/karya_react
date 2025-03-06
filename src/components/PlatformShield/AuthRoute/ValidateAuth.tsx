// import React from 'react';
import { toRelativeUrl } from '@okta/okta-auth-js';
import { useOktaAuth } from '@okta/okta-react';
import { Outlet } from 'react-router-dom';

const ValidateAuth = () => {
	const { oktaAuth, authState } = useOktaAuth();

	if (!authState|| authState.isPending || !oktaAuth ) {
		return <div style={{ textAlign: "center" }}>Loading...</div>;
	}

	if (!authState?.isAuthenticated) {
		const originalUri = toRelativeUrl(window.location.href, window.location.origin);
		oktaAuth.setOriginalUri(originalUri);
		oktaAuth.signInWithRedirect();
	}

	console.log('authState.isAuthenticated : ', authState.isAuthenticated )
	return (
		authState.isAuthenticated ? <Outlet /> : <>Load...</>
	)
}

export default ValidateAuth;