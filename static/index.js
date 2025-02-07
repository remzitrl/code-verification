var loginButton = document.getElementById('loginButton');
var form = document.getElementById('loginForm');
var phoneContainer = document.getElementById('phoneContainer');
var notification = document.getElementById('notification');
var doneNotify = document.getElementById('doneNotify');
var backballs = document.getElementById('backballs');
var validation = document.getElementById('validation');
var errorBan = document.getElementById('errorBan');
var loginwindow = document.getElementById('loginwindow');
var shape1 = document.getElementsByClassName('shape')[0];
var shape2 = document.getElementsByClassName('shape')[1];
var ses = new Audio('../static/ses.mp3');

document.getElementById('loginButton').addEventListener('click', function() {
    event.preventDefault();
    var kullaniciAdi = document.getElementById('kullaniciAdi').value;
    var sifre = document.getElementById('sifre').value;

    // Send POST request to /giris URL when button is clicked
    fetch('/giris', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            kullanici_adi: kullaniciAdi,
            sifre: sifre
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if(data.error == 400){
            console.log("login failed");
            errorBan.style.display = "block";
        }

        if(data.dogrulama_kodu != undefined){
            console.log("login successful");
            loginSuccess(data.dogrulama_kodu);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});


function loginSuccess(dogrulama_kodu)
{
    var uElement = document.getElementById('dogrulama');
    uElement.innerText = dogrulama_kodu;

    form.style.left = '30%';
    backballs.style.left = '30%';
    phoneContainer.style.right = '0';

    setTimeout(function () {
        notification.style.top = '85px';
        ses.play();
    }, 2000);

    setTimeout(function () {
        notification.style.top = '-50%';
    }, 7000);

    loginwindow.style.display= "none";
    shape1.style.top = "-50px";
    shape2.style.bottom = "-50px";
    form.style.height = "350px";
    validation.innerHTML = `<form id="dogrulamaForm">
    <h3>Verification Code</h3>
    <br>
    <p id="validError" style="display:none;text-align: center;background-color: orangered;padding: 5px;">Invalid verification code!</p>
    <input type="text" placeholder="Verification code" id="dogrulama_kodu">
    <div style="margin-top:5px;">
    <l id="timer" style="float:right">02:00</l>
    <u style="cursor:pointer" id="yenikodGonder">Send new code</u>
    </div>
    <button id="dogrulaButton" type="button">Verify</button>
    </form>`;

    validationForm();
}


function validationForm(){
    var timerElement = document.getElementById('timer');

    var timerSeconds = 120; // 2 minutes
    var timerInterval;

    function updateTimer() {
        var minutes = Math.floor(timerSeconds / 60);
        var seconds = timerSeconds % 60;
        timerElement.textContent = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
    }

    function startTimer() {
        timerInterval = setInterval(function () {
            if (timerSeconds > 0) {
                timerSeconds--;
                updateTimer();
            } else {
                clearInterval(timerInterval);
            }
        }, 1000);
    }

    startTimer();

    var dogrulaButton = document.getElementById('dogrulaButton');

    dogrulaButton.addEventListener('click', function (event) {
        event.preventDefault();

        var kullaniciAdi = document.getElementById('kullaniciAdi').value;
        var dogrulamaKodu = document.getElementById('dogrulama_kodu').value;

        fetch('/dogrula', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'kullanici_adi=' + kullaniciAdi + '&dogrulama_kodu=' + dogrulamaKodu
        })
        .then(response => response.text())
        .then(result => {
            console.log(result);
            if(result == "1"){
                console.log("verification successful");
                validation.innerHTML= `
                <img class="doneTick" src="static/done.png">
                <h3 style="margin-top: 180px;font-size: 30px;">Verification Successful!</h3>
                `;
    
                setTimeout(function () {
                    form.style.left = '-400px';
                    backballs.style.left = "-400px";
                    phoneContainer.style.right = "20%";
                    phoneContainer.style.transform = "translateX(-50%)";
                    setTimeout(function () {
                        doneNotify.style.top = "85px";
                        ses.play();
                    }, 500);
                }, 2000);
            }else{
                console.log("verification failed");
                var validError = document.getElementById('validError');
                validError.style.display = "block";
            }
    
        })
        .catch(error => console.error('Verification error:', error));
    });

    yeniKod();
}

function yeniKod(){
    var yenikodGonderLink = document.getElementById('yenikodGonder');
    yenikodGonderLink.addEventListener('click', function (event) {
        event.preventDefault();
        validError.style.display = "none";
        // Get new code from Python and show notification
        fetch('/yenikod', {
            method: 'POST',
            body: new URLSearchParams({
                kullanici_adi: 'berat', 
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.dogrulama_kodu) {
                var uElement = document.getElementById('dogrulama');
                
                if(notification.style.top == "85px")
                {
                    setTimeout(function () {
                        notification.style.top = '-70px';
                    }, 1000);
                }
                setTimeout(function () {
                    uElement.innerText = data.dogrulama_kodu;
                    notification.style.top = '85px';
                    ses.play();
                    setTimeout(function () {
                        notification.style.top = '-70px';
                    }, 7000);
                }, 2000);

                clearInterval(timerInterval);
                timerSeconds = 120;
                updateTimer();
                startTimer();
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    });
}
















////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////// LOCK SCREEN - CLOCK & DATE /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    var timeString = hours + ':' + minutes;
    document.getElementById('clock').innerHTML = timeString;

    var dateString = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', weekday: 'long' });
    document.getElementById('date').innerHTML = dateString;
}

// Initial call
updateClock();

// Update every second
setInterval(updateClock, 1000);
