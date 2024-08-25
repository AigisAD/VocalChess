let recognition = null;
let keepon=false;
let acted=false;
let targetWords=["knight", "bishop", "king", "queen", "rook",
"castle", "long", "short", "equal","takes", "promote", "check","checkmate",
"a","b","c","d","e","f","g","h",
"1","2","3","4","5","6","7","8"];

const startRecognition = () => {
    if (recognition) {
        recognition.stop(); 
        acted=false;
        
    }
    recognition = new webkitSpeechRecognition(); // Initialize SpeechRecognition object
    recognition.interimResults = true;
  
    recognition.onstart = () => {
        console.log('Speech recognition started');
        recognition.grammars = new webkitSpeechGrammarList();
        const grammar = '#JSGF V1.0; grammar targetWords; public <targetWord> = ' + targetWords.join(' | ') + ' ;';
        recognition.grammars.addFromString(grammar, 1);
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        let check=[];
        const field=document.getElementById('moveInput');
        
        field.value=transcript.toLowerCase();
        field.classList.remove('invalid-input');
        if(event.results[0].isFinal){
            acted=true;
            console.log(transcript);
            check=field.value.split(" ");
            let correctedTranscripts = check.map(transcript => {
                const closestMatch = findClosestMatch(transcript, targetWords);
                return closestMatch ? closestMatch : transcript;
            });
            translate(correctedTranscripts);
            var enterKey = new KeyboardEvent("keydown", {
                key: "Enter",
                keyCode: 13,
              });
            field.value=correctedTranscripts.join("");
            field.dispatchEvent(enterKey);
        }
        

    };
  
    recognition.onerror = (event) => {
    
        //console.error('Speech recognition error:', event.error); 
        
    };
    recognition.onend = () => {
        console.log('Speech recognition ended');
        if(document.getElementById('toggleButton').classList.contains('toggled')&&keepon&&(recognition)){
            try{recognition.start()} catch(error){};
        }
        else if(!acted&&document.getElementById('toggleButton').classList.contains('toggled')){
            //console.log("didnt act");
            startRecognition();  
               
        }
    };

    recognition.start(); // Start speech recognition
};

const stopRecognition = () => {
    if (recognition) {
        recognition.stop(); // Stop speech recognition
        console.log("Stopped Manually");
    }
};

const toggleRecognition = () => {
    const button = document.getElementById('toggleButton');
    const toggleLabel = document.querySelector('.toggle-label');
    if (button.classList.contains('toggled')) {
        stopRecognition(); 
        toggleLabel.textContent='Speech Off';
        button.classList.remove('toggled');
    } else {
        startRecognition(); 
        toggleLabel.textContent='Speech On';
        button.classList.add('toggled');
    }
};
document.addEventListener('aiSpeaking', function(event) {//Ai speech wont get picked up
    acted=true;
    recognition.stop();
    console.log("stopped for "+event.detail.time);
    
    setTimeout(() => {
       if(document.getElementById('toggleButton').classList.contains('toggled')){
        startRecognition();
       }
      
    }, event.detail.time);
  

});
document.addEventListener('resetRec', function(event) {//Reset speech
    if(!keepon){
        console.log("reset");
        setTimeout(() => {
            startRecognition(); // Restart recognition after a short delay
        }, 200);  
    }
    

});
document.addEventListener('playerConfigSet', function(event) {
    if(event.detail.white!="ai"&&event.detail.black!="ai"){
        keepon=true;
    }

});
function translate(transcript){
    const translations = {
        "takes": "x",
        "knight": "N",
        "queen": "Q",
        "bishop": "B",
        "rook": "R",
        "king": "K",
        "long": "O-",
        "castle": "O-O",
        "short": "",
        "equal":"=",
        "promote":"=",
        "check": "+",
        "checkmate": "#",
        "dee":"d",//I slur my words
        "he":"e",
        "sea":"c",
        "at":"f",
        "bee":"b",
        "one": "1",
        "two": "2",
        "three": "3",
        "four": "4",
        "five": "5",
        "six": "6",
        "seven": "7",
        "eight": "8",
        "gameplay": "",
        "play":"",
        "lawn":"O-",
        "route": "R",
        "rip": "R",
        "she":"c",
        "alpha":"a",
        "beta":"b",
        "charlie":"c",
        "delta":"d",
        "epsilon":"e",
        "foxtrot":"f",
        "gamma":"g",
        "hotel":"h"
        
    };
    for (let i = 0; i < transcript.length; i++) {
        if (translations.hasOwnProperty(transcript[i])) {
            transcript[i] = translations[transcript[i]];
        }
    }
    return transcript;
}
function findClosestMatch(word, targetWords) {
    const distances = targetWords.map(targetWord => levenshteinDistance(word, targetWord));
    const minDistance = Math.min(...distances);
    return minDistance < word.length / 2 ? targetWords[distances.indexOf(minDistance)] : null;
}

// Function to calculate Levenshtein distance between two strings
function levenshteinDistance(s1, s2) {
    const dp = Array(s1.length + 1).fill(null).map(() => Array(s2.length + 1).fill(null));

    for (let i = 0; i <= s1.length; i++) {
        dp[i][0] = i;
    }

    for (let j = 0; j <= s2.length; j++) {
        dp[0][j] = j;
    }

    for (let i = 1; i <= s1.length; i++) {
        for (let j = 1; j <= s2.length; j++) {
            const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1, // deletion
                dp[i][j - 1] + 1, // insertion
                dp[i - 1][j - 1] + cost // substitution
            );
        }
    }

    return dp[s1.length][s2.length];
}
document.getElementById('toggleButton').addEventListener('click', toggleRecognition);
document.addEventListener('keydown', function(event) {
    if (event.key === 'z' || event.key === 'Z') { 
        toggleRecognition();
    }
});

