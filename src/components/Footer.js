import React from 'react';
import '../css/Footer.css';
import { Link } from 'react-router-dom';
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";
import { FaCarSide } from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className="footer p-5">
            <div className="footer-top pr-5 pl-5">
                <div className="footer-social">
                    <h2 className='fw-bold'>Visit us on</h2>
                    <div className='row d-flex justify-content-between m-0'>
                        <div className="social-icons">
                            <FaFacebook color='blue' size={25} /><Link>Facebook</Link> <br />
                            <FaSquareInstagram size={25} /><Link>Instargram</Link><br />
                            <FaYoutube size={25} color='red' /><Link>Youtube</Link>
                        </div>

                    </div>

                </div>

            </div>
            <hr></hr>
            <div className="footer-middle mt-4 pr-5 pl-5">
                <div className="footer-section">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="#">Request a Test Drive</a></li>
                        <li><a href="#">Find a Retailer</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Experience BMW</h4>
                    <ul>
                        <li><a href="#">Corporate Sales</a></li>
                        <li><a href="#">BMW.com</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Legal Information</h4>
                    <ul>
                        <li><a href="#">Cookie Policy</a></li>
                        <li><a href="#">Imprint</a></li>
                        <li><a href="#">Legal Disclaimer</a></li>
                    </ul>
                </div>

            </div>


        </footer>
    );
}
