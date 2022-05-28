'use strict';

// Game Object
const game = {
    playersNum: [],
    playersName: [],
    playerOneScore: 0,
    playerTwoScore: 0,
    playerTurn: 1,
    difficulty: [],
    secretNumber: [],
    previousGuess: [],
    totalGuesses: [],
    winCounter: [],

    
    // Handles majority of game variables such as player name/s, number generation, and updating the DOM
    startGame() {
        // Check player name input value 
        let playerOneName = $( '#player-one-name' ).val();
        game.playersName.push( playerOneName );
        playerOneName = $( '#player-one-name' ).val('');
        if ( game.playersNum.slice( (game.playersNum.length) -1 ) == 'two-player'  ) {
            let playerTwoName = $( '#player-two-name' ).val();
            game.playersName.push( playerTwoName );
            playerTwoName = $( '#player-two-name' ).val('');
        }
        
        // Start the game only IF player/s name, number and difficulty has been selected
        if( game.playersNum.length > 0 && game.difficulty.length > 0 && game.playersName.length > 0 ) {
            $( '#splash-page, .animated-text-wrapper' ).hide();
            $( '.game-page-wrapper' ).show( );
            // Instructions button styling on game page
            let styles = {
                top: '11rem',
                right: '1rem',
            }
            // Show/hide player two score on game page depending on playersNum array value in game object
            $( '.instructions' ).css( styles );
            if( game.playersNum.slice( (game.playersNum.length) -1 ) == 'one-player' ){
                $( '#scoreboard-player-two' ).hide();
                $( '#scoreboard-player-one' ).html( `${ game.playersName }:` );
                if( game.difficulty.slice( ( game.difficulty.length ) -1 ) == 'easy' ) {
                    let easySecretNumber = Math.floor( Math.random() * 1024 + 1 );
                    game.secretNumber.push( easySecretNumber );
                    // Output difficulty level in game page
                    $( '.difficulty-range' ).html( 'Range 1-1024' );
                    } else if ( game.difficulty.slice( ( game.difficulty.length ) -1 ) == 'medium' ) {
                    let mediumSecretNumber = Math.floor( Math.random() * 2048 + 1 );
                    game.secretNumber.push( mediumSecretNumber );
                    $( '.difficulty-range' ).html( 'Range 1-2048' );
                } else if ( game.difficulty.slice( ( game.difficulty.length ) -1 ) == 'hard' ) {
                    let hardSecretNumber = Math.floor( Math.random() * 4096 + 1 );
                    game.secretNumber.push( hardSecretNumber );
                    $( '.difficulty-range' ).html( 'Range 1-4096' );
                }
                // Check whether two player has been selected
            } else if( game.playersNum.slice( (game.playersNum.length) -1 ) == 'two-player' ) {
                $( '#scoreboard-player-two' ).show();
                let playerOneName = $( '#player-one-name' ).val();
                game.playersName.push( playerOneName );
 
                // Update the DOM with player names
                $( '#scoreboard-player-two' ).show();
                $( '.two-player-player-1-name' ).html( game.playersName[ 0 ] );
                $( '.two-player-player-2-name' ).html( game.playersName[ 1 ] );
                $( '#scoreboard-player-one' ).html( `${ game.playersName[ 0 ] }: ` );
                $( '#scoreboard-player-two' ).html( `${ game.playersName[ 1 ] }: ` );
                // Show two player modal
                let styles = {
                    display: 'block',
                    opacity: '1',
                }
                let twoPlayerModal = $( '#two-player-modal' ).css( styles );
                twoPlayerModal.show();
                
                $( '#two-player-secret-number-submit' ).click( function() {
                    // Take input value from two player modal and add to secret number array
                    let playerOneSecretNumber = Number( $( '#player-one-secret-number' ).val() );
                    // Check if input is a number
                    if ( !isNaN(playerOneSecretNumber) ) {
                        game.secretNumber.push( playerOneSecretNumber );
                        let styles = {
                            display: 'none',
                            opacity: '0',
                        }
                        $( '#two-player-modal' ).css( styles );
                        // Reset input value to empty string
                        $( '#guess-input' ).val('');
                        $( '#player-one-secret-number' ).val('');
                        // Reset guessMessage to empty string
                        $( '#guess-message' ).html( '' );
                    } else {
                        alert('Please enter a valid number');
                    }
                } );
            } 
        }

        // Output message to DOM instructing player to select and fill in appropriate fields to start the game
        $( '#error-message' ).html( 'Please select the number of players, player difficulty and input player name/s ' );
    },
    // Switch screen to splash screen when quit button is selected
    quit() {
        $( '.game-page-wrapper' ).hide();
        $( '#splash-page, .animated-text-wrapper' ).show();
        game.playersName = [];
        let styles = {
            top: '9rem',
            right: '11rem',
        }
        $( '.instructions' ).css( styles );
        game.secretNumber = [];
        game.previousGuess = [];
        game.totalGuesses = [];
    },
    // Update playerNum array 
    numberOfPlayers() {
        let value = $( this ).attr( 'value' );
        game.playersNum.push( value );
    },
    // Update difficulty array
    difficultyLevel() {
        let difficulty = $( this ).attr( 'value' );
        game.difficulty.push( difficulty );
    },
    // Checks guess number for one/two player/s
    submitButton() {
        // Retriever player input value and use it to update previous and total guesses
        let guessValue = Number( $( '#guess-input' ).val() );
    
        // Check if one or two player
        if ( game.playersNum.slice( (game.playersNum.length) -1 ) == 'one-player' ) {
            if( guessValue == 0 ){
                $( '#guess-message' ).html( 'A number greater than 0 must be entered' );
                $( '#guess-input' ).val('');
            } else if( guessValue >  game.secretNumber.slice( ( game.secretNumber.length ) - 1 ) ) {
                $( '#guess-message' ).html( 'Your guess is too high' );
                $( '#guess-input' ).val('');
                game.previousGuess.push( guessValue );
                game.totalGuesses.push(guessValue);
            } else if ( guessValue <  game.secretNumber.slice( ( game.secretNumber.length ) - 1 ) ) {
                $( '#guess-message' ).html( 'Your guess is too low' );
                $( '#guess-input' ).val('');
                game.totalGuesses.push(guessValue);
                game.previousGuess.push( guessValue );
            } else if ( guessValue ==  game.secretNumber.slice( ( game.secretNumber.length ) - 1 ) ) {
                game.totalGuesses.push(guessValue);
                game.previousGuess.push( guessValue );
                let styles = {
                    display: 'block',
                    opacity: '1',
                }
                let winModal = $( '#win' ).css( styles );
                winModal.show();
                // Update winCounter array
                game.winCounter += '1';
                $( '#scoreboard-player-one' ).html( `${ game.playersName }:${ game.winCounter.length }` );
            }
        } else if ( game.playersNum.slice( (game.playersNum.length) -1 ) == 'two-player' ) {
            if( guessValue == 0){
                $( '#guess-message' ).html( 'A number greater than 0 must be entered' );
                $( '#guess-input' ).val('');
            } else if( guessValue >  game.secretNumber.slice( ( game.secretNumber.length ) - 1 ) ) {
                $( '#guess-message' ).html( 'Your guess is too high' );
                $( '#guess-input' ).val('');
                game.previousGuess.push( guessValue );
                game.totalGuesses.push(guessValue);
            } else if ( guessValue <  game.secretNumber.slice( ( game.secretNumber.length ) - 1 ) ) {
                $( '#guess-message' ).html( 'Your guess is too low' );
                $( '#guess-input' ).val('');
                game.previousGuess.push( guessValue );
                game.totalGuesses.push(guessValue);
            } else if ( guessValue ==  game.secretNumber.slice( ( game.secretNumber.length ) - 1 ) ) {
                game.previousGuess.push( guessValue );
                game.totalGuesses.push(guessValue);
                // Check player turn and update player score
                if ( game.playerTurn === 1 ) {
                    game.playerTwoScore += 1;
                    game.playerTurn += 1;
                } else if ( game.playerTurn === 2 ) {
                    game.playerOneScore += 1;
                    game.playerTurn -= 1;
                }
                if (game.playerTurn === 1 ) {
                    let styles = {
                        display: 'block',
                        opacity: '1',
                    }
                    let completedRoundModal = $('#bothPlayersPlayed').css(styles);
                    completedRoundModal.show();
                    $( '#scoreboard-player-one' ).html( game.playerOneScore );
                    $( '#scoreboard-player-one' ).html( `${ game.playersName[ 0 ] }: ${ game.playerOneScore } ` );
                } else if( game.playerTurn === 2 ) {
                    $( '#player-two-secret-number' ).val('');

                    let styles = {
                        display: 'block',
                        opacity: '1',
                    }
                    let twoPlayerModal = $( '#two-player-secret-number-modal' ).css( styles );
                    twoPlayerModal.show();

                    $( '#player-two-secret-number-submit' ).click( function() {
                        game.secretNumber = [];
                        // Take input value from two player modal and add to secret number array
                        let playerOneSecretNumber = Number( $( '#player-two-secret-number' ).val() );
                        // Check if input is a number
                        if ( !isNaN(playerOneSecretNumber) ) {
                            
                            game.secretNumber.push( playerOneSecretNumber );
                            let styles = {
                                display: 'none',
                                opacity: '0',
                            }
                            $( '#two-player-secret-number-modal' ).css( styles );
                            // Reset input value to empty string
                            $( '#guess-input' ).val('');
                            // Reset guessMessage to empty string
                            $( '#guess-message' ).html( '' );
                             // Update player two score in the DOM
                            $( '#scoreboard-player-two' ).html( game.playerTwoScore );
                            $( '#scoreboard-player-one' ).html( `${ game.playersName[ 0 ] }: ${ game.playerOneScore } ` );
                            $( '#scoreboard-player-two' ).html( `${ game.playersName[ 1 ] }: ${ game.playerTwoScore }` );
                        } else {
                            alert('Please enter a valid number');
                        }
                    } );
                }
            }
        }
        // Update guess counter
        $( '#guess-counter' ).html( game.totalGuesses.length );
    },

    helpButton() {
        let previousGuess = game.previousGuess.slice( ( game.previousGuess.length ) - 1 );
        // Get the difference between guess and secret number
        let remainder = previousGuess - game.secretNumber;
        // If player guess is incorrect, give them a hint
        if ( game.playersNum.slice( (game.playersNum.length) -1 ) == 'one-player' || game.playersNum.slice( (game.playersNum.length) -1 ) == 'two-player'  ) {
            // Conditional to compare most recent guess and the secret number
            if( remainder > 0 && remainder < 50) {
                // Output when difference if between 0 and 50 
                $( '#guess-message' ).html( 'Your previous guess was within 50 points' );
            } else if ( remainder <= 0 && remainder >= -50 ) {
                // Output when difference if between 0 and 50 
                $( '#guess-message' ).html( 'Your previous guess was within 50 points' );
            } else if ( remainder >= 50 && remainder <= 100 ) {
                // Output when difference if between 0 and 100 
                $( '#guess-message' ).html( 'Your previous guess was within 100 points' );
            } else if ( remainder <= -50 && remainder >= -100 ) {
                // Output when difference if between 0 and 100
                $( '#guess-message' ).html( 'Your previous guess was within 100 points' );
            } else if ( remainder >= 100 || remainder <= -100 ) {
                $( '#guess-message' ).html( 'Your previous guess was greater than 100 points' );
            }
        } 
    },
    // Hide modals when correct guess is made
    winClose() {
        let styles = {
            display: 'none',
            opacity: '0',
        }
        $( '#win, #two-player-modal, #two-player-secret-number-modal' ).css( styles );
        // Reset input value to empty string
        $( '#guess-input' ).val('');
        // Reset guessMessage to empty string
        $( '#guess-message' ).html( '' );
        // Reset player name to empty string
        game.secretNumber = [];
    },
    // Hide win modal and reset guess input value and secretNumber array
    restart() {
        // close window modal
        let styles = {
            display: 'none',
            opacity: '0',
        }
        $( '#win' ).css( styles );
        // Reset input value to empty string
        $( '#guess-input' ).val('');
        // Reset secret number array to an empty array 
        game.secretNumber = [];
        
        // Check if there is one or two names and output to html accordingly
        if( game.playersName.length == 1 ) {
        // Update DOM with player name
            $( '#scoreboard-player-one' ).html( `${ game.playersName }: ${ game.winCounter.length }` );
                 // Generate secret number based on difficulty level
            if( game.difficulty.slice( ( game.difficulty.length ) -1 ) == 'easy' ) {
                let easySecretNumber = Math.floor( Math.random() * 1024 );
                game.secretNumber.push( easySecretNumber );
                // Output difficulty level in game page
                $( '.difficulty-range' ).html( 'Range 1-1024' );
                } else if ( game.difficulty.slice( ( game.difficulty.length ) -1 ) == 'medium' ) {
                let mediumSecretNumber = Math.floor( Math.random() * 2048 );
                game.secretNumber.push( mediumSecretNumber );
                $( '.difficulty-range' ).html( 'Range 1-2048' );
            } else if ( game.difficulty.slice( ( game.difficulty.length ) -1 ) == 'hard' ) {
                let hardSecretNumber = Math.floor( Math.random() * 4096 );
                game.secretNumber.push( hardSecretNumber );
                $( '.difficulty-range' ).html( 'Range 1-4096' );
            }
        } else if ( game.playersName.length == 2 ) {
        // Update DOM with players name
            $( '#scoreboard-player-two' ).show();
            $( '#scoreboard-player-one' ).html( `${ game.playersName[ 0 ] }: ` );
            $( '#scoreboard-player-two' ).html( `${ game.playersName[ 1 ] }: ` );
        }
    }
}

