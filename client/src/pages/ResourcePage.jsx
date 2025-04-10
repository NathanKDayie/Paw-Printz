import React, { useState } from 'react';
import resourceData from './resources.json';
import '../App.css'
import './ResourcePage.css'

const ResourcePage = () => {
    const [openCategory, setOpenCategory] = useState(null);
    
    const handleClick = (category) => {
        setOpenCategory(openCategory === category ? null : category);
    };

    return (
        <div>
            <h1 className="headers">Resources</h1>
            <div className= "resource-page">
                <div className="dropdown-container">
                    {resourceData.map((resource) => (
                        <React.Fragment key={resource.category} className="dropdown">
                            <button className="dropdown-button" onClick={() => handleClick(resource.category)}> 
                                {resource.category}
                            </button>
                            
                            {openCategory === resource.category && (
                                <div className="dropdown-content">
                                    {resource.links.map((link) => (
                                        <div key={link.title} className="dropdown-link">
                                            <a href={link.url} target="_blank">
                                                {link.title}
                                            </a>
                                            <p>{link.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResourcePage;