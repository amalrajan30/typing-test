import * as React from 'react';
import './App.css';
import Typing from './components/Typing';
import CommonWords from './data/commonWords.json'

function App() {
	const [currentWords, setCurrentWords] = React.useState(20)
	const words = CommonWords.commonWords.sort(() => 0.5 - Math.random()).slice(0, 200).map(word => `${word} `)

	return (
		<div className="App">
			<Typing typingPara={words.slice(0, currentWords)} words={true} />
		</div>
	);
}

export default App;
