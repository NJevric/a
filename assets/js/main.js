$(document).ready(function(){

    navigacija();
    index();
    movies();
    calendar();
    contact();
    
});

let url = location.href;

// AJAX CALLBACK
function ajax(url,success){
    $.ajax({
        url: url,
        method: "get",
        dataType: "json",
        success: success,
        error:function(xhr){
            console.log(xhr);
        } 
    });

}
//DYNAMIC PRINT 
function ispis(div,html){
    document.querySelector(div).innerHTML=html;
}

// navigacija
function navigacija(){
//navigacija animacija
function navScroll(){
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 80) {
        $('nav').css({
            "transition":".5s ease",
            "padding-bottom": "0px"
        });
        $('#logo a').css({
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
        $('#logo a').css({
            'font-size':'1.8em',
            "margin":"0px"
        });
        
        $('nav #links').css({
            "margin":"10px 0px"
        });
    }  
}
$(document).scroll(navScroll);
// navigacija za male ekrane
function prikaziNavigaciju(){
   
    document.querySelector('#hamburger i').addEventListener('click',function(){
        document.querySelector('#links').classList.toggle('otvoriNav');
        
    })
    
}
prikaziNavigaciju();
// dinamicki ispis navigacije
function navigacijaIspis(){
    
    ajax("assets/data/nav.json",function(data){
        nav(data);
    })
   
    function nav(data){

        let htmlLogo='';
        let htmlNav = '';

        data.logo.forEach(i => {
            htmlLogo+=`<a href="${i.href}">${i.prikaz}</a>`
        })

        data.meni.forEach(nav => {
            htmlNav+=`<a href="${nav.href}" class="">${nav.prikaz}</a>`;
        });

        ispis('#logo',htmlLogo);
        ispis('#links',htmlNav);
       
        function active(){
            let url = window.location.pathname.slice(1);
            console.log(url);
            $('#links').find('a').each(function() {
                $(this).toggleClass('active', $(this).attr('href') == url);
            });
        }
        active();
        
    }
}
navigacijaIspis();
}


function index(){
    if(url.indexOf('index.html')!=-1){
        
        function perks(){
            ajax("assets/data/perks.json",function(data){
                perksIspis(data);
            });
            function perksIspis(data){
                let htmlPerks='';
                data.forEach(i => {
                    htmlPerks+=`<div class="opcija">
                    <h3>${i.naslov}</h3>
                    <p>${i.tekst}</p>
                </div>`;
                });
                
                ispis("#opcije",htmlPerks);
            }
        }
        perks();

        function komentari(){
            
            let nizKomentari = [' ipsum dolor sit amet consectetur adipisicing elit. Natus, dicta.','Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum necessitatibus porro sit assumenda obcaecati non!','Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis delectus in tempora odit alias consectetur id velit ipsa iure excepturi. Maiores magni alias aperiam aliquid.'];

            let htmlKomentar = '';

            nizKomentari.forEach(i=>{
                htmlKomentar += `
                <div class="blokKomentar">
                   
                    <p><span><i class="fas fa-quote-left"></i></span> ${i}<span><i class="fas fa-quote-left"></i></span></p>
                </div>
                `;
            });

            ispis('#blokoviKomentar',htmlKomentar);
        }

        komentari();
    }
}


function movies(){
    
      
    if(url.indexOf('movies.html')!=-1){
        
        
        function sort(){
           
            ajax("assets/data/sort.json",function(data){
                sortIspis(data);
               
            });
    
          
            
            
        }
        sort();
        function sortIspis(data){
    
            let htmlSort = `  <select id="sort">
            <option value="0">Sort by</option>`;

            data.forEach( i => {
                htmlSort+=`<option value="${i.id}">${i.prikaz}</option>`
            });

            htmlSort+=`</select>`;

            
            ispis('#sortHtml',htmlSort);
            
           
        }
        // sort();
       
       
        //filter
        function filter(){

            function prikaziFilter(){
                document.querySelector('#pocetniPrikazFilter').addEventListener('click',function(){
                    document.querySelector('#zanrovi').classList.toggle('prikazZanr');
                    
                });
            }
            prikaziFilter();

            ajax("assets/data/filter.json",function(data){
                filterIspis(data);
               
                
            });
            function filterIspis(data){
                
                let htmlFilter = ``;
                data.forEach(i => {
                    htmlFilter+=`<input type="checkbox" name="chb" id="${i.prikaz}" data-id="${i.id}"/><span>${i.prikaz.slice(0,1).toUpperCase() + i.prikaz.slice(1)}</span><br/>`;
                });
               
                ispis('#zanrovi',htmlFilter);

            }
        }

        filter();
        
        
        //ispis filmova
        function filmovi(){
            
            ajax("assets/data/filmovi.json",function(data){
                filmoviIspis(data);
                
            });
           
           
            
           
           
        }
        filmovi();
        function filmoviIspis(data){
                
            let htmlFilmovi = ``;
            data.forEach(i => {
                htmlFilmovi+=`<div class="film">
                <img src="${i.img.src}" alt="${i.img.alt}"/>
                <h2>${i.naslov}</h2>
                <div class="genre">`
                    for(let j of i.kategorija){
                        htmlFilmovi+=` <p>${j.naziv}</p>`
                      
                    }

                htmlFilmovi+=`

                </div>
                <p>Duration ${i.trajanje.ispis}</p>
                <p>Released ${i.datum.ispis}</p>
                <a href="#" class="get">Get Tickets</a>
            </div>`;
            });
           
            ispis('#filmovi',htmlFilmovi);

            function prikaziGetTicket(){

                let klasaGet = document.querySelectorAll('.get');
                // console.log(klasaGet);
            
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
            prikaziGetTicket();
            

            
            
        }
        function sortLogic(){
           
                let el = document.querySelector('#sort');
                console.log(el);
                let arr = [];
                ajax('assets/data/filmovi.json',function(data){

                    for(let i of data){
                        arr.push(i);  
                    }
                    
                    if(el.value == 1){
                        arr.sort(function(a,b){
                            a = a.datum.date.split('.');
                            b = b.datum.date.split('.');
                            return a[2] - b[2] || a[1] - b[1] || a[0] - b[0];
                        });
                        console.log(arr);
                    }
                    if(el.value == 2){
                        arr.sort(function(a,b){
                            return a.trajanje.vreme-b.trajanje.vreme;
                        });
                        console.log(arr);
                    }
                    if(el.value == 3){
                        arr.sort(function(a,b){
                            return b.trajanje.vreme - a.trajanje.vreme;
                        });
                        console.log(arr);
                    }
                    else{
                        filmoviIspis(data);
                    }
                    filmoviIspis(arr);

                });
                
                console.log(arr);
        }
        $("body").on("change","#sort",sortLogic);
        
    }
    
}

function calendar(){
    if(url.indexOf('calendar.html')!=-1){
        function datumi(){
            ajax("assets/data/filmovi.json",function(data){
                datumiIspis(data);
                
            });
            function datumiIspis(data){
                let htmlDatum = ``;
                data.forEach(i=>{
                    htmlDatum+=`
                    <div class="datum">
              
                    <div class="filmProjekcija">
                        <div class="linija"></div>
                        <h3>${i.naslov}</h3>
                        <div class="vremePrikaz">
                            `
                            for(let j of i.projekcija){
                              
                               htmlDatum+=` <p>${j.vremePrikazivanja}</p>`;
                              
                            }
                           
                            htmlDatum+=`
                        </div>
                        
                    </div>
                </div>
                    `;
                })
               
                ispis('#datumi',htmlDatum);
            }
        }
        datumi();

        function podnaslov(){
            let datum = new Date();
            let dan = datum.getDate();
            let mesec  =datum.getMonth()+1;
            let godina = datum.getFullYear();
            let htmlDanasnjiDan = `${dan}.${mesec}.${godina}`;

            ispis('#podnaslovSpan',htmlDanasnjiDan);
        }
        podnaslov();
    }
}
function contact(){
    if(url.indexOf('contact.html')!=-1){
        console.log('a');
    }
}






