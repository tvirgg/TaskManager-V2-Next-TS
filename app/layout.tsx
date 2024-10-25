import './globals.css';
import { UserProvider } from './contexts/UserContext';
import { TaskProvider } from './contexts/TaskContext';

export const metadata = {
  title: 'Gerus Targets',
  description: 'Task Manager Calendar',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <UserProvider>
          <TaskProvider>{children}</TaskProvider>
        </UserProvider>
      </body>
    </html>
  );
}
