import React, { useEffect, useState } from 'react';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import header from './assets/pawprintz.png';
import hover from './assets/pawprintzhover.png';
import defaultIcon from './assets/usericon.png';
import { handleGoogleSignIn } from "./Authentication.jsx"
import { getAuth, onAuthStateChanged } from "firebase/auth";

import './App.css'

export default function Nav() {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleClick = () => {
    if (!user) {
      handleGoogleSignIn();
    } else {
      auth.signOut().then(() => {
        console.log('User signed out');
        localStorage.clear();
        sessionStorage.clear();
      }).catch((error) => {
        console.error('Error signing out:', error);
      });
    }
  };

  return (
    <nav className="nav">
      <Link to="/">
        <img 
          className="logo" 
          src={header} 
          alt="PawPrintz logo"
          onMouseOver={e => (e.currentTarget.src = hover)}
          onMouseOut={e => (e.currentTarget.src = header)}
        />
      </Link>
      <ul>
        <CustomLink to="/" className="nav-link">Home</CustomLink>
        <CustomLink to="/logs" className="nav-link">Mood Log</CustomLink>
        <CustomLink to="/store" className="nav-link">Store</CustomLink>
        <CustomLink to="/resourcepage" className="nav-link">Resource Hub</CustomLink>
        <CustomLink to="/about" className="nav-link">About</CustomLink>
        <button onClick={handleClick} className="circle-button">
          <img
            src={user ? user.photoURL : defaultIcon}
            alt="User profile"
            className="circle-image"
            disabled={!!user}
            title={user ? "Already signed in" : "Sign in with Google"}
            style={{
              width: '34px',
              height: '34px',
              background: 'none',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '30px',
            }}
          />
        </button>
      </ul> 
    </nav>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  return (
    <li className={isActive ? 'active' : ''}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
