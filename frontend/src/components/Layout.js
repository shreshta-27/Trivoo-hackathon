import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="textured-bg" style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <Sidebar />
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <Header />
        <main className="animate-fade-in" style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem 2.5rem'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
