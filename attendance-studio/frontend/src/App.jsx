import React, {useEffect, useState} from 'react';
import AttendancePage from './pages/AttendancePage';

// Register future page components here; API authentication belongs on the server.
const pages = {'/attendance': AttendancePage};
export default function App() {
  const [route, setRoute] = useState(location.hash.slice(1) || '/attendance');
  useEffect(()=>{
    const navigate = ()=>setRoute(location.hash.slice(1) || '/attendance');
    window.addEventListener('hashchange', navigate);
    return ()=>window.removeEventListener('hashchange', navigate);
  },[]);
  const Page = pages[route];
  return Page ? <Page/> : <main><h1>Page not found</h1><a href="#/attendance">Open attendance</a></main>;
}
