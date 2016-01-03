import React from 'react';

import BaseComponent from '../BaseComponent';
import Helmet from '../Helmet';

const store = {};

class AboutMenu extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = store;
  }

  render() {
    return (
      <div>
        <Helmet title="About" />
        <h1>About</h1>
        <iframe
          src={ 'https://ghbtns.com/github-btn.html' +
                '?user=chrisngobanh&repo=freshestsquid&type=star&count=true'
              }
          frameBorder="0" scrolling="0" width="108px" height="20px"
        >
        </iframe>
        <iframe
          src={ ' https://ghbtns.com/github-btn.html' +
                '?user=chrisngobanh&repo=freshestsquid&type=fork&count=true'
              }
          frameBorder="0" scrolling="0" width="108px" height="20px"
        >
        </iframe>
        <p><span className="orange">Freshest Squid</span> is a tool
        for <span className="orange">Splatoon</span> players to create and share
        their freshest inklings!</p>

        <br />

        <p><span className="orange">Freshest Squid</span> is a not-for-profit
        open-source software, maintained
        by <a target="_blank" href="https://github.com/chrisngobanh">Christopher Banh</a>, and
        released under the
        <a target="_blank" href="https://github.com/chrisngobanh/freshestsquid/blob/master/LICENSE">
          MIT License
        </a>
        .</p>

        <br />

        <p><span className="orange">Splatoon</span> and <span className="orange">Wii U</span> are
        trademarks or registered trademarks of <span className="orange">Nintendo</span>
        . <span className="orange">Freshest Squid</span> is neither affiliated with nor contracted
        by the <span className="orange">Splatoon</span> development team
        or <span className="orange">Nintendo</span>.</p>

        <br />

        <p><span className="orange">Splatoon</span> assets (names, images) will be used in a
        way that qualifies as fair use under US copyright law.</p>

        <br />

        <h2>Contact Me</h2>
        <h3>Christopher Banh</h3>
        <a href="mailto:chris@chrisbanh.com"><h4>chris@chrisbanh.com</h4></a>
        <a target="_blank" href="https://github.com/chrisngobanh"><h4>My GitHub Profile</h4></a>

        <br />
        <br />

        <a href="/privacypolicy">Privacy Policy</a>

        <br />

        <a href="/">Back</a>
      </div>
    );
  }
}

export default AboutMenu;
