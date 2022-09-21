// Local Javascript for each webpage
function encode(str){
	const encoded = str.replace(/[\u00A0-\u9999<>\&\u0027\&]/gim, 
	(i) => `&#${i.charCodeAt(0)};`);
	console.log('encoded')
	console.log(encoded)
	return encoded;
};



function onResponse(response){
	console.log(response.status);
	console.log("on response");
	// location.href("post_confirm");
};


function formatMessage(title, text){
	const a = encode(title);
	const b = encode(text);
	const message ={
        title: a,
        text: b
	};

	return JSON.stringify(message);
};


// form handler 
function onSubmit(){
	//// stop the form being submitted by default
	// e.preventDefault();
    const title = document.querySelector('#title').value;
	const text = document.querySelector('#text').value;
	const serializedMessage = formatMessage(title, text);
	const encodedMessage = encode(serializedMessage);
	console.log(encodedMessage);
	fetch('submit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: encodedMessage
		}
	)
		.then(onResponse);
	// e.stopPropagation();
};

// 2fa code handler
function onCodeSubmit(){
	//// stop the form being submitted by default
	// e.preventDefault();
    const code = document.querySelector('#code').value;
	const serializedMessage = formatMessage(code, text);
	const encodedMessage = encode(serializedMessage);
	console.log(encodedMessage);
	fetch('submit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: encodedMessage
		}
	)
		.then(onResponse);
	// e.stopPropagation();
};

// // // SUBMIT NEW POST ABOVE
// // //
// // // SUMBIT EDITED POST BELOW

// function encode(str){
// 	const encoded = str.replace(/[\u00A0-\u9999<>\&\u0027\&]/gim, 
// 	(i) => `&#${i.charCodeAt(0)};`);
// 	console.log('encoded')
// 	console.log(encoded)
// 	return encoded;
// };



function onResponse(response){
	console.log(response.status);
	console.log("on response");
	// location.href("post_confirm");
};


function formatMessageEdit(title, text, id){
	// const a = encode(title);
	// const b = encode(text);
	const message ={
        title: title,
        text: text,
		id: id
	};

	return JSON.stringify(message);
};

function onEditResponse(){
	document.getElementById("formWrapper").style.display = "none";
	document.getElementById("editConfirm").style.display = "block";
}


// form handler 
function onSubmitEdit(){
	//// stop the form being submitted by default
	// e.preventDefault();
    const title = document.querySelector('#title').value;
	const text = document.querySelector('#text').value;
	const id = document.querySelector('#idHidden').value;
	const serializedMessage = formatMessageEdit(title, text, id);
	const encodedMessage = encode(serializedMessage);
	console.log(encodedMessage);
	fetch('submitEdit', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: encodedMessage
		}
	)
		.then(onEditResponse);
	// e.stopPropagation();
};

// // // SUBMIT EDITED POST ABOVE
// // //
// // // DELETE POST BELOW

function formatMessageDelete(id){
	const message ={
		id: id
	};

	return JSON.stringify(message);
};

function onDeleteResponse(){
	document.getElementById("formWrapper").style.display = "none";
	document.getElementById("deleteConfirm").style.display = "block";
}

function onDelete(){
	// e.preventDefault();
	const id = document.querySelector('#idHidden').value;
	const serializedMessage = formatMessageDelete(id);
	console.log(serializedMessage);
	fetch('deletePost', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: serializedMessage
		}
	)
		.then(onDeleteResponse);
	//  e.stopPropagation();
};

// // // DELETE POST ABOVE

// // // DISPLAY POSTS ON INDEX BELOW

// const submit = document.querySelector('#submit'); 
// submit.addEventListener('click', onSubmit);


//Displays blog posts on homepage
function processJSON(json){
	const rows = json.rows;
	const wrapper = document.querySelector('#postwrapper');
	console.log(rows);
	const x = JSON.stringify(json.data);
	const y = JSON.parse(x);

	const decodeHtmlEntity = function(str) {
		return str.replace(/&#(\d+);/g, function(match, dec) {
		  return String.fromCharCode(dec);
		});
	  };

	for( let i = 0; i < rows ; i++){

		const linkFrag = '/linktest/' + y[i].id;
		const div = document.createElement('div');
		const link = document.createElement('a')
		link.setAttribute('href', linkFrag)

		div.className = "content bg-blue-500  no-underline w-3/5 max-h-44 p-4 m-4 rounded-xl ";
		div.setAttribute('href', link)
		const title = document.createElement('p');
		const post = document.createElement('p');
		const date = document.createElement('p');
		const userName = document.createElement('p');

		post.className = "line-clamp-3";
		title.className="text-center text-2xl font-bold";
		date.className = "text-right text-sm";
		userName.className = "text-left text-sm";
		title.innerHTML = decodeHtmlEntity(y[i].title);
		post.innerHTML = decodeHtmlEntity(y[i].post);
		date.innerHTML = decodeHtmlEntity(y[i].created_at);
		userName.innerHTML = y[i].username;
		link.appendChild(title);
		link.appendChild(post);
		link.appendChild(date);
		link.appendChild(userName);

		div.appendChild(link);

		wrapper.appendChild(div);

	};


};

