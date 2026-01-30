import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../Layouts/MainLayout';
import HomePage from '../Layouts/Pages/HomePage/HomePage';
import Login from '../components/Authentication/Login/Login';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';

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
				<Route index element={<HomePage />} />
				{/* Add more protected routes here */}
				{/* 
				<Route path="dashboard" element={<Dashboard />} />
				<Route path="users" element={<Users />} />
				<Route path="users/:id" element={<UserDetails />} />
				<Route path="assistance-requests" element={<AssistanceRequests />} />
				<Route path="assistance-requests/:id" element={<AssistanceRequestDetails />} />
				*/}
			</Route>

			{/* Onboarding Route */}
			<Route
				path="/onboarding"
				element={
					<ProtectedRoute requireAdmin={false} allowOnboarding={true}>
						<div>Onboarding Page - To be implemented</div>
					</ProtectedRoute>
				}
			/>

			{/* Restricted Route */}
			<Route
				path="/restricted"
				element={
					<ProtectedRoute requireAdmin={false}>
						<div>Restricted Access - You don't have admin privileges</div>
					</ProtectedRoute>
				}
			/>

			{/* Catch all - redirect to home */}
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
};

export default AppRoutes;