// Global click events

// Event handler to show second player input when two player is selected
$( '#player-two-btn' ).click(function( ) {
    $( '#player-two-name' ).toggle( 'slow');
});

// Event handler to hide second player input when one player is selected
$( '#player-one-btn' ).click(function() {
    $( '#player-two-name' ).hide('slow');
});

// Event handler to start game
$( '#start-game' ).click( game.startGame );

// Event handler for quit button 
$( '#quit' ).click( game.quit );

// Event handler to check whether one player or two players has been selected
$( '.num-players-selection' ).click( game.numberOfPlayers );

// Event handler to check for difficulty level 
$( '.difficulty-btns' ).click( game.difficultyLevel);

// Event handler for submit button 
$( '#submit' ).click( game.submitButton );

// Event handler for help button 
$( '#help' ).click( game.helpButton );

// Event handler for when a new round is started
$( '#round-complete-restart' ).click( function() {
    let styles = {
        display: 'block',
        opacity: '1',
    }
    let roundCompleteRestart = $( '#bothPlayersPlayed' ).css( styles );
    roundCompleteRestart.hide();
    game.secretNumber = [];
    game.restart();
    let newRoundModal = $( '#two-player-modal' ).css(styles);
    newRoundModal.show();
} );

// Event handler for when the game is quit after two player round has finished
$( '#round-complete-quit' ).click( function() {
    game.quit();
    game.secretNumber = [];
    let styles = {
        display: 'block',
        opacity: '1',
    }
    let completeRoundQuit = $( '#bothPlayersPlayed' ).css(styles);
    completeRoundQuit.hide();
});

// Event handler for close button in correct guess window modal
$( '#winClose' ).click( function() {
    game.quit(); 
    let styles = {
        display: 'block',
        opacity: '1',
    }
    let winModal = $( '#win' ).css( styles );
    winModal.hide();
    // game.restart();
    game.winClose();
    $('#player-one-name').val('');
} );

// Event handler for restarting game
$( '#restart, #winRestart' ).click( game.restart );
