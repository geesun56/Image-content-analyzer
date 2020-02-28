img_data = '';

function search(){
    let client_id = '3UEwyOI1qSgQJflCNylijAdoWdqPr_JtzJ2CGM7vFkw';
    var keyword = document.querySelector("#keyword").value;
    const request = new XMLHttpRequest();   // Just means I can not do assigning something else. making a request
    console.log(client_id, keyword);
    request.open("GET", "https://api.unsplash.com/search/photos/?client_id="+client_id+"&query="+keyword, true); 

    request.onload = function() {
        img_data = JSON.parse(this.response);
    
        if (request.status == 200) {
            console.log(`Data loaded`);
        }
        else{
            console.log(`Error occured. Status : ${request.status}`)
        }

        var img_space = document.querySelector("#img_space")
        
        img_list = img_data.results

        img_list.forEach(new_img => {
            var image = document.createElement("img");
            image.src = new_img.urls.small
            image.onclick= function (){return select(new_img.urls.small);};
            img_space.appendChild(image);

        });

    }

    request.send(); // initialize the connection - at this command it actually sends a request to the server
}

function select(url){
    var img_space = document.querySelector("#img_space")
    img_space.innerHTML= ""

    var image = document.createElement("img");
    image.src = url
    image.onclick= function (){return analyze();};
    img_space.appendChild(image);

}

function printDesc(){
    let selected_movie = document.querySelector("#ghibli_list").selectedIndex;
    var description = document.createElement('p')
    var desc_text = document.createTextNode(movie_data[selected_movie].description)
    var desc_board = document.querySelector('#descDiv')

    description.appendChild(desc_text)
    desc_board.innerHTML = ''
    desc_board.appendChild(description)
    
}

function analyze(){
    console.log("Analyze API!!");
}
