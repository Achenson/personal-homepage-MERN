# SmoothTabs - personal homepage [frontend demo]

Manage bookmarks, RSS channels and notes in a form of foldable tabs
- Drag the tabs between columns
- Choose between plain color or image background modes
- Set default open/close state for each tab
- Control individual or global tab colors and RSS settings
- Customize number and width of columns

All data is being saved to local storage. Clear local storage to reset to original tab set.

Bypass CORS to allow RSS channels to work. On Chrome:
1. Add new shortcut on the desktop
2. Add the target as "[PATH_TO_CHROME]chrome.exe" --disable-web-security --disable-gpu --user-data-dir=~/chromeTemp


App inspired by iGTab - https://igtab.com/

## Live app

https://achenson.github.io/personal-homepage/

## How to run locally

1. Install nodejs - https://nodejs.org

2. In the project directory run:

### `npm install` 
Installs dependencies
### `npm start`
Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

## License

This project is licensed under the GNU General Public License, version 3 (GPLv3) - see the [LICENSE.md](LICENSE.md) file for details






