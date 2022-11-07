var GameSessionId=location.hash.substring(1,10);

var tableau_Mission=[];

var template_event=`
                    <div class="d-flex justify-content-between my-2 GameSession">                                    
                        <div class="text-center col-2">%Category%</div>    
                        <div class="text-center col-2">%DateTime%</div>
                        <div class="text-center col-2 text-wrap">%WorldPosition%</div>
                        <div class="text-center col-2">%Value_1%</div>
                        <div class="text-center col-2">%Value_2%</div>
                        <div class="text-center col-2 ">%Value_3%</div>
                    </div>
`

function initMission(){
    getMission();
    
}

function ShowInfos(){
    document.getElementById('Site').innerHTML=tableau_Mission['SiteName'];
    document.getElementById('Room').innerHTML=tableau_Mission['Room'].Name;
    document.getElementById('GameSessionId').innerHTML=tableau_Mission['Id'];
    document.getElementById('Start').innerHTML=tableau_Mission['StartDate'];
    document.getElementById('End').innerHTML=tableau_Mission['EndDate'];

}

function getMission(){
    var httpRequest = new XMLHttpRequest();
    var hostserver = "api.php?action=getgamesession&GameSessionId="+GameSessionId;
    httpRequest.open("GET", hostserver);
    httpRequest.onload = () => {
        tableau_Mission = JSON.parse(httpRequest.responseText);       
        console.log(tableau_Mission)
        ShowInfos();
        ShowEvents();   
    };
    httpRequest.send();
}

function ShowEvents(){
   
  
    for (var i=0;i<tableau_Mission['events'].length;i++){
        var html = template_event.replaceAll("%Category%",tableau_Mission['events'][i].Category)
                                .replaceAll("%DateTime%",tableau_Mission['events'][i].DateTime)
                                .replaceAll("%WorldPosition%",tableau_Mission['events'][i].WorldPosition)
                                .replaceAll("%Value_1%",tableau_Mission['events'][i].Value_1)
                                .replaceAll("%Value_2%",tableau_Mission['events'][i].Value_2)
                                .replaceAll("%Value_3%",tableau_Mission['events'][i].Value_3)
        const elt = document.createElement("div");
        document.getElementById("events").appendChild(elt);
       
        elt.outerHTML = html;
        
    }
}

function ReturnRoom(){
    window.location='./room.html#'+tableau_Mission['Room'].Id;
}

