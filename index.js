/**
 * USELESS FOR NOW
 */
let avail=new Set(["N","Q","K","B","R"]);
class Piece{

}
class Pawn{
    constructor(color,location){
      
        this.color=color;
        this.location=location;
        this.promoted=false;
        this.start=true;
    }
    move(move){
        location=move;
        start=false;
    }
}
class Board{
    constructor (){
        this.board = Array(8).fill(null).map(() => Array(8).fill(null));
        this.locations = new Set();
        for(let i=0;i<8;i++){
            this.board[6][i]=new Pawn("b",String.fromCharCode(i+97)+"7");

            this.board[1][i]=new Pawn("w",String.fromCharCode(i+97)+"2");
        }

    }
    print(){
        for(let i=7;i>=0;i--){
            console.log(this.board[i]);
        }
        console.log("\n");
    }
    chessToArr(loc){ //loc string
        return([loc[1]-1,loc[0].charCodeAt(0)-97]);
    }
    arrToChess(loc){//Loc array
        return(String.fromCharCode(loc[1]+97)+(loc[0]+1));
    }
    move(color,action){
        if(!avail.has(action[0])){
            action="P"+action;
        } 
        let toLocation= action.slice(-2);
        let going=this.chessToArr(toLocation);
        let piece=this.locate(color,action,going);
        console.log(piece);
        if(piece==null){
            return;
        }else{
            let current=this.chessToArr(piece.location);
            piece.location= toLocation;
            this.board[current[0]][current[1]]=null;
            this.board[going[0]][going[1]]= piece;
        }

    }
    inBetweenLook(from, to,capture){
        if(Math.abs(from[0]-to[0])==Math.abs(from[1]-to[1])){
            //diag
        }else if(from[0]-to[0]==0){
            //hori
        }else if(from[1]-to[1]==0){
            //vert

            for(let i=Math.min(from[0],to[0])+1;i<Math.max(from[0],to[0]);i++){
                if(this.board[i][to[1]]!=null){
                    return 1;
                }
            }
            if(!capture){
                if(this.board[to[0]][to[1]]!=null){
                    return 1;
                }
            }
            return 0;
        }else{
            return 1;
        }
    }
    locate(color,action,going){
        let piece=null;
        let capture=0;
        if(action.includes("x")){
            capture=1;
        }
        if(action[0]=="P"){
            if(color=="w"){
                if(this.board[going[0]-2][going[1]] instanceof Pawn){
                    piece=this.board[going[0]-2][going[1]];
                    console.log(piece);
                    if(piece.start){
                        piece.start=false;
                    }else{
                        return null;

                    }
                }
                else if((this.board[going[0]-1][going[1]]) instanceof Pawn){
                    piece=this.board[going[0]-1][going[1]];
                    piece.start=false;
                } 
            }else{
                if(this.board[going[0]+2][going[1]] instanceof Pawn){
                    piece=this.board[going[0]+2][going[1]];
                    if((piece).start){
                        piece.start=false;
                    }else{
                        return null;
                    }
                }
                else if((this.board[going[0]+1][going[1]]) instanceof Pawn){
                    piece=this.board[going[0]+1][going[1]];
                    piece.start=false;
                } 
            }
            if(this.inBetweenLook(this.chessToArr(piece.location),going,capture)){
                return null;
            }
            return piece;
        }
    }
}
let game=new Board();
game.print();
let color=["w","b"];
game.move(color[1],"a5");
game.print();
game.move(color[1],"a4");
game.print();
game.move(color[1],"a3");
game.print();
game.move(color[1],"a2");
game.print();
game.move(color[0],"a3");
game.print();
game.move(color[0],"e3");
game.print();
game.move(color[0],"e5");
game.print();
/*
Ne4
Nxe4
e4
dxe4
*/