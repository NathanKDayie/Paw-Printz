import React from 'react';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import logo from './assets/logo.png';
import title from './assets/pawprintz.png';
import './App.css'

export default function Nav() {
    return (
        <nav className="nav">
            <Link to="/">
                <img className="logo" src={title} alt="PawPrintz logo" />
            </Link>
            <ul>
                <CustomLink to="/logs" className="nav-link">Mood Log</CustomLink>
                <CustomLink to="/store" className="nav-link">Store</CustomLink>
                <CustomLink to="/resourcepage" className="nav-link">Resources</CustomLink>
                <CustomLink to="/about" className="nav-link">About</CustomLink>
            </ul> 
        </nav>
    );
};

function CustomLink({to, children, ...props}) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({path: resolvedPath.pathname, end: true});
    return (
        <li className={isActive ? 'active' : ''}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    );
}