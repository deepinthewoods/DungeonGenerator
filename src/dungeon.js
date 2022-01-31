import React from 'react'
import random from 'random-seed'
import PF from 'pathfinding'
import Tile from './tile'
import styled from 'styled-components'
import {FaBeer} from 'react-icons/fa'

/* 
:root {
    --tile-size: 1rem;
  }

  .tile0 {
 
  border-radius: 1.5rem .125rem 1.2rem .125rem/ .125rem 1.52rem .125rem 1.82rem;
  border-width: 1.4px 1px 1.1px 1.6px;
 
}
  */


const TILE_EMPTY = 0
const TILE_PATH = 2
const ICON_ROOM_NUMBER = 1
const roomColors = ["white", "pink", "light-green", "light-blue"]

const setTile = (x, y, w, tiles, val) => {
    tiles[x + (y * w)] = val
}
const setTileOr = (x, y, w, tiles, val) => {
    tiles[x + (y * w)] |= val
}
const setTileSquare = (x, y, w, tiles, val, width, height) => {
    for (let xo = 0; xo < width; xo++)
        for (let yo = 0; yo < height; yo++)
            setTile(x+xo, y+yo, w, tiles, val)
}
const isEmpty = (x, y, w, tiles, width, height) => {
    if (x + width > w-1) return false;
    if (y + height > (tiles.length / w)-1) return false
    if ( x < 1 || y < 1) return false
    for (let xo = 0; xo < width; xo++)
        for (let yo = 0; yo < height; yo++)
            if (getTile(x+xo, y+yo, w, tiles) !== 0) return false;
    return true;
}
const isEmptyDir = (x, y, w, tiles, width, height, dirX, dirY) => {
    //dir is negative
    if (dirX === 0){
        x -= Math.floor(width/2)
        if (dirY === 1) y -= height-1
    } else {
        y -= Math.floor(height/2)
        if (dirX === 1) x -= width-1
    }
    if (x + width > w-1) return false
    if (y + height > (tiles.length / w)-1) return false
    if (x < 1 || y < 1) return false
    for (let xo = 0; xo < width; xo++)
        for (let yo = 0; yo < height; yo++)
            if (getTile(x+xo, y+yo, w, tiles) !== 0) return false;
    return true;
}
const setTileSquareDir = (x, y, w, tiles, val, width, height, dirX, dirY) => {
    if (dirX === 0){
        x -= Math.floor(width/2)
        // console.log("compensate x " + (Math.floor(width/2)) + " w " + width)

        if (dirY === 1) y -= height-1
    } else {
        y -= Math.floor(height/2)
        if (dirX === 1) x -= width-1
    }
    for (let xo = 0; xo < width; xo++)
        for (let yo = 0; yo < height; yo++)
            setTile(x+xo, y+yo, w, tiles, val)
}
const getTile = (x, y, w, tiles) => {
    if (x > w) return -1
    if (y > tiles.length / w) return -1
    if (x < 0 || y < 0) return -1
    return tiles[x + (y * w)]
}

const getFeature = (random, dX, dY, mapWidth, mapHeight) => {
    var fw, fh
    var feature = (x, y, fw, fh, dirX, dirY, mapWidth, roomID, t, random) => {

    };
    switch (random.intBetween(0, 4)){
        default:
        //room
            fw =  random.intBetween(3,  Math.floor(mapWidth/2));
            fh =  random.intBetween(3, Math.floor(mapHeight/2));
            feature = (x, y, fw, fh, dirX, dirY, roomID, mapWidth, t, random, doorMasks, icons) => {
                setTileSquareDir(x, y, mapWidth, t, roomID, fw, fh,  dirX, dirY)
                // setTile(x, y, mapWidth, t, 1)
                // setTileOr(x, y, mapWidth, doors, bitmaskFrom(dirX, dirY))
                setTileOr(x,y,mapWidth, doorMasks, bitmaskFrom(dirX, dirY))
                setTileOr(x+dirX,y+dirY,mapWidth, doorMasks, reverseBitmaskFrom(dirX, dirY))

                // setTileOr(x-((fw*dirX)/2), y-((fh*dirY)/2), mapWidth, icons, ICON_ROOM_NUMBER)
                var cx = Math.floor(fw * dirX * .5 - (.5 * dirX))
                var cy = Math.floor(fh * dirY * .5 - (.5 * dirY))
                // cx = 0
                // cy = 0
                setTileOr(x-cx, y-cy, mapWidth, icons, ICON_ROOM_NUMBER)
                return roomID+1
            }
            break;
        case 0://passage
                return getRoad(random, dX, dY, mapWidth, mapHeight, mapWidth/2) 
            break;
        //case 2:
            break;
    }
    return [feature, fw, fh]
}

