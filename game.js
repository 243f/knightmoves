class Game {
  constructor (board) {
    this._board = board;
    this._disallow = new Set();
    const position = this._board.position();
    delete position[Object.keys(position)[Object.values(position).indexOf('wN')]];

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const sq = n_to_str(xy_to_n(x, y));
        if (position[sq] === 'bR' || position[sq] === 'bQ') {
          for (let i = x + 1; i < 8; i++) {
            const sqj = n_to_str(xy_to_n(i, y));
            if (position[sqj]) {
              break;
            }
            this._disallow.add(xy_to_n(i, y));
          }
          for (let i = x - 1; i >= 0; i--) {
            const sqj = n_to_str(xy_to_n(i, y));
            if (position[sqj]) {
              break;
            }
            this._disallow.add(xy_to_n(i, y));
          }
          for (let i = y + 1; i < 8; i++) {
            const sqj = n_to_str(xy_to_n(x, i));
            if (position[sqj]) {
              break;
            }
            this._disallow.add(xy_to_n(x, i));
          }
          for (let i = y - 1; i >= 0; i--) {
            const sqj = n_to_str(xy_to_n(x, i));
            if (position[sqj]) {
              break;
            }
            this._disallow.add(xy_to_n(x, i));
          }
          this._disallow.add(xy_to_n(x, y));
        }
        if (position[sq] === 'bB' || position[sq] === 'bQ') {
          for (let i = 1; i < 8; i++) {
            const sqj = n_to_str(xy_to_n(x + i, y + i));
            if (x + i > 7 || y + i > 7 || position[sqj]) {
              break;
            }
            this._disallow.add(xy_to_n(x + i, y + i));
          }
          for (let i = 1; i < 8; i++) {
            const sqj = n_to_str(xy_to_n(x - i, y - i));
            if (x - i < 0 || y - i < 0 || position[sqj]) {
              break;
            }
            if (position[sqj]) {
              break;
            }
            this._disallow.add(xy_to_n(x - i, y - i));
          }
          for (let i = 1; i < 8; i++) {
            const sqj = n_to_str(xy_to_n(x + i, y - i));
            if (x + i > 7 || y - i < 0 || position[sqj]) {
              break;
            }
            this._disallow.add(xy_to_n(x + i, y - i));
          }
          for (let i = 1; i < 8; i++) {
            const sqj = n_to_str(xy_to_n(x - i, y + i));
            if (x - i < 0 || y + i > 7 || position[sqj]) {
              break;
            }
            if (position[sqj]) {
              break;
            }
            this._disallow.add(xy_to_n(x - i, y + i));
          }
          this._disallow.add(xy_to_n(x, y));
        } else if (position[sq] === 'bK') {
          this._disallow.add(xy_to_n(x - 1, y - 1));
          this._disallow.add(xy_to_n(x, y - 1));
          this._disallow.add(xy_to_n(x + 1, y - 1));

          this._disallow.add(xy_to_n(x - 1, y));
          this._disallow.add(xy_to_n(x, y));
          this._disallow.add(xy_to_n(x + 1, y));

          this._disallow.add(xy_to_n(x - 1, y + 1));
          this._disallow.add(xy_to_n(x, y + 1));
          this._disallow.add(xy_to_n(x + 1, y + 1));
        } else if (position[sq] === 'bN') {
          this._disallow.add(xy_to_n(x - 2, y - 1));
          this._disallow.add(xy_to_n(x - 2, y + 1));

          this._disallow.add(xy_to_n(x - 1, y - 2));
          this._disallow.add(xy_to_n(x - 1, y + 2));

          this._disallow.add(xy_to_n(x + 1, y - 2));
          this._disallow.add(xy_to_n(x + 1, y + 2));

          this._disallow.add(xy_to_n(x + 2, y - 1));
          this._disallow.add(xy_to_n(x + 2, y + 1));

          this._disallow.add(xy_to_n(x, y));
        } else if (position[sq] === 'bP') {
          this._disallow.add(xy_to_n(x - 1, y - 1));
          this._disallow.add(xy_to_n(x + 1, y - 1));

          this._disallow.add(xy_to_n(x, y));
        } else if (position[sq] && position[sq][0] === 'w') {
          this._disallow.add(xy_to_n(x, y));
        }
      }
    }
  }

  knight_moves (from) {
    const pos = str_to_coord(from);
    const px = pos[0];
    const py = pos[1];

    const arr = [[px + 2, py + 1],
      [px + 2, py - 1],
      [px + 1, py + 2],
      [px + 1, py - 2],
      [px - 1, py + 2],
      [px - 1, py - 2],
      [px - 2, py + 1],
      [px - 2, py - 1]];

    return arr.filter(x => x[0] >= 0 && x[1] >= 0)
      .filter(x => x[0] <= 7 && x[1] <= 7)
      .map(x => xy_to_n(x[0], x[1]))
      .filter(x => !this._disallow.has(x))
      .map(n_to_str);
  }
}
