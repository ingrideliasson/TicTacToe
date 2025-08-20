# Tic Tac Toe

Detta projekt är en implementation av det spelet **Tic Tac Toe** utvecklat i **React**.

## Funktionalitet

- **Två spellägen**
  - **Två spelare**: Två användare kan spela mot varandra på samma dator.
  - **Mot datorn**: Enspelarläge där användaren möter en datorn som motståndare. Spel-logiken finns i tre svårighetsgrader (*lätt, medel, svår*).

- **Timer per spelare**
  - I läget **Två spelare** har varje spelare en total nedräkningstid (nedräkningen börjar när spelet börjar).
  - Om tiden tar slut vinner motståndaren automatiskt rundan.

- **Poängräkning**
  - Resultatet för både X och O sparas och visas i en **Scoreboard**.

- **Animeringar**
  - Grafiska övergångar och markeringar av vinnande kombinationer implementerade med hjälp av *Framer Motion*.

## Teknisk översikt

- **React** används för att bygga användargränssnittet.
- **Tailwind CSS** används för styling.
- **Framer Motion** hanterar animeringar.
- Komponentbaserad struktur med separata komponenter för exempelvis spelplan (`Board`), AI-spelplan (`AiBoard`), resultatvisning (`Scoreboard`) och timer (`GameTimer`).

## Installation och körning

1. Klona detta repo:
   ```bash
   git clone https://github.com/ingrideliasson/TicTacToe.git
   cd TicTacToe

2. Installera beroenden:
    ```bash npm install 

3. Starta servern med spelet:
    ```bash npm start

4. Spelet körs sedan på ```bash http://localhost:3000


## Användning

- Vid start kan användaren välja spelläge.

- I tvåspelarvarianten turas spelarna om att klicka på rutorna för att placera sina symboler.

- I enspelarläget kan användaren justera svårighetsgrad innan spelet startar.

- Knapparna Play again och Reset game används för att starta en ny runda (med bibehållen poängstatistik) respektive återställa spelet.

