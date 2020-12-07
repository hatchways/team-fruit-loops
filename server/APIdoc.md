# Contents
 - [Create Game](#Show-User)
 - [Join Gmae](#Join-game)
---
## Create game

Creates an instance of game and returns json data about the game id and game state.

* **URL**
*
  /game

* **Method:**

  `POST`

*  **URL Params**

   None

* **Data Params**

    * **Required:**

      `player=[string]`
      `socketID=[string]`

   * **Optional:**

     `name=[string]`
     `isPublic=[boolean]`
     `maxPlayerNum=[integer]`

* **Success Response:**
  * **Code:** 200
    **Content:** `{ id : [string], gameState : [Object] }`

* **Error Response:**
  * **Code:** 400  
    **Content:** `{ error : "Player is not provided." }`

  OR

  * **Code:** 401 Unauthorized
    **Content:** `{ err : "Your account is not upgraded." }`

* **Sample Call:**
  ```javascript
    const res = await fetch("/game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ player, socketID },
    });

    const nextState = await res.json();
    console.log(nextState);
  ```
---
## Join game

Joins in a game and returns json data about the game state.

* **URL**

  /game/:id/join

* **Method:**

  `PUT`

*  **URL Params**
    * **Required:**

      `id=[string]`

* **Data Params**
    * **Required:**

      `player=[string]`
      `socketID=[string]`

* **Success Response:**
  * **Code:** 200
    **Content:** `{ gameState : [Object] }`

* **Error Response:**
  * **Code:** 400  
    **Content:**
    * `{ error : "Player is not provided." }`
    * ``{ error : `${player} has already joined in the game.` }``
    * `{ error : "Game has already started." }`

* **Sample Call:**

  ```javascript
    const res = await fetch(`/game/${gameID}/join`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ player, socketID },
    });

    const nextState = await res.json();
    console.log(nextState);
  ```
---
