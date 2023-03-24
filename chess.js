function str_to_coord(s) {
    return ['abcdefgh'.indexOf(s[0]), '12345678'.indexOf(s[1])]
}

function str_to_n(s) {
    c = str_to_coord(s);
    return xy_to_n(c[0], c[1]);
}

function coord_to_str(c) {
    return 'abcdefgh'[c[0]] + '12345678'[c[1]]
}

function n_to_str(n) {
    const x = n % 8;
    const y = Math.floor(n / 8);
    return coord_to_str([x,y]);
}

function xy_to_n(x,y) {
    return x + 8*y;
}

class Game {
    constructor(board) {
        this._board = board;
        this._disallow = new Set();

        const position = this._board.position();
        const entries = Object.entries(position);

        console.log('entries', entries);
        for (let i=0; i<entries.length; i++) {
            const entry = entries[i];
            if (entry[1] === 'bQ') {
                const qp = entry[0];
                const q = str_to_coord(qp);
                const qx = q[0];
                const qy = q[1];

                for (let i=0; i<8; i++) {
                    this._disallow.add(xy_to_n(qx,i))
                    this._disallow.add(xy_to_n(i,qy))
                    this._disallow.add(xy_to_n(i,i+(qy-qx)))
                    this._disallow.add(xy_to_n((qy+qx)-i,i))
                }
            }
            if (entry[1] === 'wP') {
                this._disallow.add(str_to_n(entry[0]));
            }
        }
    }

    knight_moves = function (from) {
        const pos = str_to_coord(from);
        const px = pos[0];
        const py = pos[1];

        const arr =  [[px+2, py+1],
                      [px+2, py-1],
                      [px+1, py+2],
                      [px+1, py-2],
                      [px-1, py+2],
                      [px-1, py-2],
                      [px-2, py+1],
                      [px-2, py-1]];

        return arr.filter(x=> x[0] >= 0 && x[1] >= 0)
                  .filter(x=> x[0] <= 7 && x[1] <= 7)
                  .map(x=>xy_to_n(x[0], x[1]))
                  .filter(x=>!this._disallow.has(x))
                  .map(n_to_str);
    }

    available_squares = function() {
        return Array(64).fill(0).map((_,i)=>i)
                         .filter(x=>!this._disallow.has(x))
                         .map(n_to_str);
        }

    random_square = function() {
        const squares = Array.from(this.available_squares());
        return squares[Math.floor(Math.random()*squares.length)];
    }
};
