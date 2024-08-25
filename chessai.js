import pgnBuilder from './pgn.js';
const stockfish = new Worker('stockfish-nnue-16-single.js');
let suggest="";
let aiPlaying=false;
let aiColor=false;//true=white;
let double=false;
let turn=true;//true=white;
let utterance;
let time;


document.addEventListener('playerConfigSet', function(event) {
    const whitePlayerType = event.detail.white;
    const blackPlayerType = event.detail.black;

    console.log(`White Player: ${whitePlayerType}`);
    console.log(`Black Player: ${blackPlayerType}`);

    if (whitePlayerType === 'ai'&&blackPlayerType === 'ai') {
        aiPlaying=true;
        double=true;
        
    }
    else if (blackPlayerType === 'ai') {
        aiPlaying=true;
        aiColor=false;
    }
    else if(whitePlayerType === 'ai'){
        aiPlaying=true;
        aiColor=true;
    }
    stockfish.postMessage(`position startpos moves ${pgnBuilder.uci}`);
    stockfish.postMessage('go depth 5');

});

function AiPlay(from, to,promo){
    if(aiPlaying&&(aiColor==turn||double)&&pgnBuilder.result==""){
        setTimeout(() => {
            from.dispatchEvent(new MouseEvent('mousedown', {button: 0, }));
            to.dispatchEvent(new MouseEvent('mousedown', {button: 0, }));
        }, 500);
        if(promo!=null){
            //console.log((turn?"w":"b")+promo.toUpperCase());
            setTimeout(() => {
                const opt=document.querySelector(`[class~=promotion-option][data-piece="${(turn?"w":"b")+promo.toUpperCase()}"]`);
                //console.log(opt);
                opt.click();
            }, 1000);
            
        }
        const speech=document.querySelector(`[class~=toggled][id="toggleButton"]`);
        setTimeout(() => {
            if(speech!=null){
                speakMove(pgnBuilder.last);
            }
        }, 500);
    }
}

function speakMove(moveText) {
    moveText=translate(moveText);
    utterance = new SpeechSynthesisUtterance(moveText);
    time=estimateDuration(moveText);
    console.log("say: "+moveText);
    
    const event = new CustomEvent('aiSpeaking', {
        detail:{
            time: time,
            repeat:false
        }
        
    });
    document.dispatchEvent(event);
    utterance.rate=0.8;
    window.speechSynthesis.speak(utterance);

}
document.addEventListener('keydown', function(event) {//repeat

    if ((event.key === 'x' || event.key === 'X')&&utterance) { 
        const event = new CustomEvent('aiSpeaking', {
            detail:{
                time: time,
                repeat: true
            }
        });
        document.dispatchEvent(event);
        window.speechSynthesis.speak(utterance);
    }
});
function estimateDuration(text) {
    const averageWordsPerMinute = 170; // Average speaking rate
    const words = text.split(' ').length;
    
    const minutes = words / averageWordsPerMinute;
    const milliseconds = minutes * 60000; // Convert minutes to milliseconds

    return milliseconds-1000;
}
function translate(moveText) {
    const translations = {
        "a": "Hay",
        "b":"B",
        "c": "C",
        "d":"D",
        "e":"E",
        "f":"F",
        "g":"G",
        "h":"H",
        "x": "takes",
        "N": "knight",
        "Q": "queen",
        "B": "bishop",
        "R": "rook",
        "K": "king",
        "-O": "long",
        "O-O": "castle",
        "": "short",
        "=": "promote", 
        "#": "checkmate",
        "+": "check"
    };
    
    let result = '';
    let i = 0;

    while (i < moveText.length) {
        let found = false;
        for (let length = 3; length > 0; length--) {
            const substring = moveText.substring(i, i + length);
            if (translations.hasOwnProperty(substring)) {
                result += translations[substring]+' ';
                i += length;
                found = true;
                break;
            }
        }
        if (!found) {
            result += moveText[i]+ ' ';
            i++;
        }
    }

    return result;
}
stockfish.onmessage = function(event) {
    const message = event.data;
    if (message.startsWith('bestmove')) {
        //console.log('Best move:', message.split(' ')[1]);
        suggest=message.split(' ')[1];
        const from = document.querySelector(`[data-chess="${suggest[0]}"][data-chess-c="${suggest[1]}"]`);
        const to=document.querySelector(`[data-chess="${suggest[2]}"][data-chess-c="${suggest[3]}"]`);
        const promo=suggest[4];
        AiPlay(from,to,promo);
    } else{
        //console.log(message);
    }
};
pgnBuilder.addEventListener('gameUpdated', (event) => {
    stockfish.postMessage(`position startpos moves ${pgnBuilder.uci}`);
    stockfish.postMessage('go depth 5');
    turn=!turn;

});
stockfish.postMessage('uci');
stockfish.postMessage('setoption name Skill Level value 0');//SKILL
stockfish.postMessage('ucinewgame');  
stockfish.postMessage('isready'); 



/*TODO
 Assist for where a specific piece is
*/

/*DID
Window for ai vs human
Text to Speech
Toggle mute button
*/