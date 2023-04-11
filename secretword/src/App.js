// CSS
import './App.css';

// REACT
import { useCallback, useEffect, useState } from 'react';

// DATA
import { wordsList } from './data/words';

// COMPONENTS
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

// Estágio para saber em qual parte do jogo esta
const stages = [
  { id: 1, name: 'start' },
  { id: 2, name: 'game' },
  { id: 3, name: 'end' }
];

const guessesQty = 4;

function App() {

  const [gameStage, setGamestage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWords, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickedWordAndCategory = useCallback(() => {
    // Seleciona as categorias
    const categories = Object.keys(words);

    // Pega uma categoria aleatória
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];
    console.log(category)

    // Pega uma palavra aleatótia
    const word = words[category][Math.floor(Math.random() * words[category].length)]
    console.log(word);

    return { word, category };
  }, [words])

  // Começa o jogo e primeira função para mudar de tela (game)
  const startGame = useCallback(() => {
    // Apaga todas as letras
    clearLetterStates();

    // Escolhe palavra e categoria
    const { word, category } = pickedWordAndCategory();

    // Array de letras
    let wordLetters = word.split("")
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    console.log(word, category)
    console.log(wordLetters);


    // Setar estados
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGamestage(stages[1].name);
  }, [pickedWordAndCategory])

  // Processa a letra do input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    // Checa se a letra ja foi utilizada
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }

    // Inclui letras adivinhadas ou erradas para seus devidos lugares
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        letter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  // Monitora um dado / Quando todas as chances forem todas perdidas retorna para a página final do jogo
  useEffect(() => {
    if (guesses <= 0) {
      // Função para comecar o jogo zerado
      clearLetterStates();

      setGamestage(stages[2].name)
    }
  }, [guesses]);

  // Checa condição de vitória
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    // Condição de vitoria
    if (guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name) {
      // Adiciona score
      setScore((actualScore) => actualScore += 100);

      // Restarta jogo com nova palavra
      startGame();
    }


  }, [guessedLetters, letters, startGame]);

  // Reinicia o jogo
  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)
    setGamestage(stages[0].name);
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && <Game verifyLetter={verifyLetter}
        pickedWords={pickedWords}
        pickedCategory={pickedCategory}
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score} />}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
