import React, { JSX } from 'react'
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { okta } from './config/okta';
import { LoginCallback, Security, useOktaAuth } from '@okta/okta-react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ValidateAuth from './AuthRoute/ValidateAuth';
import AppRoutes from '../../AppRoutes/AppRoutes';


const oktaAuth = new OktaAuth(okta);

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
	const { authState } = useOktaAuth();

	if (authState?.isPending) return <div>Loading...</div>;
	return authState?.isAuthenticated ? element : <Navigate to="/login/callback" replace />;
};

const PlatformShield = ({ }: { children: React.ReactNode }) => {
	const restoreOriginalUri = async (_oktaAuth: any, originalUri: string) => {
		window.history.pushState({}, "", toRelativeUrl(originalUri || "/", window.location.origin));
	};

	console.log('Shield Activated...')
	return (
		<Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
			<BrowserRouter>
				<Routes>
					<Route path="/login/callback" element={<LoginCallback />} />
					<Route path="/" element={<ValidateAuth />} >
						<Route path="/" element={<ProtectedRoute element={<AppRoutes />} />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</Security>
	);
};

export default PlatformShield;