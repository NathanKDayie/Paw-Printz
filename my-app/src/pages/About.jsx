import React from 'react';
import '../App.css'
import kellee from '../assets/kellee.png';
import papa from '../assets/papa.png';
import laurenz from '../assets/laurenz.png';
import nathan from '../assets/nathan.png';
import jay from '../assets/jay.png';

const About = () => {
    return (
        <div className="about-container">
            <div className="about-text">
                <h1 className="headers">Built by UMBC Students,</h1>
                <h2 className="headers" style={{ paddingBottom: '40px' }}>for UMBC Students.</h2>
                <p className="about-paragraphs"> 
                    As UMBC students, we know how overwhelming student life can be.
                    With the stress of classes, exams, and the pressures of daily life, 
                    it's easy to ignore self care while juggling multiple responsibilities.
                    We often forget about all of the resources available to us, both on and off campus.
                    <br></br>
                        <b style={{ paddingTop: '30px', paddingBottom: '30px' }}>We wanted a solution, so we made one.</b>
                    That's why we created Paw Printz, a website designed to help students like us manage stress and prioritize ourselves
                    by integrating self care with an interactive virtual pet. 
                </p>
            </div>
            <div className="dev-container">
                <h1 className="headers" style={{ padding: '20px', paddingBottom: '20px', justifyContent: 'right' }}>Meet the Developers</h1>
                <div className="about-images">
                    <div className="image-grid">
                        <div className="dev-wrapper">
                            <a href="https://www.linkedin.com/in/kellee-palmer/" target="_blank">
                                <div className="image-circle">
                                    <img src={kellee} alt="Kellee Palmer" className="about-image" />
                                </div>
                            </a>
                            <div className="dev-info">
                                <h2>Kellee Palmer</h2>
                                <p>CS UMBC '26</p>
                                <p>Lead Developer Scrum Master Frontend Developer UX/UI Designer</p>
                            </div>
                        </div>

                        <div className="dev-wrapper">
                            <a href="https://www.linkedin.com/in/papa-manu-41a5b827b/" target="_blank">
                                <div className="image-circle">
                                    <img src={papa} alt="Papa Manu" className="about-image" />
                                </div>
                            </a>
                            <div className="dev-info">
                                <h2>Papa Manu</h2>
                                <p>CS UMBC '26</p>
                                <p>Frontend & Backend Developer</p>
                            </div>
                        </div>

                        <div className="dev-wrapper">
                            <a href="https://www.linkedin.com/in/ndayie/" target="_blank">
                                <div className="image-circle">
                                    <img src={nathan} alt="Nathan Dayie" className="about-image" />
                                </div>
                            </a>
                            <div className="dev-info">
                                <h2>Nathan Dayie</h2>
                                <p>CS UMBC '26</p>
                                <p>Backend Developer & Tester</p>
                            </div>
                        </div>

                        <div className="dev-wrapper">
                            <a href="https://www.linkedin.com/in/laurenz-millin-bab09a262/" target="_blank">
                                <div className="image-circle">
                                    <img src={laurenz} alt="Laurenz Millin" className="about-image" />
                                </div>
                            </a>
                            <div className="dev-info">
                                <h2>Laurenz Millin</h2>
                                <p>CS UMBC '26</p>
                                <p>Backend Developer & Tester</p>
                            </div>
                        </div>
                    </div>

                    <div className="dev-wrapper">
                        <h2>Special Thanks</h2>
                        <p>Huge thanks to Jay for coming up with our pet design!</p>
                        <div className="image-grid-single">
                            <a href="https://www.linkedin.com/in/julianna-gepilano-686b22284/" target="_blank">
                                <div className="image-circle">
                                    <img src={jay} alt="Jay Gepilano" className="about-image" />
                                </div>
                            </a>
                        </div>
                        <div className="dev-info">
                            <h2>Jay Gepilano</h2>
                            <p>CS UMBC '27</p>
                            <p>UI/UX Designer</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;