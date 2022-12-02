

var tableau_AllSites=[];


var template_AllSites = `
                            <div onclick="ToSite(%SiteId%,'%name%')" class="d-flex my-4 justify-content-center">                                
                                <div class="col-4 text-center site font-weight-bold">%name%</div>
                            </div>
                            `;

function init(){
    getAllSites();
}

function getAllSites(){
    var httpRequest = new XMLHttpRequest();
    var hostserver = "api.php?action=getallsites";
    httpRequest.open("GET", hostserver);
    httpRequest.onload = () => {
        tableau_AllSites = JSON.parse(httpRequest.responseText);
        console.log(tableau_AllSites);
        ShowAllSite();
    };
    httpRequest.send();
}

function ShowAllSite(){
    
    document.getElementById("AllSite").innerHTML="";
    
    for (let i = 0; i < tableau_AllSites.length; i++) {
            var html = template_AllSites
                .replaceAll("%SiteId%", tableau_AllSites[i].siteId)
                .replaceAll("%name%", tableau_AllSites[i].Name)
                
            
                var elt = document.createElement("div");
                document.getElementById("AllSite").appendChild(elt);
                elt.outerHTML = html;         
    }  
}

function ToSite(id,name){
    localStorage.setItem('SiteName',name);
    document.location.href="./calendar.html#"+id;
}
