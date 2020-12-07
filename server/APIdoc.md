# Contents
 - [Create Game](#Show-User)
 - [Join Gmae](#Join-game)
 - [Show game info](#Show-game-info)
 - [Assign role](#Assign-role) `deprecated`
 - [Unassign role](#Unassign-role) `deprecated`
 - [Start game](#Start-game) `deprecated`
 - [Next move](#Next-move) `deprecated`
 - [Restart game](#Restart-game) `deprecated`
---
## Create game

Creates an instance of game and returns json data about the game id and game state.

* **URL**

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
  * **Code:** 400 Bad Request

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
  * **Code:** 400 Bad Request

    **Content:**
    * `{ error : "Player is not provided." }`
    * ``{ error : `${player} has already joined in the game.` }``
    * `{ error : "Game has already started." }`

  * **Code:** 404 Not found

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
    * **Required:**

      `id=[string]`

* **Data Params**

   None

* **Success Response:**
  * **Code:** 200

    **Content:** `{ gameState : [Object] }`

* **Error Response:**
  * **Code:** 404 Not found

    **Content:**  ``{ error : `Game id ${id} not found` }``

* **Sample Call:**

  ```javascript
    const res = await fetch(`/game/${gameID}/ping`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const nextState = await res.json();
    console.log(nextState);
  ```
  [Return top](#Contents)
---
## assign role
`(Deprecated)`

Assigns a player to a specific role in the game and returns json data about the game state.

* **URL**

  /game/:id/assign

* **Method:**

  `PUT`

*  **URL Params**

    * **Required:**

      `id=[string]`

* **Data Params**

    * **Required:**

      `player=[string]`
      `role=[string]`

* **Success Response:**
  * **Code:** 200

    **Content:** `{gameState : [Object] }`

* **Error Response:**
  * **Code:** 400 Bad Request

    **Content:**
    * ``{ error : `Game id ${id} not found` }``
    * ``{ error : `Failed to assign role: ${player} is an invalid player.` }``
    * ``{ error : `Failed to assign role: ${player} has been assigned.` }``
    * ``{ error : `${role} has been assigned.` }``
    * ``{ error : `Failed to assign role: ${role} is invalid.` }``

* **Sample Call:**
  ```javascript
    const gameID = "123456";
    const player = "Bob";
    const role = "blue spy";
    const res = await fetch(`/game/${gameID}/assign`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ player, role},
    });

    const nextState = await res.json();
    console.log(nextState);
  ```
  [Return top](#Contents)

---
## Unassign role
`(Deprecated)`

Unassigns a player from a specific role in the game and returns json data about the game state.

* **URL**

  /game/:id/unassign

* **Method:**

  `PUT`

*  **URL Params**

    * **Required:**

      `id=[string]`

* **Data Params**

    * **Required:**

      `player=[string]`
      `role=[string]`

* **Success Response:**
  * **Code:** 200

    **Content:** `{gameState : [Object] }`

* **Error Response:**
  * **Code:** 400 Bad Request

    **Content:**
    * ``{ error : `Game id ${id} not found` }``
    * ``{ error : `Failed to unassign role: ${player} is an invalid player.` }``
    * ``{ error : `${player} was not a ${role}.` }``
    * ``{ error : `Failed to unassign role: ${role} is invalid.` }``

* **Sample Call:**
  ```javascript
    const gameID = "123456";
    const player = "Bob";
    const role = "blue spy";
    const res = await fetch(`/game/${gameID}/unassign`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ player, role},
    });

    const nextState = await res.json();
    console.log(nextState);
  ```
  [Return top](#Contents)

---
## Start game
`(Deprecated)`

Lets the game start and returns json data about the game state.

* **URL**

  /game/:id/start

* **Method:**

  `PUT`

*  **URL Params**

    * **Required:**

      `id=[string]`

* **Data Params**

   None

* **Success Response:**
  * **Code:** 200

    **Content:** `{gameState : [Object] }`

* **Error Response:**
  * **Code:** 400 Bad Request

    **Content:**
    * ``{ error : `Game id ${id} not found` }``
    * `{ error : 'Role assignment is not finished yet.'}`
    * `{ error : 'Game has already started.'}`

* **Sample Call:**
  ```javascript
    const res = await fetch(`/game/${gameID}/start`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const nextState = await res.json();
    console.log(nextState);
  ```
  [Return top](#Contents)

---
## Next move
`(Deprecated)`

Make a move (by either a spy or a guesser) in the game and returns json data about the game state. If a hint is given, it indicates the move is made by a spy. If a word is given, it indicates the move is made by a guesser.

* **URL**

  /game/:id/next-move

* **Method:**

  `PUT`

*  **URL Params**

    * **Required:**

      `id=[string]`

* **Data Params**

    * **Required:**

      `player=[string]`

    * **Optional:**

      `hint=[string]`
      `word=[string]`

* **Success Response:**
  * **Code:** 200

    **Content:** `{gameState : [Object] }`

* **Error Response:**
  * **Code:** 400 Bad Request

    **Content:**
    * ``{ error : `Game id ${id} not found` }``
    * `{ error : 'Game is not started yet' }`
    * ``{ error : `${player} is not a guesser from team red.` }``
    * ``{ error : `${player} is not a guesser from team blue.` }``
    * `{ error : 'A guesser must wait until a spy gives hints.' }`
    * ``{ error : `${word} is not a word in this game.` }``

* **Sample Call:**
  ```javascript
    // spy's move
    const gameID = "123456";
    const player1 = "Bob";
    const hint = "country";
    const res = await fetch(`/game/${gameID}/next-move`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ player1, hint},
    });

    const nextState = await res.json();
    console.log(nextState);

    // guesser's move
    const player2 = "Alice";
    const word = "Canada";
    const res = await fetch(`/game/${gameID}/next-move`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ player2, word},
    });

    const nextState = await res.json();
    console.log(nextState);
  ```
  [Return top](#Contents)

---
## Restart game
`(Deprecated)`

Restarts the game and returns json data about the game state.

* **URL**

  /game/:id/restart

* **Method:**

  `PUT`

*  **URL Params**

    * **Required:**

      `id=[string]`

* **Data Params**

   None

* **Success Response:**
  * **Code:** 200

    **Content:** `{gameState : [Object] }`

* **Error Response:**
  * **Code:** 400 Bad Request

    **Content:**
    * ``{ error : `Game id ${id} not found` }``
    * `{ error : 'Game is not started yet'}`

* **Sample Call:**
  ```javascript
    const res = await fetch(`/game/${gameID}/restart`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const nextState = await res.json();
    console.log(nextState);
  ```
  [Return top](#Contents)
