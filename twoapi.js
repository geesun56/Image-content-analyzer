img_data = '';
tag_data = '';
var img_space = document.querySelector("#img_space")

function search(){
    let client_id = '3UEwyOI1qSgQJflCNylijAdoWdqPr_JtzJ2CGM7vFkw';
    var keyword = document.querySelector("#keyword").value;
    let size = document.querySelector("#request_size").value
    

    img_space.innerHTML="";

    const request = new XMLHttpRequest();   // Just means I can not do assigning something else. making a request
    //console.log(client_id, keyword);
    request.open("GET", "https://api.unsplash.com/search/photos/?client_id="+client_id+"&query="+keyword+"&per_page="+size, true); 

    request.onload = function() {
        img_data = JSON.parse(this.response);
    
        if (request.status == 200) {
            //console.log(`Data loaded`);
        }
        else{
            console.log(`Error occured. Status : ${request.status}`)
        }

        
        
        img_list = img_data.results

        img_list.forEach(new_img => {
            var image = document.createElement("img");
            image.src = new_img.urls.small
            image.className = "search_pics"
            image.onclick= function (){return select(new_img.urls.small);};
            img_space.appendChild(image);
        });

    }

    request.send(); // initialize the connection - at this command it actually sends a request to the server
}

function select(url){
    
    img_space.innerHTML= ""

    var selected_image = document.createElement("img");
    selected_image.src = url
    selected_image.id = "selected_image";
    img_space.appendChild(selected_image);

    var analyze_div = document.createElement("div");
    analyze_div.className = "analyze_search"
    var request_msg = document.createTextNode("Select the kind of Analysis :  ");
    var request_option1 = document.createTextNode("Image Tag ");
    var request_option2 = document.createTextNode("Face Detection ");
    var request_type1 = document.createElement("input");
    var request_type2 = document.createElement("input");
    var request_button = document.createElement("button");

    request_type1.type = "radio";
    request_type1.value = "tag";
    request_type1.name = "request_types"

    request_type2.type = "radio";
    request_type2.value = "face";
    request_type2.name = "request_types"

    request_button.innerHTML = "Analyze"
    
    request_button.onclick = function(){let select = request_selected(); return analyze(url, select)};

    analyze_div.appendChild(request_msg);
    analyze_div.appendChild(request_option1);
    analyze_div.appendChild(request_type1);
    analyze_div.appendChild(request_option2);
    analyze_div.appendChild(request_type2);
    analyze_div.appendChild(request_button);

    img_space.appendChild(analyze_div)

}

function request_selected(){
    let radio_input = document.getElementsByName("request_types");
    console.log(radio_input);
    for(i = 0; i < radio_input.length; i++) {      
            if(radio_input[i].checked) 
                return radio_input[i].value;
        }

}

function analyze(url, type){
    console.log(url, type)
    var request = new XMLHttpRequest();
    let request_url = "";

    if (type == "tag") {
        request_url = "https://api.imagga.com/v2/tags?&image_url=" + url
    }else if (type == "face"){
        request_url = "https://api.imagga.com/v2/faces/detections?&return_face_attributes=1&image_url=" + url
    }
    
    request.open('GET', request_url, true);
    request.setRequestHeader("Authorization", "Basic YWNjXzc3MzM0NDQxZTU3MWI1OTo1YzM4NzU0MDExOWVmMDc0ODk1Nzk5YjkzOGY3YmZiMA==");

    request.onload = function() {
        analyze_data = JSON.parse(this.response);
    
        if (request.status == 200) {
            //console.log(`Data loaded`);
        }
        else{
            console.log(`Error occured. Status : ${request.status}`)
        }

        console.log(analyze_data);

        if (type == "tag") {
            print_tags(analyze_data.result.tags.slice(0,10));
        }else if (type == "face"){
            print_face_detection(analyze_data.result.faces);
        }
       
    }

    request.send();
}

function print_tags(data){
    console.log("print_tags", data);
    var tag_area = document.createElement("div");
    tag_area.appendChild(document.createTextNode("<Image Tagging result>"));
    tag_area.id = "tag_prediction" 
    var chart = document.createElement("table");

    for(i=0; i<data.length; i++){

        var trow = document.createElement('tr');

        var category = document.createElement('td');
        var ratio = document.createElement('td');

        var category_text = document.createTextNode(Math.round(data[i].confidence*100)/100);
        var ratio_text = document.createTextNode(data[i].tag.en);
        
        category.appendChild(category_text);
        ratio.appendChild(ratio_text);

        trow.appendChild(ratio);
        trow.appendChild(category);

        chart.appendChild(trow);
    }
    tag_area.appendChild(chart);
    img_space.appendChild(tag_area);
}

function print_face_detection(data){
    console.log("entered face detection!");
    var face_area = document.createElement("div");
    face_area.className = "face_prediction"
    face_area.appendChild(document.createTextNode("<Face Detection analysis>"));
    var chart = document.createElement("table");
    chart.id = "face_prediction"

    if(data.length == 0){
        return alert("No person in this image!");
    }
    
    for(i=0; i<data.length; i++){

        var trow = document.createElement('tr');

        var person = document.createElement('td');
        var age = document.createElement('td');
        var gender = document.createElement('td');
        var ethinity = document.createElement('td');
        var possibility = document.createElement('td');

        var person_text = document.createTextNode("Person "+(i+1));
        var age_text = document.createTextNode(data[i].attributes[0].label);
        var gender_text = document.createTextNode(data[i].attributes[1].label);
        var ethinity_text = document.createTextNode(data[i].attributes[2].label);
        var possibility_text = document.createTextNode(Math.round(data[i].confidence*100)/100);

        person.appendChild(person_text);
        age.appendChild(age_text);
        gender.appendChild(gender_text);
        ethinity.appendChild(ethinity_text);
        possibility.appendChild(possibility_text);
        

        trow.appendChild(person);
        trow.appendChild(age);
        trow.appendChild(gender);
        trow.appendChild(ethinity);
        trow.appendChild(possibility);

        chart.appendChild(trow);
    }
    face_area.appendChild(chart);
    img_space.appendChild(face_area);

}
