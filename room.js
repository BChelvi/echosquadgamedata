var tableau_Missions=[];

var tableau_RoomSessions=[];

var tableau_GameSessions=[];

var GameSessions_List = [
//     {
//     title:  'My Event',
//     start:  '2022-11-01T14:30:00',
//     allDay: false,
//     backgroundColor: 'green',
//    borderColor: 'green',
//    Color:"green" ,
//   },

//     {
//       title:  'My Event test 3',
//       start:  '2022-11-01T11:30:00',
//       end: '2022-11-02T17:30:00',
//       allDay: false,
//       backgroundColor: 'yellow',
//      borderColor: 'yellow',
//      Color:"red" ,
//      text:"white",
//     },
];


var template_Missions=`                                         
                      <div class="text-center col-3">%MissionName%</div>
                    `;

var template_RoomSessions=`
                        <div class="d-flex justify-content-between my-2 GameSession">                                    
                            <div class="text-center col-2">%SessionId%</div>
                            <div class="text-center col-2">%StartDate%</div>
                            <div class="text-center col-2">%EndDate%</div>
                            <div class="text-center col-2">%IsActive%</div>
                            <button class="text-center col-2" onclick="ShowGames(%SessionId%)">Voir les parties</button>
                        </div>
                            <div class="d-none" id="%SessionId%">
                  `;

var template_GameSessions=`
                  <div class="d-flex justify-content-between my-2 GameSession">                                    
                      <div class="text-center col-2">%SessionId%</div>
                      <div class="text-center col-2">%StartDate%</div>
                      <div class="text-center col-2">%EndDate%</div>
                      <div class="text-center col-2">%IsActive%</div>
                      <div class="text-center col-2">%MissionId%</div>
                  </div>
            `;

var template_room =`<option value=%RoomId%>%RoomName% - %RoomId%</option>`

var RoomId=location.hash.substring(1,10);



// var MissionSelect = document.getElementById('MissionSelect')
// MissionSelect.addEventListener('change', function() {
    
   
// })

var RoomSelected = document.getElementById('RoomSelected');
RoomSelected.addEventListener('change', function() {
   
    getRoom(RoomSelected.value);
})

function initRoom(){
    liste_rooms();
    getRoom(RoomId);

    
}

function getRoom(RoomId){

    var httpRequest = new XMLHttpRequest();
    var hostserver = "api.php?action=getroom&RoomId="+RoomId;
    httpRequest.open("GET", hostserver);
    httpRequest.onload = () => {
        tableau_RoomSessions = JSON.parse(httpRequest.responseText);
       

        ShowCalendar();   
    };
    httpRequest.send();
}

// function Showtableau_RoomSessions(){

   

//     document.getElementById("RoomSessions").innerHTML="";

//     ShowNbreGameSessions();

//     document.getElementById("NbreGameSessionsMonth").innerHTML="";

//     document.getElementById("NbreGameSessionsDay").innerHTML="";
    
//     for (let i = 0; i < tableau_RoomSessions['RoomSessions'].length; i++) {

//         var html = template_RoomSessions
//             .replaceAll("%SessionId%", tableau_RoomSessions['RoomSessions'][i].Id)
//             .replaceAll("%StartDate%", tableau_RoomSessions['RoomSessions'][i].StartDate)
//             .replaceAll("%EndDate%", tableau_RoomSessions['RoomSessions'][i].EndDate)
//             .replaceAll("%IsActive%", tableau_RoomSessions['RoomSessions'][i].IsActive)
        
//             var elt = document.createElement("div");
//             document.getElementById("RoomSessions").appendChild(elt);
//             elt.outerHTML = html;  
    
//     } 
// }

function FillTableauGameSessions(){
    tableau_GameSessions=[];
    for (var i=0;i<tableau_RoomSessions['RoomSessions'].length;i++){
        
        for (var j=0;j<tableau_RoomSessions['RoomSessions'][i]['GameSession'].length;j++){
            tableau_GameSessions.push(tableau_RoomSessions['RoomSessions'][i]['GameSession'][j]);
        }
    }
    
}

// function Showtableau_GameSessions(){

//     document.getElementById("RoomId").innerHTML=tableau_RoomSessions['SiteId'];

//     document.getElementById("RoomName").innerHTML=tableau_RoomSessions['Name'];

