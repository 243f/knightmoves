function shuffle(arr) {
    const n = arr.length;
    for (let i=n; i>0; i--) {
        j = Math.floor(Math.random()*i);
        if (i !== j) {
            const temp = arr[j];
            arr[j] = arr[i];
            arr[i] = temp;
        }
    }
}

function bfs(start, stop, adjc) {
    if (start === stop) {
        return []
    }
    const visited = [start]
    const queue = [[start, [start]]]

    while (queue.length) {
        const qi = queue.shift();
        const square = qi[0];
        const path = qi[1];

        const moves = adjc(square);
        for (let i=0; i<moves.length; i++) {
            const move = moves[i];
            if (move === stop) {
                return path;
            }
            if (visited.indexOf(move) === -1) {
                queue.push([move, path.concat(move)]);
                visited.push(move);
            }
        }
    }
}
