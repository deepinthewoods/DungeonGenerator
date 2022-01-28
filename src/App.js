import logo from './logo.svg';
import './App.css';
import Dungeon from './dungeon'
import MonsterGenerator from './monsterGenerator'
import Papa from 'papaparse'
import React from 'react'

function App() {

  const crToXP = new Map();
  crToXP.set("0", 10)
  crToXP.set("1/8", 25)
  crToXP.set("1/4", 50)
  crToXP.set("1/2", 100)
  crToXP.set("1", 200)
  crToXP.set("2", 450)
  crToXP.set("3", 700)
  crToXP.set("4", 1100)
  crToXP.set("5", 1800)
  crToXP.set("6", 2300)
  crToXP.set("7", 2900)
  crToXP.set("8", 3900)
  crToXP.set("9", 5000)
  crToXP.set("10", 5900)
  crToXP.set("11", 7200)
  crToXP.set("12", 8400)
  crToXP.set("13", 10000)
  crToXP.set("14", 11500)
  crToXP.set("15", 13000)
  crToXP.set("16", 15000)
  crToXP.set("17", 18000)
  crToXP.set("18", 20000)
  crToXP.set("19", 22000)
  crToXP.set("20", 25000)
  crToXP.set("21", 33000)
  crToXP.set("22", 41000)
  crToXP.set("23", 50000)
  crToXP.set("24", 62000)
  crToXP.set("30", 155000)

  const [environment, setEnvironment] = React.useState(new Map())
    React.useEffect(() => {
        async function getData() {
            const response = await fetch('/kfc.tsv')
            //console.log(response.text)
            const reader = response.body.getReader()
            const result = await reader.read() // raw array
            const decoder = new TextDecoder('utf-8')
            const csv = decoder.decode(result.value) // the csv text
            const results = Papa.parse(csv, { header: true }) // object with { data, errors, meta }
            const rowsV = results.data// array of objects
            const environments = new Map();
            
            rowsV.map((e) => {
                if (!e.environment) return
                const envs = e.environment.split(",")
                envs.map((en) => {
                en = en.replace(/\s/g, '')
                if (!environments.has(en)){
                    var newArr = new Array();
                    environments.set(en, newArr);
                    // console.log ( "new " + en  )
                }
                
                //console.log ( "write " + en )
                //console.log ( "write " + e.cr )
                e.xp = crToXP.get(e.cr);
                if (en) environments.get(en).push(e)
                //if (!e) console.log("error")

                })
            })
            setEnvironment(environments)
            console.log("done reading tsv")
        }
        getData()
    // setInterval(() => {console.log(rows)}, 2000)
    }, []) // [] means just do this once, after initial render

  return (
    <div className="App">
      <header className="App-header">
      Dungeon Generator 
      </header>

      <Dungeon width={20} height= {20} seed={220}/>
      <MonsterGenerator  environment = {environment}/>

    </div>
  );
}

export default App;
