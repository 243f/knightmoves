class Puzzle {
    constructor(boardSelector, config) {
        config = config || {};
        config['startingPosition'] = config['startingPosition'] || {'d5': 'bQ', 'h8': 'wN'};
        config['randomize'] = config['randomize'] || false;
        config['onTargetReached'] = config['onTargetReached'] || (x=>x);
        this._config = config;
        this._boardSelector = boardSelector;
        this._board = $('#board');
        this._initialize();
    };

    _initialize = function () {
        this._state = {
            'start': this._getKnight(this._config.startingPosition),
            'target': null,
            'path': null,
            'time': null
        };
        this._history = [];

        function isLegalKnightMove(game, source, target) {
            return game.knight_moves(source).indexOf(target) !== -1;
        }

        function onDragStart(source, piece, position, orientation) {
            return piece === 'wN';
        }

        function onDrop (source, target, piece) {
            if (!isLegalKnightMove(this._game, source, target))
                return 'snapback';
            if (source !== target) {
                this._state.path.push(target);
            }
            if (target == this._state.target) {
                this._onTargetReached();
            }
        }

        const config = {
            draggable: true,
            onDragStart: onDragStart,
            onDrop: onDrop.bind(this)
        }

        const board = ChessBoard(this._boardSelector, config);
        board.position(this._config.startingPosition);
        this._game = new Game(board);
        this._avail = this._game.available_squares();
        const orderSquares = this._config['randomize'] ? this._shuffle : this._sort;
        orderSquares(this._avail);
        this._setChallenge();
    }

    _sort = function (arr) {
        arr.sort((a,b) => str_to_n(a)-str_to_n(b));
    }

    _shuffle = function (arr) {
        console.log(arr);
        const n = arr.length;
        for (let i=n; i>0; i--) {
            let j = Math.floor(Math.random()*i);
            if (i !== j) {
                const temp = arr[j];
                arr[j] = arr[i];
                arr[i] = temp;
            }
        }
    }

    _onTargetReached = function () {
        const state = Object.fromEntries(Object.entries(this._state));
        state.best_path = bfs(state.start, state.target, this._game.knight_moves.bind(this._game));
        state.best_path.push(state.target);
        state.time = Date.now()-state.time;
        this._history.push(state);

        this._setChallenge(state.target);

        this._config.onTargetReached(state, this._history);
    }

    _setTarget = function (sq) {
        this._board.find('.highlight-yellow').removeClass('highlight-yellow');
        this._board.find('.square-'+sq).addClass('highlight-yellow');
    }

    _getKnight = function (pos) {
         return Object.keys(pos)[Object.values(pos).indexOf('wN')];
    }

    _setChallenge = function (start) {
        const pos = Object.fromEntries(Object.entries(this._config['startingPosition']));
        start = start || this._getKnight(pos);
        if (start) {
            pos[start] = 'wN';
            this._board.position(pos, false);
            this._state.start = start;
        }

        let sq = this._avail.pop();
        if (sq === start)
            sq = this._avail.pop();

        this._state.target = sq;
        this._state.path = [start];
        this._state.time = Date.now();

        this._setTarget(sq);
    }

    //public
    restart = function() {
    }

    //public
    hint = function() {
    }
};