function processDashJSON(json){
	const rows = json.rows;
	const wrapper = document.querySelector('#postwrapper');
	console.log(rows);
	const x = JSON.stringify(json.data);
	const y = JSON.parse(x);

	const decodeHtmlEntity = function(str) {
		return str.replace(/&#(\d+);/g, function(match, dec) {
		  return String.fromCharCode(dec);
		});
	  };

	for( let i = 0; i < rows ; i++){

		const linkFrag = '/editpost/' + y[i].id;
		const div = document.createElement('div');
		const link = document.createElement('a')
		link.setAttribute('href', linkFrag)

		div.className = "content bg-blue-500  no-underline w-3/5 max-h-44 p-4 m-4 rounded-xl ";
		div.setAttribute('href', link)
		const title = document.createElement('p');
		const post = document.createElement('p');
		const date = document.createElement('p');
		const username = document.createElement('p');

		post.className = "line-clamp-3";
		title.className="text-center text-2xl font-bold";
		date.className = "text-right text-sm";
		username.className = "text-left text-sm";
		title.innerHTML = decodeHtmlEntity(y[i].title);
		post.innerHTML = decodeHtmlEntity(y[i].post);
		date.innerHTML = decodeHtmlEntity(y[i].created_at);
		username.innerHTML = y[i].username;
		link.appendChild(title);
		link.appendChild(post);
		link.appendChild(date);
		link.appendChild(username);

		div.appendChild(link);

		wrapper.appendChild(div);

	};


};

function postResponse(response){
	console.log(response.status);
	response.json().then(processJSON);
};

function postResponseDash(response){
	console.log(response.status);
	response.json().then(processDashJSON);
};

function postError(error){
	console.log(error);
};

function indexPosts(){
	fetch('/posts').then(postResponse, postError);
};

function indexOwnPosts(){
	console.log("indexownposts")
	fetch('/own_posts').then(postResponseDash, postError);
};

// // // DISPLAY POSTS ON INDEX ABOVE
// // // ACCOUNT CREATION SUBMIT BELOW

function onResponseCreate(response){
	console.log(response.status);
	console.log("on response");
	// location.href("post_confirm");
};


function formatMessageCreate(title, text){
	// // // Here you pass your values in as an array. You can choose to encode these first if you want, otherwise just don't pass them through the encode function
	const a = encode(title);
	const b = encode(text);
	const message ={
        title: a,
        text: b
	};
	// // // returns you to the form handler block. Stringify makes the array a JSON object
	return JSON.stringify(message);
};

// // form handler
// function accountCreate(e){
// // // stop the form being submitted by default if using an event listener. If not, remove the e argument and anything related to it
// // // and call the the function as an onclick attribute on the html button.
// 	e.preventDefault();
// // // Pull the values of the form using a query selector to for each input field using a unique id set on each field
//     const title = document.querySelector('#title').value;
// 	const text = document.querySelector('#text').value;
// // // We pass the values of the form through to the server as a JSON. Pass the variables you've just set above as arguments to formatMessage
// 	const serializedMessage = formatMessage(title, text);
// // // I'm not 100% sure if the encodedMessage var is needed now I'm looking at it because you encode the values above and I have completely forgotten why I've encoded
// // // a second time below. Either leave as is, or you'll probably be fine to remove and just replace encodedMessage in the body of the fetch request with serializedMessage
// 	const encodedMessage = encode(serializedMessage);
// 	console.log(encodedMessage);
// 	fetch('submit', {  method: 'POST',
// 				  headers: {
//       			  	'Content-Type': 'application/json'
// 				  },
// 				  body:encodedMessage
// 			   }
// 		)
// 		.then(onResponse);
// };


// // // Event listener for a form. Change variable name and query selector to the id of the form button you want to listen out for.
// const submit = document.querySelector('#submit'); 
// submit.addEventListener('click', onSubmit);
