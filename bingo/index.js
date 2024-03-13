words = [
    "jojczy jojczy",
    "Borowski jest idiotą",
    "apdejt forti",
    "Synergia",
    "Cichopek gra w statki",
    "Nowak szuka problemu",
    "MAJKA SALES PIERDALES",
    "zadania centralne",
    "pczekaj pczekaj pczekaj",
    "cześ witam z legnicy",
    "zamrorzenie",
    "Na platanie..",
    "hi hi hi",
    "skanery",
    "motorole",
    "cisza spokój",
    "Adaś kręci głową",
    "WAJLAND",
    "RODO",
    "ODDAJ KURWA XIBO",
    "SZKOLENIA JEBANE PRZEZ ZONTKA",
    "VAT SRAT",
    "Krzaczastobrewa XD",
    "Czoło Broya",
    "BILANSE LATAWCE WIATR",
    "DRUKARKI",
    /*
    "Cześ, witam z Legnicy",
    "ciekawa sytuacja...",
    "hi hi hi",
    "na platanie...", 
    "ogarnołem", 
    "apdejt offica", 
    "Adaś kręci głową",
    "Wolne w wigilie",
    "Nowak szuka problemu", 
    "pczekaj pczekaj pczekaj", 
    "tempory",
    "cisza spokój", 
    "głowica",
    "zadania centralne", 
    "od przodu czy od tyłu?", 
    "Przygotowanie do BN",
    "zamrożenie",
    "trzecia droga",
    "kontrolery",
    "fajerwerki",
    "Cichopek znowu coś pierdoli",
    "eeee",
    "ffff",
    "gggg"*/
    ];
    
var cells = {};
    
function generate() {
    var usedWords = [];
    
    var node = document.getElementById("grid");
    
    if(node.innerHTML && !confirm("Na pewno losować?"))
        return;
    
    var html = '<table border="0">';
    for(var y = 0; y < 5; y++) {
        html += "<tr>"
        for(var x = 0; x < 5; x++) {
            do {
                var i = Math.round(Math.random() * (words.length - 1));
                var word = words[i];
            } while(usedWords.indexOf(word) >= 0);
            usedWords.push(word);
            html += '<td id="cell_' + x + '_' + y + '"><label><input id="chk-cell_' + x + '_' + y + '" type="checkbox" onclick="cellClicked(\'cell_' + x + '_' + y + "')\"><br>" + word + "</label></td>";				
        }
        html += "</tr>"
    }
    html += "</table>";
    node.innerHTML = html;
    save("BuzzwordBingo.grid", html);
    saveGameState();
}


function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}	

function cellClicked(id) {
    var c = document.getElementById("chk-" + id);
    var d = document.getElementById(id);
    d.className =(c.checked)?"highlight":"";		
    saveGameState();
}

function saveGameState() {
    for(var y = 0; y < 4; y++) {
        for(var x = 0; x < 4; x++) {
            var id = 'cell_' + x + '_' + y;
            var c = document.getElementById("chk-" + id);
            save("HANGOUTBINGO." + id, c.checked);
        }
    }
}

function loadGameState() {
    for(var y = 0; y < 4; y++) {
        for(var x = 0; x < 4; x++) {
            var id = 'cell_' + x + '_' + y;
            var c = document.getElementById("chk-" + id);				
            c.checked = (load("HANGOUTBINGO" + id) == 'true');
            var d = document.getElementById(id);
            d.className =(c.checked)?"highlight":"";				
        }
    }
}

function toggle(id){
    var elem = document.getElementById(id);
    if (elem.style.display == "block")
        elem.style.display = "none";
    else
        elem.style.display = "block";
}

save = function(key,value){};
load = function(key){return null};

function start() {
    if(supports_html5_storage()) {
        save = function(key, value) {
            localStorage.setItem(key,value);
        };
        load = function(key) {
            return localStorage.getItem(key);
        };			
    } else {
        alert("ERROR 666");
        return;
    }
    
    var grid = load("BuzzwordBingo.grid");
    if(grid) {
        console.log("EEE");
        var node = document.getElementById("grid");
        node.innerHTML = grid;
        loadGameState();
    }
}
