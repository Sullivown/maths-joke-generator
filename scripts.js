const Joke = (questionContent, space1Options, space2Options) => {
    let spaces = {
        'space1': { 'options': space1Options, 'selection': null },
        'space2': { 'options': space2Options, 'selection': null }
    };
    let formattedJoke = '';

    // Init
    updateJoke();
    formatJoke();

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
            if (answers.selection1) {
                spaces.space1.selection = answers.selection1;
            }
    
            if (answers.selection2) {
                spaces.space2.selection = answers.selection2;
            }
        }

        formatJoke();
    }

    return { 
        getJokeDetails,
        updateJoke
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
        startButton.textContent = 'Bring On the Jokes!'
        div.appendChild(startButton);

        app.appendChild(div);

        // Event listeners
        document.querySelector('button').addEventListener('click', renderJoke);
    }

    function renderJoke() {
        app.innerHTML = ''; 
        const joke = jokes.getCurrentJoke();
        const jokeDetails = joke.getJokeDetails();

        let titleDiv = document.createElement('div');

        let h1 = document.createElement('h1');
        h1.textContent = `Joke ${joke.jokeNumber}`
        titleDiv.appendChild(h1);

        let jokeQuestionDiv = document.createElement('div');
        let p = document.createElement('p');
        p.textContent = jokeDetails.formattedJoke;
        jokeQuestionDiv.appendChild(p);

        let jokeOptionsDiv = document.createElement('div');

        if (jokeDetails.space1) {
            let jokeOptionDiv = document.createElement('div');
            jokeOptionDiv.textContent = 'JOKE OPTIONS!';

            jokeOptionsDiv.appendChild(jokeOptionDiv);
        }

        let controlsDiv = document.createElement('div');

        app.appendChild(titleDiv);
        app.appendChild(jokeQuestionDiv);
        app.appendChild(jokeOptionsDiv);
        app.appendChild(controlsDiv);

    }

    return {
        renderTitleScreen,
        renderJoke,
    };

})();