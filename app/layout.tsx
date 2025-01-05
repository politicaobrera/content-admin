import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ToasterContext from './context/ToasterContext'
import AuthContext from './context/AuthContext'
import Sidebar from './components/sidebar/Sidebar'
import { SectionsProvider } from './context/SectionsContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admin App',
  description: 'Manage all of the contents',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <AuthContext>
          <ToasterContext />
          <Sidebar>
            <SectionsProvider>
              {children}
            </SectionsProvider>
          </Sidebar>
        </AuthContext>
      </body>
    </html>
  )
}
