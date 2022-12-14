var tableau_AllSites=[];

var template_AllSites = `
                            <div onclick="ToSite(%SiteId%,'%name%')" class="d-flex my-4 justify-content-center">                                
                                <div class="col-4 text-center site font-weight-bold">%name%</div>
                            </div>
                            `;

// fonction appelée au chargement de la page commercial.html
function init(){
    getAllSites();
}

// fonction qui récupère les exploitants de la BDD (sites)
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

//fonction qui affiche les sites
function ShowAllSite(){
    
    document.getElementById("AllSite").innerHTML="";
    
    for (let i = 0; i < tableau_AllSites.length; i++) {
            var html = template_AllSites.replaceAll("%SiteId%", tableau_AllSites[i].siteId)
                                        .replaceAll("%name%", tableau_AllSites[i].Name)
                
                var elt = document.createElement("div");
                document.getElementById("AllSite").appendChild(elt);
                elt.outerHTML = html;         
    }  
}


//fonction qui redirige vers calendar.html avec l'id du site selectionné
function ToSite(id,name){
    //on enregistre localemenent le nom du site selectionné
    localStorage.setItem('SiteName',name);

    document.location.href="./calendar.html#"+id;
}