const getRoad = (random, dX, dY, mapWidth, mapHeight, maxLength) => {
    var fw, fh
    var feature
                fw =  random.intBetween(2,  Math.floor(maxLength));
                fh =  random.intBetween(2, Math.floor(maxLength));
                
                if (dX !== 0){
                    fh = 3
                    feature = (x, y, fw, fh, dirX, dirY, roomID, mapWidth, t, random, doorMasks, icons) => {
                        setTileSquareDir(x, y, mapWidth, t, 2, fw, fh-2,  dirX, dirY)
                        var toTile = getTile(x+dirX, y+dirY, mapWidth, t)
                        if (toTile !== 2) {
                            // setTile(x, y, mapWidth, t, 1)
                            setTileOr(x,y,mapWidth, doorMasks, bitmaskFrom(dirX, dirY))
                            setTileOr(x+dirX,y+dirY,mapWidth, doorMasks, reverseBitmaskFrom(dirX, dirY))
                        }
                        return roomID
                    }  
                } else {
                    fw = 3
                    feature = (x, y, fw, fh, dirX, dirY, roomID, mapWidth, t, random, doorMasks, icons) => {
                        setTileSquareDir(x, y, mapWidth, t, 2, fw-2, fh,  dirX, dirY)
                        var toTile = getTile(x+dirX, y+dirY, mapWidth, t)
                        if (toTile !== 2)  {
                            // setTile(x, y, mapWidth, t, 1)
                            setTileOr(x,y,mapWidth, doorMasks, bitmaskFrom(dirX, dirY))
                            setTileOr(x+dirX,y+dirY,mapWidth, doorMasks, reverseBitmaskFrom(dirX, dirY))
                        }
                        return roomID
                    }  
                }
            
    
    return [feature, fw, fh]
}

const UP = 1, DOWN = 2, LEFT = 4, RIGHT = 8, DISABLED = 16;
const bitmaskFrom = (dx, dy) => {
    if (dx === -1) return LEFT
    if (dx === 1) return RIGHT
    if (dy === 1) return DOWN
    if (dy === -1) return UP
}
const reverseBitmaskFrom = (dx, dy) => {
    if (dx === 1) return LEFT
    if (dx === -1) return RIGHT
    if (dy === -1) return DOWN
    if (dy === 1) return UP
}
const calculateBitmasks = (t, masks, w, h) => {
    for (var x = 1; x < w-1; x++)
        for (var y = 1; y < h-1; y++){
            var mask = 0;
            var tile = getTile(x, y, w, t)
            if (getTile(x,y+1,w,t) != tile)
                mask += DOWN;
            if (getTile(x,y-1,w,t) != tile)
                mask += UP;
            if (getTile(x+1,y,w,t) != tile)
                mask += RIGHT;
            if (getTile(x-1,y,w,t) != tile)
                mask += LEFT
            setTile(x,y,w, masks, mask)
            // setTile(x, y, w, masks, 15)
        }
}

const randomizeDraw = (w, draw, rand) => {
    var h = Math.floor(draw.length/w)
    for (var x = 1; x < w-1; x+=1)
        for (var y = 1; y < h-1; y+=1){
            var yOffset = y%2
            if ((x+yOffset)%2) continue
            
            if (rand.range(2)) 
            setTileOr(x, y, w, draw, UP)
            else 
            setTileOr(x, y-1, w, draw, DOWN)

            if (rand.range(2)) 
            setTileOr(x, y, w, draw, DOWN)
            else 
            setTileOr(x, y+1, w, draw, UP)

            if (rand.range(2)) 
            setTileOr(x, y, w, draw, LEFT)
            else 
            setTileOr(x-1, y, w, draw, RIGHT)

            if (rand.range(2)) 
            setTileOr(x, y, w, draw, RIGHT)
            else 
            setTileOr(x+1, y, w, draw, LEFT)
            // setTile(x, y, w, draw, 15)
            
            // console.log("x:"+x+" y:"+y + " h"+h +" w"+w)
        }
}

