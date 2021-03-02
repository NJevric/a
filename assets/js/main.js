window.onerror = (message,source,lineno) => {
    console.log(`ErrMessage ${message}`);
    console.log(`Url ${source}`);
    console.log(`Error is on line ${lineno}`);
}

window.onload = () => {

    navigacija();
    index();
    movies();
    calendar();
    contact();
    orders();
    footer();

};

const base = 'assets/data/';

//pageLocation
function pageLoc(page){

    let url = location.href;
    try{
        let arr = ['index.html','movies.html','calendar.html','contact.html','author.html','orders.html'];
        if(!arr.includes(page)){
            throw new Error(`Bad url input ${page}`);
        }
        return url.indexOf(page)!=-1;
    }
    catch(err){
        console.log(err);
    }
   
}

// local storage
function setLsItems(data){
    let id = data.map(i=>i.id);
    localStorage.setItem('idFilm',JSON.stringify(id));
}

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
const navigacija = () => {
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
        
        ajax(`${base}nav.json`,function(data){
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

const index = () => {
    if(pageLoc('index.html')){
        
        function perks(){
            ajax(`${base}perks.json`,function(data){
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


const movies = () => {
    
    if(pageLoc('movies.html')){
        
        // ispis sort ddl
        ajax(`${base}sort.json`,function(data){
            sortIspis(data);
        });   
    
        function sortIspis(data){
    
            let htmlSort = `  <select id="sort">
            <option value="0">Sort by</option>`;

            data.forEach( i => {
                htmlSort+=`<option value="${i.id}">${i.prikaz}</option>`
            });

            htmlSort+=`</select>`;

            ispis('#sortHtml',htmlSort);
            
        }
       
        //ispis filter ddl
        function filter(){

            function prikaziFilter(){
                document.querySelector('#pocetniPrikazFilter').addEventListener('click',function(){
                    document.querySelector('#zanrovi').classList.toggle('prikazZanr');
                    
                });
            }

            prikaziFilter();

            ajax(`${base}filter.json`,function(data){
                filterIspis(data);
               
                 // filtriranje
                var checkbox = document.querySelectorAll("input[name=chb]");
                let ls = localStorage.getItem('idFilm');
                console.log(ls);
                checkbox.forEach(i => {
                    i.addEventListener('change', filterLogic);
                   
                    for(let j of ls){
                        if(i.value.includes(j)){
                            console.log(i.value);
                        }
                    }
                    
                })
                 
            });

            function filterIspis(data){
                
                let htmlFilter = `<form>`;
                data.forEach(i => {
                    htmlFilter+=`<input type="checkbox" name="chb" id="${i.prikaz}" value="${i.id}" data-id="${i.id}"/class="zanrChb"><span>${i.prikaz.slice(0,1).toUpperCase() + i.prikaz.slice(1)}</span><br/>`;
                });
                htmlFilter+=`</form>`;
                ispis('#zanrovi',htmlFilter);

            }
        }

        filter();
        
        //ispis filmova
        function filmovi(){
            
            ajax(`${base}filmovi.json`,function(data){
                filmoviIspis(data);
                
                let ls = localStorage.getItem('idFilm');
            
                if(ls!=null && ls.length!=0){
                
                    data.sort(function(a, b){  
                        return ls.indexOf(a.id) - ls.indexOf(b.id);
                    });

                    filmoviIspis(data);  
                    sortLogic();

                    

                }
            
            });
           
        }
        filmovi();
        
        function filmoviIspis(data){
                
            let htmlFilmovi = ``;
            data.forEach(i => {
                htmlFilmovi+=`<div class="film">
                <img src="${i.img.src}" alt="${i.img.alt}"/>
                <h2 class="naslov">${i.naslov}</h2>
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
        
            if(arrChb.includes(izabran)){
                arrChb=arrChb.filter(i=>{
                    return i!=izabran;
                });
            }
            else{
                arrChb.push(izabran);
            }
            
            ajax(`${base}filmovi.json`,function(data){    
                ispisFiltriranihFilmova(data);
               
            });

            function ispisFiltriranihFilmova(data){

                let ispis = [];
                ispis = data.filter( i => {
                    
                    if(arrChb.length!=0){
                        
                        for(let j of arrChb){
                            for(let k of i.kategorija){
                                if(j == k.idKat){
                                    return true;
                                }
                            }
                        }
                    }
                   
                    else{
                        // ako je niz prazan prikazi sve filmove
                        return true;
                    }
                
                });
                if(ispis.length === 0){
                    alert('There seems to be no movies for this type of filters');
                }
                console.log(ispis.length);
                filmoviIspis(ispis);
                setLsItems(ispis);
            }
           
        }
        
        function sortLogic(){
           
                let el = document.querySelector('#sort');
                let arr = [];

                ajax(`${base}filmovi.json`,function(data){

                    if(localStorage.getItem('idFilm')){
                        
                        let ls = localStorage.getItem('idFilm');
                        data = data.filter(i=>{
                            return localStorage.getItem('idFilm').includes(i.id);
                        });

                        data.sort(function(a, b){  
                            return ls.indexOf(a.id) - ls.indexOf(b.id);
                        });
                    }

                    for(let i of data){
                        arr.push(i);  
                    }
                    function sortiraj(exec){
                        arr.sort(exec);
                    }

                    if(el.value == 0){
                       sortiraj(function(a,b){
                            return a.id-b.id;
                       })
                    }
                    if(el.value == 1){
                        sortiraj(function(a,b){
                            a = a.datum.date.split('.');
                            b = b.datum.date.split('.');
                            return a[2] - b[2] || a[1] - b[1] || a[0] - b[0];
                        })
                    }
                    if(el.value == 2){
                        sortiraj(function(a,b){
                            a = a.datum.date.split('.');
                            b = b.datum.date.split('.');
                            return b[2] - a[2] || b[1] - a[1] || b[0] - a[0];
                        });
                    }
                    if(el.value == 3){
                        sortiraj(function(a,b){
                            return a.trajanje.vreme-b.trajanje.vreme;
                        });
                    }
                    if(el.value == 4){
                        sortiraj(function(a,b){
                            return b.trajanje.vreme - a.trajanje.vreme;
                        });
                    }
                   
                    else{
                        filmoviIspis(data);
                    }

                    filmoviIspis(arr);
                    setLsItems(arr);
                    
                });
                
                console.log(arr);
        }
        $("body").on("change","#sort",sortLogic);
        
        
        function ticket(){
            
            let get = document.getElementsByClassName('get');
          
            for(let i of get){
                i.addEventListener('click',function(e){
                    e.preventDefault();
                });
            }
            ajax(`${base}filmovi.json`,function(data){
                ispisForme(data);
                
            });
            function ispisForme(data){
                let html = '';
                
                html+=`<form action="#" method="POST" id="formaGetTicket">
                <div class="form-group">
                    <label for="imeFilm">Movie Name</label>
                    <!-- <input type="text" id="movieName" name="movieName" value="Naslov"/> -->
                    <select id="imeFilm">
                        <option value="0">Choose Movie</option>`
                        for(let i of data){
                            html+=`<option value="${i.id}">${i.naslov}</option>`
                        }
                        html+=`
                    </select>
                </div>
                <div class="form-group">
                    <label for="broj">Ticket Sum</label>
                    <input type="number" min="1" id="broj" name="broj" value="1">
                </div>
                <div class="form-group">
                    <label for="time">Screening time</label>
                    <select id="time">
                        <option value="0">Choose Screening Time</option>
                        
                        
                    </select>
                </div>
                <input type="submit" id="submitTicket" name="submitTicket" value="Order Ticket"/>
                </form>`
              
               
            
                ispis('#donjiGetTicket',html);
                
                function ispisProjekcije(){
                    let film = document.querySelector('#imeFilm');
                    film.addEventListener('change',function(){
                        if(film.value!=0){
                           
                            let izabran = film.value;
                            let izabranFilmJson = --izabran;
                    
                            let htmlProjekcija = '';
                            for(let i of data[izabran].projekcija){
                                htmlProjekcija+=`<option value='${i.idProjekcija}'>${i.vremePrikazivanja}</option>`
                            }
                           
                            ispis('#time',htmlProjekcija);
                        }
                        else{
                            htmlProjekcija = '';
                          
                            ispis('#time',htmlProjekcija);
                        }
                    })
                }
                ispisProjekcije();
                
                function dohvatiPodatkeIzForme(){
                    const forma = document.querySelector('#formaGetTicket');
                    const film = document.querySelector('#imeFilm');
                    const brojKarte = document.querySelector('#broj');
                    const projekcija = document.querySelector('#time');
                    const submit = document.querySelector('#submitTicket');
                    console.log(projekcija);
                    
                    submit.addEventListener('click',function(e){
                        e.preventDefault();
                        
                        if(film.value == 0){
                            alert('You must choose movie in dropdown list');
                            return false;
                        }

                        else{
                            
                            if(localStorage){
                                addToOrders();
                              
                            }
                            else{
                                alert("Your Browser doesnt support localStorage");
                            }
                            
                            return true;
                        }

                    });  

                    
                    function addToOrders(){

                        let idFilmOrder = film.value;
                        let brojKarteLs = brojKarte.value;
                        let projekcijaLs = projekcija.value;

                        let movies=JSON.parse(localStorage.getItem("movieOrdersLs"));
                        
                        
                        if(movies){

                            if(movies.filter(movie=>movie.id==idFilmOrder).length){
                                //edit brKarte ili projekcije
                                for(let i in movies){
                                    if(movies[i].id == idFilmOrder) {
                                    
                                        movies[i].brKarte = brojKarteLs;
                                        movies[i].projekcija = projekcijaLs;
                                   
                                    }   
                                }
                                localStorage.setItem('movieOrdersLs',JSON.stringify(movies));
                            }
                            else{
                                // dodaj jos jedan film u ls ako postoji vec jedan
                                                    
                                movies.push({
                                    id : idFilmOrder,
                                    brKarte : brojKarteLs,
                                    projekcija: projekcijaLs
                                });
                                localStorage.setItem('movieOrdersLs',JSON.stringify(movies));
                            }
                           
                        }
                        else{
                            //dodaj film u ls
                            let movieOrder = [];
                                                
                            movieOrder[0] = {
                                id: idFilmOrder,
                                brKarte : brojKarteLs,
                                projekcija: projekcijaLs
                            };
                            localStorage.setItem('movieOrdersLs',JSON.stringify(movieOrder));
                        }
                        
                        alert('Your order is in orders page');
                        location.reload();
                    }
                }
                dohvatiPodatkeIzForme();
            }
            

          
        }
        ticket();
     
    }
    
}

const calendar= () =>{
    if(pageLoc('calendar.html')){
        function datumi(){
            ajax(`${base}filmovi.json`,function(data){
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
const contact = () =>{
    if(pageLoc('contact.html')){

        const forma = document.querySelector('#kontaktForma');
        const ime = document.querySelector('#ime');
        const email = document.querySelector('#email');
        const poruka = document.querySelector('#poruka');
        const submit = document.querySelector('#submit');
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

const orders =() =>{

    if(pageLoc('orders.html')){

        function ispisMovieOrder(){
            let movies = JSON.parse(localStorage.getItem('movieOrdersLs'));
        
            if(movies.length != 0){
                ajax(`${base}filmovi.json`,function(data){
                    ispisMovies(data);
                });
                
            }
            if(movies.length !== null){
                let html = `<div class="prazanLs"><p> You havent't booked any movies</p>
                <p>Go to our movies page so you can choose some movie to enjoy</p></div>`;
               
                ispis('#orders',html);
            }
            function ispisMovies(data){
                let result = data.filter(i=> {
                    for(let movie of movies){
                        if(i.id == movie.id){
                            return true;
                        }
                    }
                });
                console.log(result);
                ispisEl(result);
            }   

            function ispisEl(data){
                let html='';
                // console.log(data);
                // console.log(movies);
                // // console.log(movies[0].projekcija);
                // // console.log(movies[0].brKarte);
                data.map(x => {
                    let idFilmaLs = movies.find(y => y.id == x.id);
                    
                    x.quantity = parseInt(idFilmaLs.brKarte);

                    x.time = x.projekcija.find(p => p.idProjekcija == idFilmaLs.projekcija).vremePrikazivanja;
                })
                // console.log(data);

                data.forEach(i=>{
                    // console.log(i.projekcija[0].vremePrikazivanja);
                    html+=`
                    <div class="filmBooked">
                        <img src="${i.img.src}" alt="${i.img.alt}"/>
                        <h2>${i.naslov}</h2>
                        <p>Sum of booked tickets <span>${i.quantity}</span></p>
                        <p>Projection time <span>${i.time}</span></p>
                        <p class="izbrisiLs" onclick="izbrisiLs(${i.id})">Remove from orders</p>
                    </div>`;
                    
                });
                
                ispis('#orders',html);

            }
            
        }
        
        ispisMovieOrder();
 
    }
    
}
const izbrisiLs = (id) => {

    let movies = JSON.parse(localStorage.getItem('movieOrdersLs'));
    let filtriraj = movies.filter(movie=>movie.id !=id);
    localStorage.setItem('movieOrdersLs',JSON.stringify(filtriraj));
    orders();
    
}

// footer
const footer = () => {

    ajax(`${base}filmovi.json`,function(data){
        ispisPrvihPetFilmova(data);
       
    });
    function ispisPrvihPetFilmova(data){
        let broj = 0; 
        let htmlFooterFilmovi = '';
        for(let i of data){
            broj++;
            htmlFooterFilmovi +=`<a href="movies.html">${i.naslov}</a>` 
            if(broj==5){
                break;
            }
        }
        ispis('#linksFoo',htmlFooterFilmovi);
    }
}
