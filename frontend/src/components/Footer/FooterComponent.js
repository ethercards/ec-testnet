import React from 'react';
import './FooterComponent.css';
import discordLogo from '../../assets/images/discord.png';
import redditLogo from '../../assets/images/reddit.png';
import twitterLogo from '../../assets/images/twitter.png';

const FooterComponent = (props) => {

    return(
        <div
        className="footer-container"
      >
        <div id="copyright">
          <p className="c-symbol">©</p>
          <p>2021 Ether.cards All Rights Reserved</p>
        </div>

        <div id="contactUs">
          <p>Contact Us</p>
          <a href="https://twitter.com/ether_cards" target="_blank"
            ><img src={twitterLogo} alt="twitter"
          /></a>
          <a href="https://discord.com/invite/mBwauRSJNW" target="_blank"
            ><img src={discordLogo} alt="discord"
          /></a>
          <a href="https://www.reddit.com/r/Ether_Cards/" target="_blank"
            ><img src={redditLogo} alt="reddit"
          /></a>
        </div>
      </div>
    );
}
export default FooterComponent;