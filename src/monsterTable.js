import { useEffect } from "react";
//import tsv from './kfc.tsv'
import React from 'react'
import Random from 'random-seed'

const MonsterTable = (props) => {
  //console.log("draw monster table")
    
  const multipliers = [1, 1, 1.5, 2, 2, 2, 2, 2.5, 2.5, 2.5, 2.5, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4]

  const [xp, setXP] = React.useState(0)
  const [list, setList] = React.useState([])
  React.useEffect(() => {
    var list = [];
    var xp = 0;
    var done = false;
    if (!props.environment){
      //console.log("no env") 
      return
    } 
    
    var env = props.environment.get(props.environmentString);
    var tries = 0;
    var random = Random.create(props.seed)
    //console.log("recalc list" +props.environmentString)
  
    while (env && !done && tries++ < 10000){
      var index = random(env.length)
      var mon = env[Math.floor(index)]
      //console.log("try " + index + " " + env.length)
      if (mon.xp > props.xpTargets[props.difficulty] - xp * (props.adjust?multipliers[list.length+1]:1)){
        // console.log("early exit" + list.length)
        continue;
      }
      else {
        list.push(mon);
        xp += mon.xp;
        while (xp * (props.adjust?multipliers[list.length]:1) > props.xpTargets[props.difficulty] || list.length > props.max){
          var diff = xp * (props.adjust?multipliers[list.length]:1) - props.xpTargets[props.difficulty]
          //remove smallest xp larger than diff
          var smallest = 1000000;
          var smallestI = -1;
          for (var i = 0; i < list.length; i++){
            var m = list[i];
            if (m.xp < smallest){
              smallest = m.xp;
              smallestI = i;
            }
          }
          //console.log("remove " + list.length)
          xp -= list[smallestI].xp;
          list.splice(smallestI, 1);
        }
        if (xp * (props.adjust?multipliers[list.length]:1) > props.xpTargets[props.difficulty] * 0.8){
          done = true;
          // console.log("done " + list.length)
        }else {
          // console.log("not done " + list.length)
        }

      } 
    }
    setXP(xp)
    setList(list)
  }, [ props.xpTargets, props.seed, props.max, props.environmentString]);

  const copyMonster = (e) => {
    const newList = list.map((el) => {
      return el
    })
    setXP(xp + list[e.target.id].xp)
    newList.push(list[e.target.id])
    setList(newList);
    // console.log("copy monster " + e.target.id)
  }
  const removeMonster = (e) => {
    const newList = list.map((el) => {
      return el
    })
    setXP(xp - list[e.target.id].xp)
    newList.splice(e.target.id, 1)
    setList(newList);
    // console.log("copy monster " + e.target.id)
  }

  var i =0;
  var monsters = list.map((e) => {
    const el = <div  key={i} className="results">{e.name} ({e.xp}) <button id={i} onClick={copyMonster}>+</button> <button id={i} onClick={removeMonster}>-</button></div>
    i++
    return el
  })
  const progressValue = [0,0,0,0]
  for (var i = 0; i < 4; i++){
    progressValue[i] = xp * (props.adjust?multipliers[list.length]:1)
  }
  return <div >
      XP: {xp} * {(props.adjust?multipliers[list.length]:1)} = {xp * (props.adjust?multipliers[list.length]:1)} / {props.xpTargets[props.difficulty]}
      
      {monsters}
      <div>
        XP: {xp}
      </div>

      <div className = "flex-container">
        <div className="column-container">
          <meter max={props.xpTargets[0]} min = {0} value={progressValue[0]}></meter>
          Easy
          <br/>({props.xpTargets[0]})
        </div>
        <div className="column-container">
          <meter max={props.xpTargets[1]} min = {props.xpTargets[0]} value={progressValue[1]}></meter>
          Normal
          <br/>({props.xpTargets[1]})
        </div>
        <div className="column-container">
          <meter max={props.xpTargets[2]} min = {props.xpTargets[1]} value={progressValue[2]}></meter>
          Hard
          <br/>({props.xpTargets[2]})     
        </div>
        <div className="column-container">
          <meter max={props.xpTargets[3]} min = {props.xpTargets[2]} value={progressValue[3]}></meter>
          Deadly
          <br/>({props.xpTargets[3]})
        </div>
      </div>
      
      
      
  </div>
    
}

export default MonsterTable;