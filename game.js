const startPosition = {'d5': 'bQ', 'f6': 'wP'};
const $board = $('#board');
const $hist = $('#history');
const state = {
    'start': null,
    'target': null,
    'path': null,
    'time': null
};
const history = [];

function isLegalKnightMove(source, target) {
    return game.knight_moves(source).indexOf(target) !== -1;
}

function onDragStart(source, piece, position, orientation) {
    return piece === 'wN';
}

function onDrop (source, target, piece) {
    if (!isLegalKnightMove(source, target))
        return 'snapback';
    if (source !== target) {
        state.path.push(target);
    }
    if (target == state.target) {
        onReachedTarget();
    }
}

function setTarget(sq) {
    $board.find('.highlight-yellow').removeClass('highlight-yellow');
    $board.find('.square-'+sq).addClass('highlight-yellow');
}

function onReachedTarget() {
    const _state = Object.fromEntries(Object.entries(state));
    _state.best_path = bfs(_state.start, _state.target, game.knight_moves.bind(game));
    _state.best_path.push(_state.target);
    _state.time = Date.now()-_state.time;
    history.push(_state);

    setChallenge(state.target);
    renderHistory();
}

function setChallenge(start) {
    const pos = Object.fromEntries(Object.entries(startPosition));
    pos[start] = 'wN';
    board.position(pos, false);

    let sq = game.random_square();
    while (sq === state.target) {
        sq = game.random_square();
    }

    state.start = start;
    state.target = sq;
    state.path = [start];
    state.time = Date.now();

    setTarget(sq);
}

function renderHistory() {
    let html = '<table><tr><th>N</th><th>Count</th><th>Path</th><th>Time</th></tr>'

    history.forEach((x,i)=>{
        let row = '<tr><td>';
        row += i+1;
        row += '</td><td>';
        row += x.path.length-1;
        row += '<br>';
        row += x.best_path.length-1;
        row += '</td><td>';
        row += x.path.join('->');
        row += '<br>'
        row += x.best_path.join('->');
        row += '</td><td>';
        row += x.time/1000 + 'seconds';
        row += '</td></tr>';
        html += row;
    });

    html += '</table>';
    $hist.html(html);
}


const config = {
    draggable: true,
    onDragStart: onDragStart,
    onDrop: onDrop
}

const board = ChessBoard("board", config);
board.position(startPosition);
const game = new Game(board);
setChallenge('h8');
