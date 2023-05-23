function str_to_coord(s) {
    return ['abcdefgh'.indexOf(s[0]), '12345678'.indexOf(s[1])];
}

function str_to_n(s) {
    const c = str_to_coord(s);
    return xy_to_n(c[0], c[1]);
}

function coord_to_str(c) {
    return 'abcdefgh'[c[0]] + '12345678'[c[1]];
}

function n_to_str(n) {
    const x = n % 8;
    const y = Math.floor(n / 8);
    return coord_to_str([x,y]);
}

function xy_to_n(x,y) {
    return x + 8*y;
}

function getKnight(pos) {
     return Object.keys(pos)[Object.values(pos).indexOf('wN')];
}

function shuffle(arr) {
    const n = arr.length-1;
    for (let i=n; i>0; i--) {
        const j = Math.floor(Math.random()*i);
        if (i !== j) {
            const temp = arr[j];
            arr[j] = arr[i];
            arr[i] = temp;
        }
    }
}

function bfs(start, stop, adjc) {
    if (start === stop) {
        return [];
    }
    const visited = [start];
    const queue = [[start, [start]]];

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

function bfsAll(start, adjc) {
    const visited = [start];
    const queue = [start];

    while (queue.length) {
        const square = queue.shift();

        const moves = adjc(square);
        for (let i=0; i<moves.length; i++) {
            const move = moves[i];
            if (visited.indexOf(move) === -1) {
                queue.push(move);
                visited.push(move);
            }
        }
    }

    return visited;
}
