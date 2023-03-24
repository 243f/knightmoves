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
