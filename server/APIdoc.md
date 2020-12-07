# Contents
 - [Create Game](#Show-User)
 - [Join Gmae](#Join-game)
 - [Show game info](#Show-game-info)
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

  * **Code:** 401 Unauthorized
    **Content:** `{ err : "Your account is not upgraded." }`

* **Sample Call:**
  ```javascript
    const player = "Bob";
    const socketID = "1234567890";
    const name = "Bob's game";
    const isPublic = true;
    const maxPlayerNum = 4;
    const res = await fetch("/game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ player, socketID, name, isPublic, maxPlayerNum },
    });

    const nextState = await res.json();
    console.log(nextState);
  ```
  [Return top](#Contents)
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

  * **Code:** 404  
    **Content:** ``{ error : `Game id ${id} not found` }``

* **Sample Call:**

  ```javascript
    const gameID = "ABCDE";
    const player = "Alice";
    const socketID = "1234567890";
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
  [Return top](#Contents)
---
## Show game info

Rreturns json data about the game state of a specific game with its ID.

* **URL**

  /game/:id/ping

* **Method:**

  `GET`

*  **URL Params**

   None

* **Data Params**

   None

* **Success Response:**
  * **Code:** 200
    **Content:** `{ gameState : [Object] }`

* **Error Response:**
  * **Code:** 404  
    **Content:**  ``{ error : `Game id ${id} not found` }``

* **Sample Call:**

  ```javascript
    const res = await fetch(`/game/${gameID}/ping`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ player, socketID },
    });

    const nextState = await res.json();
    console.log(nextState);
  ```
  [Return top](#Contents)
---
