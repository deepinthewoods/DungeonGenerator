import styled from 'styled-components'

const UP = 1, DOWN = 2, LEFT = 4, RIGHT = 8, DISABLED = 16;

const getTile = (x, y, w, tiles) => {
    if (x > w) return -1
    if (y > tiles.length / w) return -1
    if (x < 0 || y < 0) return -1
    return tiles[x + (y * w)]
}

const offsetsFromMask = (mask) => {
    var ret = []
    if (mask & DOWN) ret.push([0, 1])
    if (mask & UP) ret.push([0, -1])
    if (mask & RIGHT) ret.push([1, 0])
    if (mask & LEFT) ret.push([-1, 0])
    return ret

}


const doorClickHandler = (x, y, w, doorMasks, setTile, setDoorMasks) => {
    // var x = e.target.getAttribute("x")
    // var y = e.target.getAttribute("y")
    // var w = e.target.getAttribute("w")
    // var doorMasks = e.target.getAttribute("doorMasks")
    var door = getTile(x, y, w, doorMasks)
    //console.log("start " + door)
    var newDoorMasks = doorMasks.map((e) => e)
    var offsets = offsetsFromMask(door)
    offsets.push([0, 0])
    
    if (door & DISABLED){
        
        for (var off of offsets){
            setTile(x+off[0], y+off[1], w, newDoorMasks, getTile(x+off[0], y+off[1], w, doorMasks) & 15)
            //console.log("close " + (door & 15))
        }
        
    } 
    else{
        for (var off of offsets){

            setTile(x+off[0], y+off[1], w, newDoorMasks, getTile(x+off[0], y+off[1], w, doorMasks) | DISABLED)
            //console.log("open " + (door | DISABLED))
        }
        // alert("door dis " + door + " => " + (door | DISABLED) + " = " + getTile(x, y, w, newDoorMasks) + "(" + x + "," + y )
    } 
    setDoorMasks(newDoorMasks)
}

const Span = styled.span`
    width: ${(props) => 95/props.width}vmin;
    height: ${(props) => 95/props.width}vmin;
    
`

const tile = (props) => {
    return <Span width={props.width} className={props.className} onClick={() => {doorClickHandler(props.x, props.y, props.width, props.doorMasks, props.setTile, props.setDoorMasks)}}>{props.children}</Span>
}

export default tile