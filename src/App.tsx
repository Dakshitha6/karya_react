import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AppRoutes from './AppRoutes/AppRoutes';
import 'react-toastify/dist/ReactToastify.css';
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
			<ToastContainer />
		</BrowserRouter>
		// </PlatformShell>
	)
}

export default App
