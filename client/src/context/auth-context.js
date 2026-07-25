// client/src/context/auth-context.js

import { createContext } from 'react'

// split from AuthContext.jsx so that file can export only the AuthProvider
// component (react-refresh/only-export-components)
export const AuthContext = createContext(null)
