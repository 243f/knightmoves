class Puzzle {
    constructor(boardSelector, config) {
        this._boardSelector = boardSelector;
        this._board = $(this._boardSelector);
        this.restart(config);
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
            onDrop: onDrop.bind(this),
        }

        const board = ChessBoard(this._boardSelector, config);
        board.position(this._config.startingPosition);
        this._game = new Game(board);
        this._avail = bfsAll(this._getKnight(this._config.startingPosition), this._game.knight_moves.bind(this._game));
        this._avail = this._avail.filter(x=>x!==this._getKnight(this._config.startingPosition));
        const orderSquares = this._config['randomize'] ? this._shuffle : this._sort;
        orderSquares(this._avail);
        this._setChallenge();
    }

    _sort = function (arr) {
        arr.sort((a,b) => str_to_n(a)-str_to_n(b));
    }

    _shuffle = function (arr) {
        console.log('sfhuffle start', arr);
        const n = arr.length-1;
        for (let i=n; i>0; i--) {
            let j = Math.floor(Math.random()*i);
            if (i !== j) {
                const temp = arr[j];
                arr[j] = arr[i];
                arr[i] = temp;
            }
        }
        console.log('sfhuffle stop', arr);
    }

    _onTargetReached = function () {
        const state = Object.fromEntries(Object.entries(this._state));
        state.best_path = bfs(state.start, state.target, this._game.knight_moves.bind(this._game));
        state.best_path.push(state.target);
        state.time = Date.now()-state.time;
        this._history.push(state);

        const complete = this._setChallenge(state.target);

        complete ? this._config.onComplete(this._history) :
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
        if (!sq) {
            return true;
        }
        if (sq === start)
            sq = this._avail.pop();

        this._state.target = sq;
        this._state.path = [start];
        this._state.time = Date.now();

        this._setTarget(sq);
        return false;
    }

    //public
    restart = function(config) {
        config = config || {};
        config['startingPosition'] = config['startingPosition'] || {'d5': 'bQ', 'h8': 'wN'};
        config['randomize'] = config['randomize'] || false;
        config['onTargetReached'] = config['onTargetReached'] || (x=>x);
        this._config = config;
        this._initialize();
    }

    //public
    hint = function() {
        const start = this._getKnight(this._game._board.position());
        return bfs(start, this._state.target, this._game.knight_moves.bind(this._game));
    }

    clearHighlights = function (color) {
    }

    highlight = function (square, color) {
    }
};
