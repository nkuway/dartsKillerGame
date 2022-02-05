document.addEventListener('DOMContentLoaded', (event) => {

    /*
     * Dartboard values
     */
    let values = [{"single": 25, "double": 50}];
    for (let i = 1; i <= 20; i++) {
        values.push({"single": i, "double": i * 2, "triple": i * 3});
    }

    // clone values for future references
    let cloneValues = [...values];

    // shuffle cloned array
    for (let i = cloneValues.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cloneValues[i], cloneValues[j]] = [cloneValues[j], cloneValues[i]];
    }

    /*
     * Players
     * @desc: create and update player obj
     * @properties: name, number, points, killer, dead
     */
    class Player {
        constructor(name, number, points, killer) {
            this._name = name;
            this._number = number;
            this._points = points;
            this._killer = killer;
        }

        get number() {
            return this._number;
        }

        get points() {
            return this._points;
        }

        set name(name) {
            this._name = name;
        }

        set number(number) {
            this._number = number;
        }

        set killer(killer) {
            this._killer = killer;
        }
    }

    /*
     * Players
     * @desc: create players and render them to the DOM
     */
    let playersArr = [];
    const players = document.getElementById('players');
    const playerForm = document.getElementById('playerForm');
    const input = playerForm.querySelector('input');
    const submitBtn = playerForm.querySelector('button');

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // if player name is not empty
        if (!input.value.trim().length) {

            //todo: add error handling for empty player name
            console.log('name is empty')
            return;
        }

        // if clone values array is not empty
        if (cloneValues.length > 0) {

            // create player obj
            let player = new Player(input.value, 0, 1, false, false);

            // set player random number
            player.number = cloneValues[0].single;

            // push and splice arrays
            playersArr.push(player);
            cloneValues.splice(0, 1);

            // create player tags
            let playerWrapper = document.createElement('div');
            let playerName = document.createElement('span');
            let playerNumber = document.createElement('span');
            let playerDeleteBtn = document.createElement('button');
            let playerPoints = document.createElement('span');
            let playerIncrementBtn = document.createElement('button');
            let playerDecrementBtn = document.createElement('button');

            // add player css classes
            playerWrapper.classList.add('player');
            playerWrapper.id = player.number;
            playerName.classList.add('player__name');
            playerNumber.classList.add('player__number');
            playerDeleteBtn.classList.add('player__delete-btn');
            playerPoints.classList.add('player__points');
            playerIncrementBtn.classList.add('player__points--increment-btn');
            playerDecrementBtn.classList.add('player__points--decrement-btn');

            // add player meta
            playerName.innerHTML = player._name;
            playerNumber.innerHTML = player._number;
            playerDeleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            playerDeleteBtn.dataset.target = player._number;
            playerPoints.innerHTML = player.points;
            playerIncrementBtn.innerHTML = '<i class="fas fa-plus-circle"></i>';
            playerIncrementBtn.dataset.target = player._number;
            playerDecrementBtn.innerHTML = '<i class="fas fa-minus-circle"></i>';
            playerDecrementBtn.dataset.target = player._number;

            // render
            playerWrapper.append(playerName, playerNumber, playerIncrementBtn, playerDecrementBtn, playerPoints, playerDeleteBtn);
            players.append(playerWrapper);

            // todo: save players to sessionStorage
            // save players to sessionStorage
            // sessionStorage.setItem('players', JSON.stringify(playersArr));

        } else {
            submitBtn.setAttribute("disabled", "");
        }
    });

    // Delete players
    document.body.addEventListener('click', function (e) {
        if (e.target.classList.contains('player__delete-btn')) {

            // remove disabled attribute from submit button
            submitBtn.removeAttribute('disabled');

            // set var for player number
            let playerNumber = parseInt(e.target.dataset.target);

            // loop player array and remove item if id matches player single number
            for (let i = playersArr.length - 1; i >= 0; --i) {
                if (playersArr[i]._number === playerNumber) {
                    playersArr.splice(i, 1);
                }
            }

            // add value object to clone values array
            cloneValues.push({"single": playerNumber, "double": playerNumber * 2, "triple": playerNumber * 3});

            // remove from DOM
            document.getElementById(e.target.dataset.target).remove();
        }
    });

    /*
     * Score / points
     * @desc: update player score and status
     */
    document.body.addEventListener('click', function (e) {

        // increment player points
        if (e.target.classList.contains('player__points--increment-btn')) {
            let targetHit = true;
            let playerNumber = parseInt(e.target.dataset.target);
            let pointsElement = e.target.parentElement.querySelector('.player__points');
            let playerPoints = parseInt(pointsElement.innerHTML);

            // update player points in players array
            updateObjectPlayerValues(playerNumber, targetHit);

            // update player points in DOM
            pointsElement.innerHTML = (playerPoints + 1).toString();

            // todo: disabled increment button if player points equals 5

            // decrement player points
        } else if (e.target.classList.contains('player__points--decrement-btn')) {
            let targetHit = false;
            let playerNumber = parseInt(e.target.dataset.target);
            let pointsElement = e.target.parentElement.querySelector('.player__points');
            let playerPoints = parseInt(pointsElement.innerHTML);

            // update player points in players array
            updateObjectPlayerValues(playerNumber, targetHit);

            // update player points in DOM
            pointsElement.innerHTML = (playerPoints - 1).toString();
        }
    });

    function updateObjectPlayerValues(playerNumber, targetHit) {
        playersArr.forEach((player, index) => {
            if (player._number === playerNumber) {

                let playerEl = document.getElementById(playerNumber);

                // update player points
                if (targetHit) {
                    playersArr[index]._points = playersArr[index]._points + 1;
                } else {
                    playersArr[index]._points = playersArr[index]._points - 1;
                }

                // update killer status
                if (playersArr[index]._points === 5) {
                    playersArr[index]._killer = true;
                    playerEl.classList.add('player--is-killer');
                } else {
                    playersArr[index]._killer = true;
                    playerEl.classList.remove('player--is-killer');
                }
                if (playersArr[index]._points === 0) {
                    playerEl.classList.add('player--is-dead');
                } else {
                    playerEl.classList.remove('player--is-dead');
                }
            }
        });

        console.log(playersArr)
    }

    // todo: reset game on button click


    // todo: load data from sessionStorage
    /*
     * Load SessionStorage values
     * @desc: render values if stored
     */
    // if (sessionStorage['players']) {
    //     let sessionPlayers = JSON.parse(sessionStorage.getItem('players'));
    //     console.log('players in session:', sessionPlayers)
    //     // sessionPlayers.forEach((player) => {
    //     //     let playerName = document.createElement('li');
    //     //     playerName.innerHTML = player._name;
    //     //     players.append(playerName);
    //     // });
    // } else {
    //     players.innerHTML = '<li>Er zijn nog geen spelers aangemaakt</li>';
    // }

});
