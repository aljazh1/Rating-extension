# IMDb with Rotten Tomatoes Overlay

A custom Chrome Extension that integrates Rotten Tomatoes critc and audience scores directly into IMDb movie and TV show pages.

## Features

* **Dual Scoring:** Displays both critic and audience scores.
* **Smart Detection:** Automatically differentiates between Movies and TV Series to fetch the correct data.
* **Visual Integration:** Matches IMDb's design language with a custom "ROTTEN TOMATOES" header.
* **Dynamic Icons:** Dynamic icons that correspond with ratings.
* **Direct Links:** Clicking the rating badge takes you directly to the Rotten Tomatoes page.

## Installation (Developer Mode)

Since this is a custom extension, you need to load it manually into Chrome:

1.  Clone or download this repository.
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Toggle **Developer mode** in the top right corner.
4.  Click **Load unpacked**.
5.  Select the folder containing these files.
6.  Go to IMDb and enjoy!

## File Structure

* `manifest.json`: Configuration V3 manifest.
* `content.js`: Handles DOM manipulation to inject ratings onto the IMDb page.
* `background.js`: Handles cross-origin requests to fetch data from Rotten Tomatoes.

## License

This project is for educational and personal use.