var c = document.getElementById("c");
var ctx = c.getContext("2d");

//making the canvas full screen
c.height = window.innerHeight-20;
c.width = window.innerWidth-20;

//chinese characters - taken from the unicode charset
var matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
//converting the string into an array of single characters
matrix = matrix.split("");

var font_size = 8;
var columns = c.width/font_size; //number of columns for the rain
//an array of drops - one per column
var drops = [];
//x below is the x coordinate
//1 = y co-ordinate of the drop(same for every drop initially)
for(var x = 0; x < columns; x++)
    drops[x] = 1; 

//drawing the characters
function draw()
{
    //Black BG for the canvas
    //translucent BG to show trail
    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = "#2aa75c";//green text
    ctx.font = font_size + "px arial";
    //looping over drops
    for(var i = 0; i < drops.length; i++)
    {
        //a random chinese character to print
        var text = matrix[Math.floor(Math.random()*matrix.length)];
        //x = i*font_size, y = value of drops[i]*font_size
        ctx.fillText(text, i*font_size, drops[i]*font_size);

        //sending the drop back to the top randomly after it has crossed the screen
        //adding a randomness to the reset to make the drops scattered on the Y axis
        if(drops[i]*font_size > c.height && Math.random() > 0.975)
            drops[i] = 0;

        //incrementing Y coordinate
        drops[i]++;
    }
}

setInterval(draw, 45);

