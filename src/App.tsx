import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes/AppRoutes';
// import PlatformShell from '@gdo-global-client-reporting/dentsu-platform-shell';

function App() {

	return (
		// <PlatformShell
		// 	disableOkta={true}
		// 	appTitle={import.meta.env.VITE_APP_TITLE}			
		// >
		// Remove BrowserRouter if PlatformShell is enabled
		<BrowserRouter> 
			<AppRoutes />
		</BrowserRouter>
		// </PlatformShell>
	)
}

export default App
