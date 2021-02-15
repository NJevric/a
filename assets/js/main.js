$(document).ready(function(){

    navigacija();
    index();
    movies();
    calendar();
    contact();
    footer();

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
       
        function sortIspis(data){
    
            let htmlSort = `  <select id="sort">
            <option value="0">Sort by</option>`;

            data.forEach( i => {
                htmlSort+=`<option value="${i.id}">${i.prikaz}</option>`
            });

            htmlSort+=`</select>`;

            
            ispis('#sortHtml',htmlSort);
            
           
        }
        sort();
       
       
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
               
                 // filtriranje
                var checkbox = document.querySelectorAll("input[name=chb]");
                checkbox.forEach(i => {
                    i.addEventListener('change', filterLogic);
                })
            });
            
        }
        function filterIspis(data){
                
            let htmlFilter = ``;
            data.forEach(i => {
                htmlFilter+=`<input type="checkbox" name="chb" id="${i.prikaz}" value="${i.id}" data-id="${i.id}"/><span>${i.prikaz.slice(0,1).toUpperCase() + i.prikaz.slice(1)}</span><br/>`;
            });
           
            ispis('#zanrovi',htmlFilter);

            
            
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
        let arrChb = [];
        
        function filterLogic(){
           
        
           let izabran = this.value;
           console.log(izabran);
           if(arrChb.includes(izabran)){
                arrChb=arrChb.filter(i=>{
                    return i!=izabran;
                });
            }
           else{
                arrChb.push(izabran);
           }

           ajax('assets/data/filmovi.json',function(data){

                ispisFiltriranihFilmova(data);

           });

           function ispisFiltriranihFilmova(data){

                let ispis = [];
                ispis = data.filter( i => {
                    if(arrChb.length!=0){
                        
                        for(let j in arrChb){
                            if(arrChb[j] == i.id){
                                return true;
                            }
                        }

                    }
                    else{
                        // ako je niz prazan prikazi sve filmove
                        return true;
                    }
                });
             
                filmoviIspis(ispis);
            
           }
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

        let forma = document.querySelector('#kontaktForma');
        let ime = document.querySelector('#ime');
        let email = document.querySelector('#email');
        let poruka = document.querySelector('#poruka');
        let submit = document.querySelector('#submit');
        let err=0;
        function greska(input, vrednost){
            input.style.border = '2px solid red';
            let div = input.parentElement;
            let greskaPrikaz = div.querySelector('p');
            greskaPrikaz.innerHTML = vrednost;
            err=1;
        }

        function uspeh(input){
            input.style.border = '2px solid #19B5FE';
        }

        function obaveznaPolja(arr){
            arr.forEach(i=>{
                console.log(arr);
                if(i.value.trim()==''){
                    greska(i,`Field is required`);
                }
                else{
                    uspeh(i);
                    return true;
                }
            });
        }

        function proveraDuzine(input, min, max){
            if(input.value.length < min){
                greska(input,`Field must contain min ${min} characters`);
            }
            else if(input.value.length > max){
                greska(input,`Field must contain max ${max} characters`);
            }
            else{
                uspeh(input);
                return true;
            }
        }

        function regProvera(input,reg){
            
            if(!reg.test(input.value)){
                greska(input,'Invalid input');
            }
            else{
                uspeh(input);
                return true;
            }
        }
        
        submit.addEventListener('click',function(e){
            e.preventDefault();
            obaveznaPolja([ime,email,poruka]);

            proveraDuzine(ime,3,80);
            proveraDuzine(poruka,3,300);
            regProvera(email,/^\w[.\d\w]*\@[a-z]{2,10}(\.[a-z]{2,3})+$/);
            regProvera(ime,/^[A-ZŠĐŽČĆ][a-zšđžčć]{2,15}(\s[A-ZŠĐŽČĆ][a-zšđžčć]{2,15})*$/);
        
            if(err==0){
                alert('You have successfully sent us a message.');
                location.reload();
            }
        });
    }
}





// footer

function footer(){
    let klasa = document.querySelector('.latestMovies');
    ajax('assets/data/filmovi.json',function(data){
        let filmovi = data.naslov;
        console.log(data);
        let broj = 0; 
        let htmlFooterFilmovi = '';
        for(let i of data){
            console.log(i.naslov);
            broj++;
            htmlFooterFilmovi +=`<a href="movies.html">${i.naslov}</a>` 
            if(broj==5){
                break;
            }
        }
        ispis('#linksFoo',htmlFooterFilmovi);
    })
}
