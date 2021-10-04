var formulario = document.querySelector("form");

var inscribir = (event) =>
{
    event.preventDefault();

    let repUser = document.getElementById("nombre").value;
    let repPag = document.getElementById("pagina").value;
    let repPerPag = document.getElementById("repoPagina").value;

    Promise.all([getUser(repUser), getRepo(repUser, repPag, repPerPag)]).then(([resultado1, resultado2]) =>
    {
        if (resultado1.message == "Not Found" || resultado2.message == "Not Found")
        {
            alert("Usuario no encontrado")
            return
        }

        writeToHTML(resultado1, resultado2)
    });
} 

formulario.addEventListener("submit", inscribir);

var getUser = async (paramUser) =>
{
    var dataFromAPI = await request(`https://api.github.com/users/${paramUser}`)
    return dataFromAPI
}

var getRepo = async (paramUser, paramPag, paramRepPerPag) =>
{
    var dataFromAPI = await request(`https://api.github.com/users/${paramUser}/repos?page=${paramPag}&per_page=${paramRepPerPag}`)
    return dataFromAPI
}

var request = async (paramUrl) =>
{
    var url = `${paramUrl}`

    var profileUrl = "" 
    var profileJson = ""

    try
    {
        profileUrl = await fetch(url)
        profileJson = await profileUrl.json()
    }
    catch (error)
    {
        console.log(error)
    }

    return profileJson
}

var writeToHTML = (param1, param2) =>
{
    let repos = ""

    for (let i = 0; i < param2.length; i++)
    {
        repos += `<a href="${param2[i].html_url}">${param2[i].name}</a><br>`
    }

    document.getElementById('resultados').innerHTML =
    `<div class="d-flex flex-row justify-content-between">
        <div>
            <h1>Datos de usuario</h1>
            <img src="${param1.avatar_url}" alt="avatar-alt" width="50%">
            <p>Nombre de usuario: ${param1.login}</p>
            <p>Nombre de login: ${param1.login}</p>
            <p>Cantidad de Repositorios: ${param1.public_repos}</p>
            <p>Localidad: ${param1.location}</p>
            <p>Tipo de usuario: ${param1.type}</p>
        </div>
        <div>
            <h1>Nombre de repositorios</h1>
            ${repos}
        </div>
    </div>`
}