//     document.getElementById("GameSessions").innerHTML="";

//     document.getElementById("NbreGameSessionsMonth").innerHTML="";
    
//     document.getElementById("NbreGameSessionsDay").innerHTML="";
    
//     FillTableauGameSessions();
    
//     ShowNbreGameSessions();

//     for (let i = 0; i < tableau_GameSessions.length; i++) {

//         var html = template_GameSessions
//             .replaceAll("%SessionId%", tableau_GameSessions[i].Id)
//             .replaceAll("%StartDate%", tableau_GameSessions[i].StartDate)
//             .replaceAll("%EndDate%", tableau_GameSessions[i].EndDate)
//             .replaceAll("%IsActive%", tableau_GameSessions[i].IsActive)
//             .replaceAll("%MissionId%", tableau_GameSessions[i].MissionId)
        
//             var elt = document.createElement("div");
//             document.getElementById("GameSessions").appendChild(elt);
//             elt.outerHTML = html;  
//     } 
// }  


function getMissions(){
    var httpRequest = new XMLHttpRequest();
    var hostserver = "api.php?action=getmissions";
    httpRequest.open("GET", hostserver);
    httpRequest.onload = () => {
        tableau_Missions = JSON.parse(httpRequest.responseText);
        
    };
    httpRequest.send();
}


function ToGame(id){
    document.location.href="./game.html#"+id; 
}

function ShowNbreGameSessions(){
    document.getElementById("NbreGameSessions").innerHTML=tableau_GameSessions.length;

}

// function ShowGames(id){

//     document.getElementById(id).classList.replace("d-none","d-flex");
//     document.getElementById(id).innerHTML=id;
//     console.log(id);
// }

function ShowGameSessions(){
    document.getElementById("RoomSessionsButton").classList.replace("btn-light","btn-dark");
    document.getElementById("GameSessionsButton").classList.replace("btn-dark","btn-light");
}

function ShowRoomSessions(){
    document.getElementById("GameSessionsButton").classList.replace("btn-light","btn-dark");
    document.getElementById("RoomSessionsButton").classList.replace("btn-dark","btn-light");
    
    alert("Vue Calendar RoomSessions")
}

// ---------------------------VUE CALENDRIER-------------------------------------------

function FillTGameSessions_List(){
    
    GameSessions_List=[];

    for (var i=0;i<tableau_GameSessions.length;i++){
        var tableau=[];
        switch (tableau_GameSessions[i].MissionId){
            case  1:
                tableau['title']="En eaux troubles(60min)";
                tableau['backgroundColor']="red";
            break;
            case  4:
                tableau['title']="En eaux troubles(45min)";
                tableau['backgroundColor']="green";
            break;
            case  2:
                tableau['title']="Battle";
                tableau['backgroundColor']="blue";
            break;
            case  3:
                tableau['title']="Teaser";
                tableau['backgroundColor']="black";
            break;
        } 
        tableau['start']=tableau_GameSessions[i].StartDate;
        tableau['end']=tableau_GameSessions[i].EndDate;
     
        GameSessions_List.push(tableau);
        
    }
    
}
var calendarEl = document.getElementById('calendar');

function ShowCalendar(){


    document.getElementById("Site").innerHTML=tableau_RoomSessions['SiteName'];
    FillTableauGameSessions();
    ShowNbreGameSessions();
    FillTGameSessions_List();
    var calendar = new FullCalendar.Calendar(calendarEl, {
       
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
      },
     
        
        dateClick: function() {
        alert('Vue Day');
        },
        events: GameSessions_List,
           
    });
    calendar.render();
    calendar.setOption('locale', 'fr');
    calendar.on('dateClick', function(info) {
        console.log('clicked on ' + info.dateStr);
      });
};



function liste_rooms(){
    var tableau_rooms=JSON.parse(localStorage.getItem('site'));
  
    for (var i=0;i<tableau_rooms.length;i++){
        var html = template_room.replaceAll("%RoomName%",tableau_rooms[i].Name)
                                .replaceAll("%RoomId%",tableau_rooms[i].Id)
        const elt = document.createElement("option");
        document.getElementById("RoomSelected").appendChild(elt);
       
        elt.outerHTML = html;
        
    }
}

