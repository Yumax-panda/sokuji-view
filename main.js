function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function loadAPI(rS){
    const user = getParam('user');
    fetch(`https://sokujiapi.onrender.com/user/${user}`).then(r=>{return r.json()}).then(function(jsonData){
        rS(jsonData);
    });
    return 0;
}

function reflectSokuji(l){
    const teams = l.teams;
    const scores = l.scores;
    left = l.left;
    teamNum = teams.length;
    if(prev_teamNum === -1){
        prev_teamNum = teamNum;
    }else if(!(prev_teamNum === teamNum) && !(teamNum === -1)){
        location.reload();
    }
    if(prev_left === 0 && !(left === 0)){
        location.reload()
    }else if(prev_left - left > 1){
        location.reload()
    }else{
        prev_left = left;
    }
    document.getElementById(`team-num-${teamNum}`).style.setProperty('display', 'flex');
    document.querySelectorAll(`#team-num-${teamNum}`).forEach($container => {
        if (teamNum === 2) {
            const dif = l.dif;
            const win = l.win;
            $container.querySelectorAll('.score').forEach(($score, i) => {
                $score.innerText = scores[i];
            });
            $container.querySelectorAll('.team-span').forEach(($team, i) => {
                $team.innerText = teams[i];
            });
            $container.querySelectorAll('.score-dif').forEach(($dif, i) => {
                $dif.classList.remove('plus');
                $dif.classList.remove('minus');
                $dif.classList.add((dif.startsWith('+')) ? 'plus' : 'minus');
                $dif.innerText = dif;
            });
            $container.querySelectorAll('.win').forEach(($win, i) => {
                $win.style.setProperty('display', win ? 'block' : 'none');
            });
            $container.querySelectorAll('.left-race').forEach(($race, i) => {
                $race.innerText = `残レース:${left}`;
            });
        } else {
            $container.querySelectorAll('.score').forEach(($score, i) => {
                $score.innerText = scores[i];
            });
            $container.querySelectorAll('.team-span').forEach(($team, i) => {
                $team.innerText = teams[i];
            });
            $container.querySelectorAll('.dif').forEach(($dif, i) => {
                $dif.innerText = `+${scores[i] - scores[i+1]}`;
            });
            $container.querySelectorAll('.left-race').forEach(($race, i) => {
                $race.innerText = `残${left}`;
            });
        }
        $container.querySelectorAll('.team-span').forEach($span => {
            var $parent = $span.parentNode;
            var scaleX = 1;
            var translateX = 0;
            if ($span.offsetWidth > ($parent.offsetWidth - 20)) {
                scaleX = ($parent.offsetWidth - 20) / $span.offsetWidth;
                translateX = 10;
            }
            $span.style.setProperty('transform', `translateX(${translateX}px) scaleX(${scaleX})`);
        });
    });
}


var teamNum = -1;
var prev_teamNum = -1;
var left = -1;
var prev_left = -1;
var interval;
loadAPI(reflectSokuji);


intervalId = setInterval(function(){
    loadAPI(reflectSokuji);
}, 5000);

setTimeout(function(){
    clearInterval(intervalId);
}, 60000000);
