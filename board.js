//Board to keep track of squares and stuff
class Board{
    constructor (){
        this.squareBoard = Array(8).fill(null).map(() => Array(8).fill(null));
        this.highlightedSquare = null;
        this.redHighlightedSquares = new Set();
        this.arrowSet=new Map;
        this.possiList=new Set();
        this.kings=["74","04"]//White black
        this.kingMoved=[false,false];
        this.turn=true; //White=true;
        this.promoPiece=null;
        this.enPassantable=null;
        this.moveNote="";
        this.moveNumber=1;
        this.gameOver=false;
        this.flip=false;
        this.boardPositions = {}; //for threefold
        this.rookMoved=new Set();

    }
    print(){
        for(let i=0;i<8;i++){
            console.log(this.squareBoard[i]);
        }
        console.log("\n");
    }
}
let game=new Board();
export default game;