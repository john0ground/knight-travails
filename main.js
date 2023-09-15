class chessGraph {
    constructor() {
        this.visitedSquares = new Map();
        this.currentLevel = [];

        this.startingSquare = '';
        this.targetSquare = '';
        this.found = false;
    }

    //  vertex
    addSquare(s) {
        this.visitedSquares.set(s, []);
    }

    //  connection between squares, first index will be the parent
    addEdge(s1, s2) {
        this.visitedSquares.get(s1).push(s2);
        this.visitedSquares.get(s2).push(s1);
    }

    knightMoves(x, y, fn) {
        //  top and right directions
        fn(x-1, y+2, `${x}${y}`);
        fn(x+1, y+2, `${x}${y}`);
        fn(x+2, y+1, `${x}${y}`);
        fn(x+2, y-1, `${x}${y}`);
    
        //  bottom and left directions
        fn(x+1, y-2, `${x}${y}`);
        fn(x-1, y-2, `${x}${y}`);
        fn(x-2, y-1, `${x}${y}`);
        fn(x-2, y+1, `${x}${y}`);
    }

    //  method for seeking the 8 squares the knight can move, adding those
    //  squares the knight haven't visited yet.
    discoverSquares = (x, y, parent) => {
        if (x < 0 || x > 7) return;
        if (y < 0 || y > 7) return;
        x = `${x}`;
        y = `${y}`;

        if (this.targetSquare === x+y) this.found = true;

        // prevent repeating squares to visitedSquares object.
        let alreadyVisited = false;
        const getSquares = this.visitedSquares.keys();

        for (const square of getSquares) {
            if (square === x+y) {
                alreadyVisited = true;
                break;
            }
        }
    
        if (alreadyVisited === true) return;

        this.addSquare(x+y);
        this.addEdge(x+y, parent);
        this.currentLevel.push(x+y);  //  the first seeked squares will be the next level order.
    }

    travelKnight(x,y) {
        //  1st level order knight moves
        this.startingSquare = `${x}${y}`;
        this.addSquare(`${x}${y}`);
        this.knightMoves(x,y, this.discoverSquares);  
        if (this.found === true) return this.getCoordinates();

        //  run knightMoves to next level order until targetSquare is found.
        const nextLevelOrder = () => {
            //  copy the current visited squares array and reset for the next level order
            const nextSquares = [...this.currentLevel];
            this.currentLevel.length = 0;

            //  seek other unvisited squares from the current level order
            let i = 0;
            while(i < nextSquares.length) {
                if (this.found === true) return this.getCoordinates();

                const x = parseInt(nextSquares[i][0]);
                const y = parseInt(nextSquares[i][1]);

                this.knightMoves(x,y, this.discoverSquares);
                i++;
            }

            //  the current level order don't have the target square, run the next level order.
            nextLevelOrder();
        }
   
        return nextLevelOrder();
    }

    //  if variable 'found' is true, this will traverse the chessGraph from
    //  the targeted square to the starting square node.
    traversePath(vertex) {
        if (vertex === this.startingSquare) return vertex;
        let path = vertex + '-';

        const parent = this.visitedSquares.get(vertex)[0];  
        path += this.traversePath(parent);

        return path;
    }

    getCoordinates() {
        const coordinates = this.traversePath(this.targetSquare)
                            .split('-')
                            .reverse();

        console.log(coordinates);
        //   animate knight traversal

        this.resetGraph();
    }

    resetGraph() {
        this.visitedSquares.clear();
        this.currentLevel = [];
        this.targetSquare = '';
        this.found = false;
    }

    printGraph() {
        const getKeys = this.visitedSquares.keys();

        for (const i of getKeys) {
            const getValues = this.visitedSquares.get(i);
            let conc = '';

            getValues.forEach(v => {
                conc += v + ' ';
            });

            console.log(i + '->' + conc);
        }
    }
}

const board = new chessGraph();

board.targetSquare = '00';
board.travelKnight(7, 7);

// board.printGraph();


function displayBoard() {
    let i = 1;
    let background = 'light';
    let x = 0, y = 7;

    while (i <= 64) {
        const square = document.createElement('div');
        square.setAttribute('data-coordinate', `${x}${y}`);
        x++;
        chessboard.appendChild(square);

        if (background === 'light') {
            square.classList.add('light');
            background = 'dark';
        } else {
            square.classList.add('dark');
            background = 'light';
        }

        
        if (i % 8 === 0) {
            background === 'light'?
            background = 'dark':
            background = 'light';

            x = 0;
            y--;
        }
        i++;
    }
};

displayBoard();
