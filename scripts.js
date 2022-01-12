const Joke = function() {
    let argsArr = Array.from(arguments);
    let questionContent = argsArr[0];
    let spaces = {};
    let formattedJoke = '';

    // Init
    initializeSpaces();
    updateJoke();
    formatJoke();

    function initializeSpaces() {
        let spacesObj = argsArr.reduce((obj, item, currentIndex) => {
            if (currentIndex === 0) {
                return obj;
            }

            obj['space' + currentIndex] = { 'options': item.split(','), 'selection': null }

            return obj;
        }, {})

        spaces = spacesObj;
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

            return jokeAnswerSpace ? jokeAnswerSpace : '__________';
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
        answers = {};

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
    currentJokeNum = 0;

    // Init
    const joke1 = Joke(
        'I Iike my *space1* like I like my *space2*...',
        'maths problems,data analysis,maths textbooks,Chalkdust articles',
        'bananas,knickerbocker glories,wellington boots,prime ministers,reality TV shows,pets'
    );
    jokesList.push(joke1);

    const joke2 = Joke(
        'asdasdadsadsa *space1* asdasdasadaads',
        'maths problems,data analysis,maths textbooks,Chalkdust articles',
    );
    jokesList.push(joke2);

    function getJokesList() {
        return jokesList;
    } 

    function getCurrentJoke() {
        const currentJoke = jokesList[currentJokeNum];
        return Object.assign(currentJoke, {jokeNumber: currentJokeNum + 1});
    }

    return {
        getJokesList,
        getCurrentJoke,
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

        const h1 = document.createElement('h1');
        h1.textContent = `Joke ${joke.jokeNumber}`
        titleDiv.appendChild(h1);

        // Question
        const jokeQuestionDiv = document.createElement('div');
        const p = document.createElement('p');
        p.textContent = jokeDetails.formattedJoke;
        jokeQuestionDiv.appendChild(p);

        // Options
        const jokeOptionsDiv = document.createElement('div');

        for (const space in jokeDetails.spaces) {
            const jokeOptionDiv = document.createElement('div');
            jokeOptionDiv.id = `joke-option-${space.slice(-1)}`
            jokeOptionDiv.classList.add('joke-option-div');
            jokeOptionDiv.textContent = jokeDetails.spaces[space].options;

            jokeOptionsDiv.appendChild(jokeOptionDiv);
        }

        // Controls
        const controlsDiv = document.createElement('div');
        const stopButton = document.createElement('button')
        stopButton.id = 'spin-button';
        stopButton.textContent = 'Spin!';

        controlsDiv.appendChild(stopButton)

        app.appendChild(titleDiv);
        app.appendChild(jokeQuestionDiv);
        app.appendChild(jokeOptionsDiv);
        app.appendChild(controlsDiv);

        // Event listeners
        document.querySelector('#spin-button').addEventListener('click', spin)

    }

    function spin() {
        const spinButton = document.querySelector('#spin-button')
        spinButton.removeEventListener('click', spin);
        spinButton.textContent = 'Stop!';

        let currentOption = 0;
        setInterval(() => {
            const optionDivs = document.querySelectorAll('.joke-option-div');
            optionDivs.forEach(div => {
                const divNum = div.id.slice(-1);
                div.textContent = jokes.getCurrentJoke().getJokeDetails().spaces['space' + divNum].options[currentOption];
            })
            
            currentOption += 1;
        }, 1000)


        spinButton.addEventListener('click', () => {
            jokes.getCurrentJoke().makeSelections();
            displayController.renderJoke();
        })
    }

    return {
        renderTitleScreen,
        renderJoke,
    };

})();