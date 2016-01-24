# Freshest Squid

## Table of Contents

1. [Overview](#overview)
1. [Intallation](#installation)
1. [FAQ](#faq)
1. [Special Booyahs!](#special-booyahs)
1. [How To Contribute](#how-to-contribute)
1. [Legal](#legal)

## Overview

Freshest Squid is a tool for Splatoon players to create the inkling of their dreams!
The aim of Freshest Squid is to provide a useful tool for Splatoon players with a familiar UI by mimicking the menus in Splatoon.

This website runs on a **Node.js** app with the **Express.js** framework. All of the views are written in **React JSX** and rendered both client-side and server-side (See: [Isomorphic JavaScript](https://strongloop.com/strongblog/node-js-react-isomorphic-javascript-why-it-matters/)). Both the JavaScript and JSX code use **ES6** features, such as classes and block-scoped variables. All of the stylesheets are written in and preprocessed with **Sass (SCSS Syntax)**. Data is stored in a **MySQL** database. Here is the [Trello board](https://trello.com/b/IGvXO35z/freshest-squid) that used to organize Freshest Squid's development. If you would like to help out, see the [Installation](#installation) section to get the app up and running, and the [How To Contribute](#how-to-contribute) section to learn how to contribute.

**[⬆ back to top](#table-of-contents)**

## Installation

### Install the latest version of Node.js (version >= 5.0.0)

Since Freshest Squid uses ES6 features, you're going to need the latest version of Node.js installed. I recommend using Node.js 5.0.0 or greater installed to run this app, which you can install from [its website](https://nodejs.org/en/).

To check what version of Node.js you currently have installed, run `node --version`.

```
$ node --version
v5.0.0
```

Installing Node.js will also get you [npm, Node's Package Manager](https://www.npmjs.com/).
```
$ npm --version
v3.5.2
```

### Install `gulp`

This app uses [Gulp](http://gulpjs.com/) to build its assets. To run Gulp, you'll need the `gulp` package installed globally on your system using npm.

```
$ sudo npm install -g gulp

```

### Install MySQL

Freshest Squid stores data in a MySQL database. You can install MySQL from [its website](http://www.mysql.com/).

### Clone this repo onto your machine

```
$ git clone git@github.com:chrisngobanh/freshestsquid.git
$ cd freshestsquid
```

### Run `npm install` to install dependencies

```
$ npm install
npm http GET https://registry.npmjs.org/express
npm http GET https://registry.npmjs.org/gulp
npm http GET https://registry.npmjs.org/nunjucks
...
```

### Run the app!

We can use Gulp to start our app so that it can do useful things for us like recompile our assets and restart the server.

```
$ gulp server
```

Our app will run on port `8000`. You can view it in your browser by visiting `http://localhost:8000/`

BrowserSync also runs a copy of the app on port `8001`, which you can view at `http://localhost:8001/`. I recommend using this when you work on the app because BrowserSync will automatically update your browser as you make your changes.

**[⬆ back to top](#table-of-contents)**

## FAQ

### The data on Freshest Squid is out of date or incorrect!

I occasionally miss Splatoon updates that add new items or weapons. In addition, I do not thoroughly check if the data I use is entirely correct.

Because of this, I need help from the community with checking keeping the data up-to-date and valid. See the [How To Contribute](#how-to-contribute) section below if you want to help out with this!

### Why is Freshest Squid so slow?

This may be because I run Freshest Squid on a low-budget VPS that also runs other web apps. If this becomes a problem, I will upgrade the server or host Freshest Squid on its own, more powerful server.

**[⬆ back to top](#table-of-contents)**

## Special Booyahs!

Booyah! to [@erinbui](https://github.com/erinbui) for creating nearly all of the graphics used in the website.

Booyah! to [/u/macguffinman](https://www.reddit.com/user/macguffinman) for the [Splatoon Gear Guide](https://docs.google.com/spreadsheets/d/1mE97vf8FxdfvR6pt7tFvYXkYGSZGg4AsrTI_2veUlbs/).

Booyah! to [JapanYoshi](http://japanyoshi.tumblr.com/) for [Project Paintball](http://fizzystack.web.fc2.com/paintball.html), the font used in Freshest Squid.

Booyah! to [Inkipedia](http://splatoonwiki.org/wiki) for the ability icons.

**[⬆ back to top](#table-of-contents)**

## How To Contribute

I'm open to all help, from coding and design to ideas. I'd even appreciate it if you fixed typos or grammar in the comments.

Here are the ground rules:

* All JavaScript code must follow [this style guide](https://github.com/airbnb/javascript). All JSX code must follow [this style guide](https://github.com/airbnb/javascript/tree/master/react).
  * If ESLint doesn't approve your code, then I probably won't as well.
  * You can disable some options of ESLint if you need to.
* If there's an item in `To Do` or `Wishlist` in the [Trello board](https://trello.com/b/IGvXO35z/freshest-squid), you may code it yourself and [submit a pull request](https://github.com/chrisngobanh/freshestsquid/compare).
* If you have a great idea, [open a new issue](https://github.com/chrisngobanh/freshestsquid/issues/new) on it and I'll check it out!
  * In addition to this, feel free to `+1` any good ideas that you come across.
  * Please check the [Trello board](https://trello.com/b/IGvXO35z/freshest-squid) or [past/existing issues](https://github.com/chrisngobanh/freshestsquid/issues?utf8=%E2%9C%93&q=is%3Aissue) to see if your idea has already been suggested.
* If you're submitting a design, your best bet would be to [open an issue](https://github.com/chrisngobanh/freshestsquid/issues?utf8=%E2%9C%93&q=is%3Aissue) and present your designs there. You could also code in the designs yourself and [submit a pull request](https://github.com/chrisngobanh/freshestsquid/compare) if you would like.
* I'm pretty stubborn about comments. If you contribute code, please thoroughly document your work.

**[⬆ back to top](#table-of-contents)**

## Legal

Freshest Squid is a not-for-profit open-source software released under the MIT License. See the [LICENSE](https://github.com/chrisngobanh/freshestsquid/blob/master/LICENSE) file for details.

Splatoon and Wii U are trademarks or registered trademarks of Nintendo. Freshest Squid is neither affiliated with nor contracted by the Splatoon development team or Nintendo.

Splatoon assets (names, images) will be used in a way that qualifies as fair use under US copyright law.

**[⬆ back to top](#table-of-contents)**
