import logo from './logo.svg';
import './App.css';
import Dungeon from './dungeon'
import MonsterGenerator from './monsterGenerator'

function App() {
  return (
    <div className="App">
      <header className="App-header">
      Dungeon Generator 
      </header>
      <Dungeon width={20} height= {20} seed={220}/>
      <MonsterGenerator />

    </div>
  );
}

export default App;
