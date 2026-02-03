import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../Layouts/MainLayout';
import Login from '../components/Authentication/Login/Login';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import Dashboard from '../Layouts/Pages/Dashboard/Dashboard';
import Users from '../Layouts/Pages/Users/Users';
import UserDetails from '../Layouts/Pages/UserDetails/UserDetails';
import AssistanceRequests from '../Layouts/Pages/AssistanceRequests/AssistanceRequests';
import AssistanceRequestDetails from '../Layouts/Pages/AssistanceRequestDetails/AssistanceRequestDetails';

// Placeholder components
const Onboarding = () => <div>Onboarding Page - To be implemented</div>;
const Restricted = () => <div>Restricted Access - You don't have admin privileges</div>;

const AppRoutes = () => {
	return (
		<Routes>
			{/* Public Routes */}
			<Route path="/login" element={<Login />} />

			{/* Protected Routes */}
			<Route
				path="/"
				element={
					<ProtectedRoute requireAdmin={true}>
						<MainLayout />
					</ProtectedRoute>
				}
			>
				{/* Redirect root to dashboard */}
				<Route index element={<Navigate to="/dashboard" replace />} />
				<Route path="dashboard" element={<Dashboard />} />
				<Route path="users" element={<Users />} />
				<Route path="users/:id" element={<UserDetails />} />
				<Route path="assistance-requests" element={<AssistanceRequests />} />
				<Route path="assistance-requests/:id" element={<AssistanceRequestDetails />} />
			</Route>

			{/* Onboarding Route */}
			<Route
				path="/onboarding"
				element={
					<ProtectedRoute requireAdmin={false} allowOnboarding={true}>
						<Onboarding />
					</ProtectedRoute>
				}
			/>

			{/* Restricted Route */}
			<Route
				path="/restricted"
				element={
					<ProtectedRoute requireAdmin={false}>
						<Restricted />
					</ProtectedRoute>
				}
			/>

			{/* Catch all - redirect to dashboard */}
			<Route path="*" element={<Navigate to="/dashboard" replace />} />
		</Routes>
	);
};

export default AppRoutes;
