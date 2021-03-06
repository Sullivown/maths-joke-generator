import jokeListArr from './jokes.js';

const Joke = function(jokeObj) {
    // let argsArr = Array.from(arguments);
    let questionContent = jokeObj.question;
    let spaces = {};
    let formattedJoke = '';

    // Init
    initializeSpaces();
    updateJoke();
    formatJoke();

    function initializeSpaces() {
        for (const prop in jokeObj) {
            if (prop == 'question') {
                continue;
            } else {
                spaces[prop] =  { 'options': jokeObj[prop].split(','), 'selection': null }
            }
        }
    }

    function getJokeDetails() {
        return { 
            questionContent,
            spaces,
            formattedJoke,
        };
    }

    function formatJoke() {
        let jokeFormatter = questionContent.replaceAll(/\*space\d+\*/g, (space) => {
            const spaceNum = space.slice(1, -1);

            const jokeAnswerSpace = getJokeDetails().spaces[spaceNum].selection;

            return jokeAnswerSpace ? jokeAnswerSpace.bold() : '__________';
        });

        formattedJoke = jokeFormatter;
    }

    function updateJoke(answers) {
        // Receives an answers object and updates the current joke with the relevent selections
        if (answers) {
            if (answers.space1) {
                spaces.space1.selection = answers.space1;
            }
    
            if (answers.space2) {
                spaces.space2.selection = answers.space2;
            }
        }

        formatJoke();
    }

    function makeSelections() {
        let answers = {};

        for (const space in spaces) {
            const ranNum = Math.floor(Math.random() * spaces[space].options.length);
            answers[space] = spaces[space].options[ranNum];
        }

        updateJoke(answers);
    }

    return { 
        getJokeDetails,
        updateJoke,
        makeSelections,
    };
}

let jokes = (function() {
    let jokesList = [];
    let currentJokeNum = 0;

    // Init
    for(const joke in jokeListArr) {
        const newJoke = Joke(jokeListArr[joke])
        jokesList.push(newJoke);
    }
    
    function getJokesList() {
        return jokesList;
    } 

    function getCurrentJoke() {
        const currentJoke = jokesList[currentJokeNum];
        return Object.assign(currentJoke, {jokeNumber: currentJokeNum + 1});
    }

    function previousJoke() {
        if (currentJokeNum > 0) {
            currentJokeNum -= 1;
        }
    }

    function nextJoke() {
        if (currentJokeNum < jokesList.length) {
            currentJokeNum += 1
        }
    }

    return {
        getJokesList,
        getCurrentJoke,
        previousJoke,
        nextJoke,
    };

})();

