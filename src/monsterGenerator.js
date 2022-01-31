import React, { useEffect } from 'react'
import MonsterTable from './monsterTable'




const MonsterGenerator = (props) => {
    const xpByCharLevel = [
        [0, 0, 0, 0]
        , [25, 50, 75, 100]//1
        , [50, 100, 150, 200]
        , [75, 150, 225, 400]
        , [125, 250, 375, 500]
        , [250, 500, 750, 1100]
        , [300, 600, 900, 1400]
        , [350, 750, 1100, 1700]
        , [450, 900, 1400, 2100]//8
        , [550, 1100, 1600, 2400]
        , [600, 1200, 1900, 2800]//10
        , [800, 1600, 2400, 3600]
        , [1000, 2000, 3000, 4500] 
        , [1100, 2200, 3400, 5100]
        , [1250, 2500, 3800, 5700]
        , [1400, 2800, 4300, 6400]
        , [1600, 3200, 4800, 7200]
        , [2000, 3900, 5900, 8800]
        , [2100, 4200, 6300, 9500]
        , [2400, 4900, 7300, 10900]
        , [2800, 5700, 8500, 12700]//20
    ]
    
    const [compensate, setCompensate] = React.useState( props.compensate)
    const [seed, setSeed] = React.useState(props.seed)
    const [players, setPlayers] = React.useState(props.players)
    const [playerLevel, setPlayerLevel] = React.useState(props.playerLevel)
    const [charLevels, setCharLevels] = React.useState([1,1,1,1])
    const [environmentString, setEnvironmentString] = React.useState(props.environmentString)
    const [maxMonsters, setMaxMonsters] = React.useState(10)
    const [difficulty, setDifficulty] = React.useState(1)
    //from https://makeaskillcheck.com/5e-how-does-cr-work/
    
    React.useEffect(() => {
        //console.log("change params")
        setCompensate(props.compensate)
        setSeed(props.seed)
        setPlayers(props.players)
        setPlayerLevel(props.playerLevel)
        //setCharLevels(props.charLevels)
        setEnvironmentString(props.environmentString)
        
       
    }
        , [props.compensate, props.seed, props.players, props.playerLevel, props.charLevels, props.environmentString, props.maxMonsters, props.difficulty])
    
    const environment = props.environment


    const setCharLevelArray = () => {
        var arr = []
        for (var i = 0; i < players; i++){
            arr.push(playerLevel)
            //console.log("playerl " + playerLevel)
        }
        setCharLevels(arr)
    }
    useEffect(() => {
        setCharLevelArray()
    }, [players, playerLevel])

    var xpTargets = [0,0,0,0];
    for (var i = 0; i < charLevels.length; i++){
        for (var t = 0; t < 4; t++){
        xpTargets[t] += xpByCharLevel[charLevels[i]][t];
        //console.log("mul " + xpTargets[t] )
        }
        //console.log(" ")
    }
//    
    

    const generate = () => {
        setSeed(Math.floor(Math.random() * 100000))
    }
    return <div className="container">
        
        <div >
            {/* <div>
            Compensate for Action Economy <input type="checkbox" checked = {compensate} onChange={(event) => {setCompensate(event.target.checked)}} />
            </div> */}
            <div>
            Players: <input type="number" min="1" max="20" value={players} onChange = {(event) => {setPlayers(event.target.value); }}/>
            x Level <input type="number" min="1" max="20" value={playerLevel} onChange = {(event) => {setPlayerLevel(event.target.value);}}/>
            </div>

            <div>
                Max Monsters: <input type="number" min="1" max="30" value={maxMonsters} onChange = {(event) => {setMaxMonsters(event.target.value)}} />
            </div>

            <div>
                Difficulty
                <select onChange={(event) => {setDifficulty(event.target.value); localStorage.setItem("difficulty", difficulty)}} value = {difficulty}>
                    <option value="0">Easy</option>
                    <option value="1">Normal</option>
                    <option value="2">Hard</option>
                    <option value="3">Deadly</option>
                </select>
            </div>

            <div>
                Environment
                <select onChange= {(event) => {setEnvironmentString(event.target.value)} } value={environmentString}>
                    <option value="forest">Forest</option>
                    <option value="underground">Underground</option>
                    <option value="swamp">Swamp</option>
                    <option value="desert">Desert</option>
                    <option value="cave">Cave</option>
                    <option value="dungeon">Dungeon</option>
                    <option value="planar">Planar</option>
                    <option value="grassland">Grassland</option>
                    <option value="mountain">Mountain</option>
                    <option value="ruins">Ruins</option>
                    <option value="aquatic">Aquatic</option>
                    <option value="urban">Urban</option>
                    <option value="arctic">Arctic</option>
                    <option value="coast">Coast</option>
                    
                </select>
            </div>
            <div>
                <button onClick={generate}>Generate</button>
            </div>
        </div>

        <div>
            <MonsterTable environmentString={environmentString} environment = {environment} max={maxMonsters} difficulty = {difficulty} xpTargets={xpTargets} adjust={compensate} seed = {seed}/>
        </div>
        
        </div>

}

export default MonsterGenerator;