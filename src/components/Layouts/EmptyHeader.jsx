import React, { useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWallet';
import Sidebar from './Sidebar';

const EmptyHeader = () => {
  const [sidebarState, setSidebarState] = useState(false);

  const toggleDrawer = (status) => {
    setSidebarState(status);
  };

  return (
    <>
      <div className="header">
        <Container>
          <Navbar expand="lg">
            <Navbar.Brand href="#home" className="text-white">
              <img src={'/assets/images/logo.png'} alt="logo" />
            </Navbar.Brand>
            <h2
              style={{
                color: '#fff',
                marginBottom: 0,
                textAlign: 'center',
                flex: 1,
              }}
            >
              NFT ART
            </h2>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <div
                  onClick={() => toggleDrawer(!sidebarState)}
                  className="nav-style wallet-icon"
                >
                  <AccountBalanceWalletOutlinedIcon />
                </div>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Container>
      </div>
      <Sidebar toggleDrawer={toggleDrawer} sidebarState={sidebarState} />
    </>
  );
};

export default EmptyHeader;
