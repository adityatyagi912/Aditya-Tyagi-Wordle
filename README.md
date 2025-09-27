# Aditya-Tyagi-Wordle
My Implementation of the Wordle Assignment

1. Game Intialization
  - Resets all the game state variables: currentGuess, currentRow, gameOver, gameWon
  - Picks a random word apart of the WordleWords list
  - Clears the baord and hides any modals or messages
2. Handling Keyboard Input
 - Ignores the input if the game is over
 - Adds the letter to the current guess and updates the tile
 - Enter Key: submits the guess if complete otherwise shows an error message and makes the rows shake
 - Backspace Key: Removes the last letter from the guess and clears out the corresponding tile

3. Submitting a Guess
    - Validation: checks if the guess is complete and is a valid word from the word list
    - Checking Letters: uses checkLetter to compare each letter against the target word
    - Duplicate Letters: handled using a two-pass approach by going first and marks all exact matches as correct first then it goes back for remaining letters and checks for prescence elsewhere

4. Checking a Single Letter
    - Handles all teh duplicate letters correctly using a count based system: keeps track of how many times a letter appears in the target word
  