const findWall = (t, mapWidth, mapHeight, rand) => {
            var wallFound = false
            var wallTries = 0
            var wallX = 0
            var wallY = 0
            var wallDirX = 0
            var wallDirY = 0
            while (!wallFound && wallTries++ < 100){
                var x = rand.intBetween(1, mapWidth-2)
                var y = rand.intBetween(1, mapHeight-2)
                if (getTile(x,y,mapWidth, t) === 0){
                    var dx = -1
                    var dy = 0
                    wallX = x
                        wallY = y
                    if (getTile(x+dx,y+dy,mapWidth, t) !== 0){
                        wallFound = true
                        wallDirX = dx
                        wallDirY = dy
                    } else {
                        dx = 1
                        if (getTile(x+dx,y+dy,mapWidth, t) !== 0){
                            wallFound = true
                            wallDirX = dx
                            wallDirY = dy
                        } else {
                            dx = 0
                            dy = 1
                            if (getTile(x+dx,y+dy,mapWidth, t) !== 0){
                                wallFound = true
                                wallDirX = dx
                                wallDirY = dy
                            } else {
                                dy = -1
                                if (getTile(x+dx,y+dy,mapWidth, t) !== 0){
                                    wallFound = true                                  
                                    wallDirX = dx
                                    wallDirY = dy
                                }
                            }
                        } 
                    }
                    
                }
            }
            return [wallFound, wallX, wallY, wallDirX, wallDirY]
}



