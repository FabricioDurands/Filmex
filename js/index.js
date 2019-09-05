let apiKey = '98719f44';
let ultimaPagina = 0;
let pages = 0;
let pesquisa = document.getElementById('search');

$(document).ready(function () {
    document.getElementById('pagination-container');
});

pesquisa.addEventListener('keypress', (e) => {

    if (e.keyCode === 13) {
        filmes();
    }
});


document.getElementById('btnSearch').addEventListener('click', () => {
    filmes();
});

function loadPage(id) {

    document.getElementById('movies-content').innerHTML = '';
    let api = 'http://www.omdbapi.com/?s=' + [pesquisa.value] + '&apikey=' + [apiKey] + '&type=movie&page=' + [id];
    $.ajax({
        url: api,
        type: 'get',
        dataType: 'json',
        success: function (data) {

            let items = data.Search;
            items.map(element => {

                document.querySelector('#movies-content').innerHTML += ` 
                <div class="lista lg-2"> 
                    
                    <div>
                    <h5  class="title">${element.Title}</h5>
                    </div>

                    <div  class="image-container">
                    <img id="imgFilme" onclick="loadModal('${element.imdbID}')" class="cards" src="${element.Poster}"> 
                   
                    </div>

                </div>`;
            });

        },
        error: function (error) {
            console.log(error);
        }
    });
}

function filmes() {

    let api = 'http://www.omdbapi.com/?s=' + [pesquisa.value] + '&apikey=' + [apiKey] + '&type=movie';
    document.getElementById('movies-content').innerHTML = '';
    pages = 1;

    $.ajax({
        url: api,
        type: 'get',
        dataType: 'json',
        success: function (data) {

            let items = data.Search;
            ultimaPagina = Math.ceil(parseInt(data.totalResults) / 10);

            items.map(element => {

                document.querySelector('#movies-content').innerHTML += ` 
                <div class="lista"> 
                    
                    <div>
                    <h5  class="title">${element.Title}</h5>
                    </div>

                    <div  class="image-container">
                    <img id="imgFilme" onclick="loadModal('${element.imdbID}')" class="cards" src="${element.Poster}"> 
                   
                    </div>

                </div>`;
            });
            init();
        },
        error: function (error) {
            console.log(error);
        }
    });
}




function loadModal(imdbID) {

    document.querySelector('#modal-header').innerHTML = ''
    document.querySelector('#modal-body').innerHTML = ''
    let api = 'http://www.omdbapi.com/?i=' + [imdbID] + '&apikey=' + [apiKey];

    $.ajax({
        url: api,
        type: 'get',
        dataType: 'json',
        success: function (data) {

            document.querySelector('#modal-body').innerHTML += ` 
               
                <div>
                <img class="fotoFilme" src="${data.Poster}"  </img>
                <div>

                <div class="info">
                
                    <p>
                    <label class="labelN"> Título: </label> ${data.Title}
                    </p>

                    <p>
                    <label class="labelN">  Diretor: </label> ${data.Director}
                    </p>

                    <p>  
                    <label class="labelN"> Atores: </label> ${data.Actors} 
                    </p>

                    <p>
                    <label class="labelN"> Gênero: </label> ${data.Genre}
                    </p>

                    <p> 
                    <label class="labelN"> Ano: </label> ${data.Year}
                    </p>

                    <p> 
                    <label class="labelN"> Duração: </label> ${data.Runtime}
                    </p>

                    <p> 
                    <label class="labelN"> País: </label> ${data.Country}
                    </p>

                    <p> 
                    <label class="labelN"> Avaliação: </label> ${data.imdbRating}
                    </p>

                    <p> 
                    <label class="labelN"> Plot: </label> ${data.Plot}
                    </p>
                
                </div>
                
            `;

            $("#modal").modal();

        },
        error: function (error) {
            console.log(error);
        }
    });
}


let Pagination = {

    code: '',

    Extend: function () {
        Pagination.size = ultimaPagina;
        Pagination.page = 1;
        Pagination.step = 3;
    },

    // add pages by number (from [s] to [f])
    Add: function (s, f) {
        for (let i = s; i < f; i++) {
            Pagination.code += `<a onclick="loadPage('${i}')">${i}</a>`;
        }
    },

    // add last page with separator
    Last: function () {
        Pagination.code += `<i>. . . .</i><a>${Pagination.size}</a>`;
    },

    // add first page with separator
    First: function () {
        Pagination.code += '<a>1</a><i>. . . .</i>';
    },

    // change page
    Click: function () {
        pages = +this.innerHTML;
        Pagination.Start();
    },

    // previous page
    Prev: function () {
        Pagination.page--;
        if (Pagination.page < 1) {
            Pagination.page = 1;
        }
        Pagination.Start();
    },

    // next page
    Next: function () {
        Pagination.page++;
        if (Pagination.page > Pagination.size) {
            Pagination.page = Pagination.size;
        }
        Pagination.Start();
    },


    // binding pages
    Bind: function () {
        let a = Pagination.e.getElementsByTagName('a');
        for (let i = 0; i < a.length; i++) {
            if (+a[i].innerHTML === pages) a[i].className = 'current';
            a[i].addEventListener('click', Pagination.Click, false);
        }
    },

    // write pagination
    Finish: function () {
        Pagination.e.innerHTML = Pagination.code;
        Pagination.code = '';
        Pagination.Bind();
    },

    // find pagination type
    Start: function () {
        if (Pagination.size < Pagination.step * 2 + 6) {
            Pagination.Add(1, Pagination.size + 1);
        }
        else if (pages < Pagination.step * 2 + 1) {
            Pagination.Add(1, Pagination.step * 2 + 4);
            Pagination.Last();
        }
        else if (pages > Pagination.size - Pagination.step * 2) {
            Pagination.First();
            Pagination.Add(Pagination.size - Pagination.step * 2 - 2, Pagination.size + 1);
        }
        else {
            Pagination.First();
            Pagination.Add(pages - Pagination.step, pages + Pagination.step + 1);
            Pagination.Last();
        }
        Pagination.Finish();
    },

    // create skeleton
    Create: function (e) {

        let html = ['<span></span>'];

        e.innerHTML = html.join('');
        Pagination.e = e.getElementsByTagName('span')[0];
    },

    // init
    Init: function (e, data) {
        Pagination.Extend(data);
        Pagination.Create(e);
        Pagination.Start();
    }
};



let init = function () {
    Pagination.Init(document.getElementById('pagination'), {
        size: ultimaPagina,
        page: 1,
        step: 3
    });
};

document.addEventListener('DOMContentLoaded', init, false);