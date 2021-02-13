$(document).ready(function(){

    navigacijaIspis();
    prikaziNavigaciju();
    active();
    $(document).scroll(navScroll);
    prikaziFilter();
    prikaziGetTicket();
    
   
});

function navScroll(){
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 80) {
        $('nav').css({
            "transition":".5s ease",
            "padding-bottom": "0px"
        });
        $('#logo p').css({
            'font-size':'1.6em',
            "transition":".3s ease",
            "margin-bottom":"10px",
            "margin-top":"-5px"
        });
        
        $('nav #links').css({
            'transition':'.3s',
            'margin-top':'0px'
        });
    }
    else{
        $('nav').css({
            "padding-bottom": "15px"
        });
        $('#logo p').css({
            'font-size':'1.8em',
            "margin":"0px"
        });
        
        $('nav #links').css({
            "margin":"10px 0px"
        });
    }  
}

function active(){
    let url = window.location.pathname.slice(1);
    console.log(url);
    $('#links').find('a').each(function() {
      $(this).toggleClass('active', $(this).attr('href') == url);
   });
    
}

function prikaziFilter(){
    document.querySelector('#pocetniPrikazFilter').addEventListener('click',function(){
        document.querySelector('#zanrovi').classList.toggle('prikazZanr');
        
    })
}

function prikaziGetTicket(){

    let klasaGet = document.querySelectorAll('.get');
    console.log(klasaGet);

    for(let i=0; i<klasaGet.length;i++){
        klasaGet[i].addEventListener('click',function(e){
            e.preventDefault();
            console.log(i);
            document.querySelector('#getTicket').style.display='block';
        });
    }
    document.querySelector('#gornjiGetTicket i').addEventListener('click',function(){
        document.querySelector('#getTicket').style.display='none';
    })
}



// navigacija

// navigacija za male ekrane
function prikaziNavigaciju(){
   
    document.querySelector('#hamburger i').addEventListener('click',function(){
        document.querySelector('#links').classList.toggle('otvoriNav');
        
    })
    
}

// dinamicki ispis navigacije
function navigacijaIspis(){

    $.ajax({
        url: "assets/data/nav.json",
        method: "get",
        dataType: "json",
        success: function (data) {
         
            nav(data);
     
         
        },
        error:function(xhr){
            console.log(xhr);
        } 
    });

    function nav(data){

        let htmlLogo='';
        let htmlNav = '';

        data.logo.forEach(i => {
            htmlLogo+=`<a href="${i.href}">${i.prikaz}</a>`
        })

        data.meni.forEach(nav => {
            htmlNav+=`<a href="${nav.href}">${nav.prikaz}</a>`;
        });
       
        function ispis(div,html){
            document.querySelector(div).innerHTML = html;
        }

        ispis('#logo',htmlLogo)
        ispis('#links',htmlNav);
        
    }
}