const Dungeon = (props) => {
    const [tiles, setTiles] = React.useState([])
    const [bitmasks, setBitmasks] = React.useState(null)
    const [doorMasks, setDoorMasks] = React.useState(null)
    const [drawMasks, setDrawMasks] = React.useState(null)
    const [icons, setIcons] = React.useState(null)
    const [selectedRoom, setSelectedRoom] = React.useState(0)
    //const [grid, setGrid] = React.useState(new PF.grid(props.width, props.height))
    
    React.useEffect(() => {
        const rand = random.create(props.seed)
        var mapWidth = props.width
        var mapHeight = props.height
        const t = []
        const masks = []
        const doorMasks = []
        const newDrawMasks = []
        const icons = []
        //setGrid(new PF.grid(props.width, props.height))

        for (var x = 0; x < props.width; x++){
            for (var y = 0; y < mapHeight; y++){
                t.push(rand.range(0))    
                masks.push(0)
                doorMasks.push(0)
                newDrawMasks.push(0)
                icons.push(0)
            }
        }
        //setTile(1,1,props.width, t, 1);

        var roomID = 3;

        // for (var tries = 0; tries < 100; tries++){
        //     var x = rand.range(mapWidth)
        //     var y = rand.range(mapHeight)
        //     var w = rand.intBetween(3, mapWidth/2);
        //     var h = rand.intBetween(3, mapHeight/2);
        //     if (isEmpty(x, y, mapWidth, t, w, h)){
        //         console.log("draw room " + x + " " + y + " w " + w + " h " + h)
        //         setTileSquare(x, y, mapWidth, t, roomID++, w, h)
        //         if (roomID > 7) roomID = 7
        //     }
        // }

//      Fill the whole map with solid earth
//      Dig out a single room in the centre of the map
        {
            var w = rand.intBetween(3, mapWidth/2);
            var h = rand.intBetween(3, mapHeight/2);
            var x = Math.floor(mapWidth/2)-Math.floor(w/2)
            var y = Math.floor(mapHeight/2)-Math.floor(h/2)
            // x = 0
            // y = 1
            // w = mapWidth
            // h = 1
            // console.log("start pos " + x + ", " + y)s
            setTileSquare(x, y, mapWidth, t, roomID++, w, h)
            setTileOr(x+Math.floor(w/2), y+Math.floor(h/2), mapWidth, icons, ICON_ROOM_NUMBER)

        }

        for (var tries = 0; tries < 2; tries++){
            //      Pick a wall of any room
                        var [wallFound, wallX, wallY, wallDirX, wallDirY] = findWall(t, mapWidth, mapHeight, rand)
                        if (wallFound){
            //      Decide upon a new feature to build
                            var [feature, fw, fh] = getRoad(rand, wallDirX, wallDirY, mapWidth, mapHeight, mapWidth/2)
            //      See if there is room to add the new feature through the chosen wall
                            if (isEmptyDir(wallX, wallY, mapWidth, t, fw, fh, wallDirX, wallDirY)){
                                //      Add the feature through the chosen wall
                                roomID = feature(wallX, wallY, fw, fh, wallDirX, wallDirY, roomID, mapWidth, t, rand, doorMasks)
                            }
                        }
                    }

        for (var tries = 0; tries < mapWidth*mapHeight*2; tries++){
//      Pick a wall of any room
            var [wallFound, wallX, wallY, wallDirX, wallDirY] = findWall(t, mapWidth, mapHeight, rand)
            if (wallFound){
//      Decide upon a new feature to build
                var [feature, fw, fh] = getFeature(rand, wallDirX, wallDirY, mapWidth, mapHeight)
//      See if there is room to add the new feature through the chosen wall
                if (isEmptyDir(wallX, wallY, mapWidth, t, fw, fh, wallDirX, wallDirY)){
                    //      Add the feature through the chosen wall
                    roomID = feature(wallX, wallY, fw, fh, wallDirX, wallDirY, roomID, mapWidth, t, rand, doorMasks, icons)
                }
            }
        }
//      Add the up and down staircases at random points in map
//      Finally, sprinkle some monsters and items liberally over dungeon

        setTiles(t)
        calculateBitmasks(t, masks, mapWidth, mapHeight)
        randomizeDraw(mapWidth, newDrawMasks, rand)
        setDrawMasks(newDrawMasks)
        setBitmasks(masks)
        setDoorMasks(doorMasks)
        setIcons(icons)
        // console.log("make map")

    }, [props.seed, props.width, props.height])


    const [_, forceUpdate] = React.useReducer((x) => x + 1, 0);

    const tileEntries = []
    var height = Math.floor(tiles.length / props.width)
    var allTiles = []
    const rand = random.create(props.seed)

    let onSelectRoom = (id) => {
        setSelectedRoom(id)
    }

    for (var y = 0; y < height; y++){
        var row = [];
        var w = props.width
        
        for (var x = 0; x < props.width; x++){
            var tile = getTile(x, y, w, tiles)
            var bitmask = getTile(x, y, w, bitmasks)
            // bitmask = 15
            var tileID = (x + y) % 4;
            tileID = rand.intBetween(0, 3)
        
            // tileID = 5
            //var on = (x+y)%2
            var on = getTile(x, y, w, drawMasks)
            // on = 15
            var door = getTile(x, y, w, doorMasks)
            // tileID = 3
            var className = "tile" + tileID + " tilebase "
            className += " roomColor" + Math.min(tile, 3)
            if (!(bitmask & UP) || (!(on & UP) && y >1)){
                className += " tilenoborderT"
            } 
            if (!(bitmask & DOWN) || (!(on & DOWN) && y < height-2)) {
                className += " tilenoborderB"
            }
            if (!(bitmask & LEFT) || (!(on & LEFT) && x > 1)) {
                className += " tilenoborderL"
            }
            if (!(bitmask & RIGHT) || (!(on & RIGHT) && x < w-2)) {
                className += " tilenoborderR"
            }

            if (door & UP) {
                className += " tiledoorT"
                if ((door & DISABLED))
                 className += " tilenoborderT"
            }
            if (door & DOWN){
                className += " tiledoorB"
                if ((door & DISABLED))
                 className += " tilenoborderB"
            }
            if (door & LEFT){
                className += " tiledoorL"
                if ((door & DISABLED))
                 className += " tilenoborderL"
            }
            if (door & RIGHT){
                className += " tiledoorR"
                if ((door & DISABLED))
                 className += " tilenoborderR"
            }

            const iconElements = []
            // iconElements.push(<div class="icon">{" "}</div>)
            var icon = getTile(x, y, w, icons)
            if (icon & ICON_ROOM_NUMBER){
                const roomID = tile;
                iconElements.push(<div className="icon" roomID = {tile} >{tile}</div>)
            }

            // const Icon = styled.span`
            //     width: ${(props) => 95/props.width}vmin;
            //     height: ${(props) => 95/props.width}vmin;
                
            // `
            // iconElements.push(<FaBeer className="icon" ></FaBeer>)
            
            // row.push
            allTiles.push
            (<Tile width={props.width}
                className={className}
                x = {x} y = {y} w = {w} doorMasks= {doorMasks} setDoorMasks= {setDoorMasks} setTile = {setTile} tiles= {tiles} onSelectRoom = {onSelectRoom}

                >{iconElements} </Tile>)
        }
        // tileEntries.push(<div>{row}</div>)
    }
    
    // width: ${(props) => 95/props.width}vmin;
    // height: ${(props) => 95/props.width}vmin;
    const Div = styled.div`
    grid-template-rows: repeat(${(props) => props.width}, 1fr);
    grid-template-columns: repeat(${(props) => props.height}, 1fr);
`
    //var tileSize = 1/props.width;
   //tileEntries
    return <div>
        <Div className="tile-container" width= {props.width} height={props.height}>
        
        {allTiles}
       
    
        </Div>
        {props.encounterGenerators[selectedRoom]}
        </div>
}

export default Dungeon