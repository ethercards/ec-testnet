/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom';
import './Navigation.css';
import logo from '../../assets/images/logo-in-menu.png';
import Address from '../common/Address';
import Web3Ctx from '../Context/Web3Ctx';

const Navigation = (props)=>{
    const [toggleNav, setToggleNav] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const {onboard, address, connecting} = useContext(Web3Ctx);

    useEffect(()=>{
        //console.log('event listener added',address);
        window.addEventListener('scroll', handleOnScroll);

        return () => {
           // console.log('event listener removed');
            window.removeEventListener('scroll', handleOnScroll);
        }
    },[]);

/* 
    useEffect(()=>{
        if(state.)
    },[state]);
 */

    const handleDisconnect = () => {
        console.log('disconnect clicked');
        if(onboard){
            onboard.walletReset();
            localStorage.removeItem('selectedWallet');
        }
    }

    const handleConnect = async () => {
        if(onboard){
            await onboard.walletSelect();
        }
    }

    const   handleToggleNav = () => {
        setToggleNav(!toggleNav);
    }
    const   handleOnScroll = () => {
       // console.log(window.scrollY);
    }

    const toggleDropdown = (e) => {
        e.preventDefault();
        setDropdownVisible(!dropdownVisible);
      //  setDropdownDocsVisible(false);
    }
/* 
    const toggleDropdownDocs = (e) => {
        e.preventDefault();
        setDropdownVisible(false);
        setDropdownDocsVisible(!dropdownDocsVisible);
    } */


    return (
        <nav className="navbar navbar-expand-lg fixed-top navbar-dark tbx-nav">
        <div className="container">
                <Link className="navbar-brand nav-link" to="/">
                    {/* <img src={logo} alt="toolbox"/> */}
                    EC TESTNET
                </Link>
                <button className="navbar-toggler" type="button" onClick={handleToggleNav}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse ${toggleNav?'show':''} navbar-collapse text-right`} id="navbarText">
                    <ul className="navbar-nav ml-auto mr-3">
                        {/* <li className="nav-item">
                            <a className="nav-link" href="https://ether.cards">HOME</a>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/">GALLERY</Link>
                        </li>
                       
                        <li className="nav-item">
                            <a className="nav-link" href="https://sale.ether.cards/wallet">WALLET</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="https://artists.ether.cards">ARTISTS</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="https://docs.ether.cards">DETAILS</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="https://blog.ether.cards">BLOG</a>
                        </li> */}


                        {!connecting && <>
                            {address ?
                                    <li className="nav-item ml-4">
                                        <Address address={address} short blockie scale={3}/>
                                        <p className="disconnect" onClick={handleDisconnect}>disconnect</p>
                                    </li>
                            :
                                    <li className="nav-item ml-4">
                                        <button className="btn btn-peach btn-sm round connect-btn" onClick={handleConnect}>CONNECT</button>
                                    </li>
                            }
                    </>}

                    </ul>
                    
                </div>
        </div>
            </nav>
    );

}
export default Navigation;
