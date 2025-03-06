import AppRoutes from './AppRoutes/AppRoutes';
import PlatformShield from './components/PlatformShield/PlatformShield';

function App() {

	return (
		<PlatformShield>
			<AppRoutes />
		</PlatformShield>
	)
}

export default App