let displayController = (function() {

    // Cache DOM
    const app = document.getElementById('app');

    // Init
    renderTitleScreen();

    // Methods
    function renderTitleScreen() {
        let div = document.createElement('div');
        div.id = 'title-div';

        let h1 = document.createElement('h1');
        h1.textContent = 'Maths Joke Generator!'
        div.appendChild(h1);

        let startButton = document.createElement('button');
        startButton.id = 'start-button';
        startButton.textContent = 'Bring On the Jokes!'
        div.appendChild(startButton);

        app.appendChild(div);

        // Event listeners
        document.querySelector('#start-button').addEventListener('click', renderJoke);
    }

    function renderJoke() {
        app.innerHTML = ''; 
        const joke = jokes.getCurrentJoke();
        const jokeDetails = joke.getJokeDetails();

        // Title
        const titleDiv = document.createElement('div');
        titleDiv.id = 'joke-title-div';
        titleDiv.classList.add('center-content-div');

        const h1 = document.createElement('h1');
        h1.textContent = `Joke ${joke.jokeNumber}`
        titleDiv.appendChild(h1);

        // Question
        const jokeQuestionDiv = document.createElement('div');
        jokeQuestionDiv.classList.add('center-content-div');
        const p = document.createElement('p');
        p.innerHTML = jokeDetails.formattedJoke;
        jokeQuestionDiv.appendChild(p);

        // Options
        const jokeOptionsDiv = document.createElement('div');
        jokeOptionsDiv.id = 'joke-options-div';

        for (const space in jokeDetails.spaces) {
            const jokeOptionDiv = document.createElement('div');
            jokeOptionDiv.id = `joke-option-${space.slice(-1)}`
            jokeOptionDiv.classList.add('joke-option-div');
            
            const selectTitleDiv = document.createElement('div');
            selectTitleDiv.classList.add('joke-option-title');
            selectTitleDiv.textContent = `Blank ${space.slice(-1)}`;
            jokeOptionDiv.appendChild(selectTitleDiv)

            const selectContentDiv = document.createElement('div');
            selectContentDiv.classList.add('joke-option-content');

            if (jokeDetails.spaces[space].selection) {
                selectContentDiv.textContent = jokeDetails.spaces[space].selection;
                
            } else {
                selectContentDiv.textContent = 'Spin to select!';
            }
            
            jokeOptionDiv.appendChild(selectContentDiv);
            jokeOptionsDiv.appendChild(jokeOptionDiv);
        }

        // Controls
        const controlsDiv = document.createElement('div');
        controlsDiv.id = 'controls-div';
        controlsDiv.classList.add('center-content-div');

        const backButton = document.createElement('button');
        backButton.id = 'back-button';
        backButton.textContent = '< Previous Joke'
        controlsDiv.appendChild(backButton);
        if (jokes.getCurrentJoke().jokeNumber <= 1) {
            backButton.disabled = true;
        }
        
        const stopButton = document.createElement('button')
        stopButton.id = 'spin-button';
        stopButton.textContent = 'Spin!';
        controlsDiv.appendChild(stopButton)

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next Joke >'
        nextButton.id = 'next-button';
        controlsDiv.appendChild(nextButton);
        if (jokes.getCurrentJoke().jokeNumber >= jokes.getJokesList().length) {
            nextButton.disabled = true;
        }

        app.appendChild(titleDiv);
        app.appendChild(jokeQuestionDiv);
        app.appendChild(jokeOptionsDiv);
        app.appendChild(controlsDiv);

        // Event listeners
        document.querySelector('#spin-button').addEventListener('click', spin);
        document.querySelector('#back-button').addEventListener('click', () => {
            jokes.previousJoke();
            renderJoke();
        });
        document.querySelector('#next-button').addEventListener('click', () => {
            jokes.nextJoke();
            renderJoke();
            
        });

    }

    function spin() {
        const spinButton = document.querySelector('#spin-button')
        spinButton.removeEventListener('click', spin);
        spinButton.textContent = 'Stop!';

        let spinTracker = {};

        const optionDivs = document.querySelectorAll('.joke-option-div');
        optionDivs.forEach(div => {
            const divNum = div.id.slice(-1);
            spinTracker[div.id] = {
                max: jokes.getCurrentJoke().getJokeDetails().spaces['space' + divNum].options.length - 1,
                current: 0
            };
        });

        let spinInterval = setInterval(() => {
            optionDivs.forEach(div => {
                const currentOption = spinTracker[div.id].current;
                const divNum = div.id.slice(-1);
                div.querySelector('.joke-option-content').textContent = jokes.getCurrentJoke().getJokeDetails().spaces['space' + divNum].options[currentOption];

                if (spinTracker[div.id].current >= spinTracker[div.id].max) {
                    spinTracker[div.id].current = 0;
                } else {
                    spinTracker[div.id].current += 1;
                }
            });
        }, 500);

        document.querySelector('#back-button').disabled = true;
        document.querySelector('#next-button').disabled = true;

        spinButton.addEventListener('click', () => {
            clearInterval(spinInterval);
            jokes.getCurrentJoke().makeSelections();
            displayController.renderJoke();
        })
    }

    return {
        renderTitleScreen,
        renderJoke,
    };

})();
