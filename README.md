Daily Budget Tracker

A simple, single-page daily budget tracker that stores data in your browser (localStorage). Dark + orange modern, minimal theme.

Files
- `index.html` — main app page
- `styles.css` — theme and layout
- `app.js` — application logic (add/delete/search/export/clear)

Features
- Add income and expense entries with date, description and amount
- List entries and delete individual entries
- Shows totals for Income, Expense and Balance
- Search by description
- Export entries to JSON
- Clear all stored data
- Username prompt on first load (saved in localStorage)

How to run locally
1. Open `index.html` in your browser (double-click or use "Open File" in your browser).
2. The page works fully offline and stores data in localStorage.

Free hosting options (open on your phone)

1) GitHub Pages (recommended)
- Create a new GitHub repository and push this project folder.
- In the repo settings -> Pages, choose the `main` branch (or `gh-pages`) and root `/` as the folder.
- GitHub will provide a URL like `https://username.github.io/repo` — open on your phone.

2) Netlify (drag-and-drop)
- Go to https://app.netlify.com/sites/deploy
- Drag-and-drop the site folder (the files) into the drop area.
- Netlify will deploy and give you a public URL.

Notes
- Data is stored locally in the browser and is not synced across devices.
- If you want device sync, we can add optional export/import (disabled by default) or connect a backend.

Enjoy!
<img width="1920" height="934" alt="image" src="https://github.com/user-attachments/assets/817ff92d-f307-4517-b682-35c41a3b2933" />