document.addEventListener('DOMContentLoaded', function () {
    const regionSelect = document.getElementById('region-select');
    const linkContainer = document.querySelector('.link-container');

    regionSelect.addEventListener('change', function () {
        const selectedRegion = regionSelect.value;
        updateLinks(selectedRegion);
    });

    function updateLinks(region) {
        // Usuń wszystkie aktualne przyciski z link-container
        linkContainer.innerHTML = '';

        // Pobierz zestaw linków dla wybranego regionu
        const links = getLinksForRegion(region);
        
        // Dodaj każdy link do link-container
        links.forEach(link => {
            const button = document.createElement('button');
            button.textContent = link.text;
            button.classList.add('custom-button'); // Dodaj klasę dla stylów CSS
            button.style.backgroundImage = `url('${link.image}')`; // Ustaw obrazek jako tło
            button.addEventListener('click', function() {
                window.open(link.url, '_blank');
            });
            linkContainer.appendChild(button);
        });
    }

    // Definicja zestawów linków dla różnych regionów
    function getLinksForRegion(region) {
        const links = {
            "1": [
                { text: "Checklista R1", url: "https://docs.google.com/spreadsheets/d/1wdj8Yr5MX_zI12Y8YWmBuMXv5YB2uUSrN8_OPAyKsLc/edit#gid=0", image: "img/checklista.jpg" },
                { text: "Link 2", url: "https://example.com/link2", image: "img/checklista.jpg" },
                { text: "Link 3", url: "https://example.com/link1", image: "url_do_obrazka1.jpg" },
                { text: "Link 4", url: "https://example.com/link2", image: "url_do_obrazka2.jpg" },
                { text: "Link 5", url: "https://example.com/link1", image: "url_do_obrazka1.jpg" },
                { text: "Link 6", url: "https://example.com/link2", image: "url_do_obrazka2.jpg" },
                { text: "Link 7", url: "https://example.com/link2", image: "url_do_obrazka2.jpg" },
                { text: "Link 8", url: "https://example.com/link1", image: "url_do_obrazka1.jpg" },
                { text: "Link 9", url: "https://example.com/link2", image: "url_do_obrazka2.jpg" },
                { text: "Link 10", url: "https://example.com/link2", image: "url_do_obrazka2.jpg" },
                { text: "Link 11", url: "https://example.com/link1", image: "url_do_obrazka1.jpg" },
                { text: "Link 12", url: "https://example.com/link2", image: "url_do_obrazka2.jpg" },
                // Dodaj więcej linków dla regionu 1
            ],
            "2": [
                { text: "Checklista", url: "https://docs.google.com/spreadsheets/d/1wdj8Yr5MX_zI12Y8YWmBuMXv5YB2uUSrN8_OPAyKsLc/edit#gid=659437804", image: "img/checklista.jpg" },
                { text: "Centreon", url: "https://centreon24.pl.auchan.com/centreon/monitoring/resources?filter=%7B%22id%22%3A%22%22%2C%22name%22%3A%22New+filter%22%2C%22criterias%22%3A%5B%7B%22name%22%3A%22resource_types%22%2C%22object_type%22%3Anull%2C%22type%22%3A%22multi_select%22%2C%22value%22%3A%5B%5D%7D%2C%7B%22name%22%3A%22states%22%2C%22object_type%22%3Anull%2C%22type%22%3A%22multi_select%22%2C%22value%22%3A%5B%5D%7D%2C%7B%22name%22%3A%22statuses%22%2C%22object_type%22%3Anull%2C%22type%22%3A%22multi_select%22%2C%22value%22%3A%5B%7B%22id%22%3A%22WARNING%22%2C%22name%22%3A%22Warning%22%7D%2C%7B%22id%22%3A%22DOWN%22%2C%22name%22%3A%22Down%22%7D%2C%7B%22id%22%3A%22CRITICAL%22%2C%22name%22%3A%22Critical%22%7D%2C%7B%22id%22%3A%22UNREACHABLE%22%2C%22name%22%3A%22Unreachable%22%7D%2C%7B%22id%22%3A%22UNKNOWN%22%2C%22name%22%3A%22Unknown%22%7D%5D%7D%2C%7B%22name%22%3A%22status_types%22%2C%22object_type%22%3Anull%2C%22type%22%3A%22multi_select%22%2C%22value%22%3A%5B%5D%7D%2C%7B%22name%22%3A%22host_groups%22%2C%22object_type%22%3A%22host_groups%22%2C%22type%22%3A%22multi_select%22%2C%22value%22%3A%5B%7B%22id%22%3A0%2C%22name%22%3A%22POL011_Czestochowa%22%7D%2C%7B%22id%22%3A0%2C%22name%22%3A%22POL026_Legnica_Shumana%22%7D%2C%7B%22id%22%3A0%2C%22name%22%3A%22POL027_Walbrzych_Wieniawskiego%22%7D%2C%7B%22id%22%3A0%2C%22name%22%3A%22POL223_Sosnowskiego_Opole%22%7D%2C%7B%22id%22%3A0%2C%22name%22%3A%22POL263_Wroclawska_Opole%22%7D%2C%7B%22id%22%3A0%2C%22name%22%3A%22POL266_Jelenia_Gora%22%7D%2C%7B%22id%22%3A0%2C%22name%22%3A%22POL016_Wroclaw%22%7D%2C%7B%22id%22%3A0%2C%22name%22%3A%22POL221_Walbrzych%22%7D%2C%7B%22id%22%3A0%2C%22name%22%3A%22POL320_PLS523_Czestochowa_Lesna%22%7D%2C%7B%22id%22%3A0%2C%22name%22%3A%22POL302_PLS502_Czestochowa_Focha%22%7D%2C%7B%22id%22%3A0%2C%22name%22%3A%22POL311_PLS511_Wroclaw_Hubska%22%7D%2C%7B%22id%22%3A0%2C%22name%22%3A%22POL344_PLS541_Wroclaw_Ustronie%22%7D%2C%7B%22id%22%3A0%2C%22name%22%3A%22POL346_PLS543_Wroclaw_Zwycieska%22%7D%2C%7B%22id%22%3A0%2C%22name%22%3A%22POL251_Krzywoustego_Wroclaw%22%7D%5D%7D%2C%7B%22name%22%3A%22service_groups%22%2C%22object_type%22%3A%22service_groups%22%2C%22type%22%3A%22multi_select%22%2C%22value%22%3A%5B%5D%7D%2C%7B%22name%22%3A%22monitoring_servers%22%2C%22object_type%22%3A%22monitoring_servers%22%2C%22type%22%3A%22multi_select%22%2C%22value%22%3A%5B%5D%7D%2C%7B%22name%22%3A%22search%22%2C%22object_type%22%3Anull%2C%22type%22%3A%22text%22%2C%22value%22%3A%22%22%7D%2C%7B%22name%22%3A%22sort%22%2C%22object_type%22%3Anull%2C%22type%22%3A%22array%22%2C%22value%22%3A%5B%22status_severity_code%22%2C%22asc%22%5D%7D%5D%7D&details=%7B%22customTimePeriod%22%3A%7B%22end%22%3A%222024-03-21T11%3A12%3A36.609Z%22%2C%22start%22%3A%222024-03-20T11%3A12%3A36.609Z%22%7D%2C%22selectedTimePeriodId%22%3A%22last_24_h%22%2C%22tab%22%3A%22details%22%2C%22tabParameters%22%3A%7B%7D%7D", image: "img/centreon.jpg" },
                { text: "Wrocław Bielany", url: "http://131.19.32.36/rdm/index.php", image: "img/rdm.jpg" },
                { text: "Wrocław Korona", url: "http://131.151.32.36/rdm/index.php", image: "img/rdm.jpg" },
                { text: "Legnica", url: "http://131.18.32.36/rdm/index.php", image: "img/rdm.jpg" },
                { text: "Jelenia Góra", url: "http://131.166.32.36/rdm/index.php", image: "img/rdm.jpg" },
                { text: "Wałbrzych", url: "http://131.20.32.36/rdm/index.php", image: "img/rdm.jpg" },
                { text: "Op. Wrocławska", url: "http://131.163.32.36/rdm/index.php", image: "img/rdm.jpg" },
                { text: "Op. Sosnkowskiego", url: "http://131.123.32.36/rdm/index.php", image: "img/rdm.jpg" },
                { text: "Częst. Północ", url: "http://131.111.32.36/rdm/index.php", image: "img/rdm.jpg" },
                { text: "Częst. Poczesna", url: "http://131.13.32.36/rdm/index.php", image: "img/rdm.jpg" },
                { text: "RDM Supery", url: "http://rdmsuper.pl.auchan.com/RDM/index.php/main/login", image: "img/rdm.jpg" },
                { text: "GLPI Region2", url: "https://glpi24.pl.auchan.com/glpi/front/ticket.php?is_deleted=0&as_map=0&criteria%5B0%5D%5Blink%5D=AND&criteria%5B0%5D%5Bfield%5D=12&criteria%5B0%5D%5Bsearchtype%5D=equals&criteria%5B0%5D%5Bvalue%5D=notold&criteria%5B2%5D%5Blink%5D=AND&criteria%5B2%5D%5Bfield%5D=8&criteria%5B2%5D%5Bsearchtype%5D=contains&criteria%5B2%5D%5Bvalue%5D=IT_Region_2&search=Szukaj&itemtype=Ticket&start=0&_glpi_csrf_token=524ec8d44df313c8af1d63f61fad614b58bf6a8dd0e81e55bb769836fe7d3bbc", image: "img/glpi.jpg" },
                { text: "Numery kontaktowe", url: "https://docs.google.com/spreadsheets/d/155TdDFoT14MV3SAajNUBAsr1ggLS9BStSLVX54Vx6D4/edit#gid=761316521", image: "img/baza.jpg" },
                // Dodaj więcej linków dla regionu 2
            ],
            "default": [
                { text: "Wybierz poprawny region :)", url:"", image: ""},
            ]
            // Dodaj więcej zestawów linków dla innych regionów
        };

        // Jeśli nie ma zestawu linków dla danego regionu, zwróć pustą tablicę
        return links[region] || [];
    }
    document.addEventListener('DOMContentLoaded', function () {
    // Nasłuchujemy zdarzenia naciśnięcia klawiszy na całym dokumencie
    document.addEventListener('keydown', function(event) {
        // Sprawdzamy czy naciśnięty klawisz to "y" lub "t"
        if (event.key === 'y' || event.key === 't') {
            // Otwieramy nowe okno przeglądarki z adresem URL https://youtube.com
            window.open('https://youtube.com', '_blank');
        }
    });
});
});
