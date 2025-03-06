import { Route, Routes } from "react-router-dom"
import MainLayout from "../Layouts/MainLayout"
import HomePage from "../Layouts/Pages/HomePage/HomePage"

const AppRoutes = () => {
	console.log('App routes invoked...')
	return (
		// <ApolloProvider client={client("token", JSON.stringify(serviceconfig))}>
		<Routes>
			<Route path="/" element={<MainLayout />}>
				<Route index element={<HomePage />} />
			</Route>
		</Routes>
		// </ApolloProvider>
	)
}

export default AppRoutes