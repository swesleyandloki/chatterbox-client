// YOUR CODE HERE:

//drink water


//timer function to getdata
//form to write messages
  //message
//button to send form
//make a button for rooms
//change rooms, create rooms, filter messages by room
//escape string function
//add users to FRIENDS list, friends show up in bold
//ajax url https://api.parse.com/1/classes/chatterbox
var IDStorage = {},
  roomStorage = {},
  roomFilter = null;
var isNew = function(idx) {
  if(IDStorage.hasOwnProperty(idx)){
    return false;
  } else {
    IDStorage[idx] = idx;
    return true;
  }
};


var updateRooms = function(){
  //is room already in list
  $('#roomNav').empty();
  for(var key in roomStorage){
    var room = $('<button>').attr('id','room').text(key);
    room.on("click",function() {
      IDStorage = {};
      roomFilter = $(this).text();
      roomString = '.'+ roomFilter;
      var roomOnly = $(roomString);
      $('#main').empty();
      $('#main').append(roomOnly);
    });
    $('#roomNav').append(room);
  }
}

$('#roomButton').click(function(){
  var roomName = $('#makeRoom').val();
  $('makeRoom').val('');
  var newRoom = $('<button>').attr('id','room').text(roomName);
  $('#roomNav').append(room);
  roomFilter = roomName;
  $('#main').empty();
});

$('h1').click(function(){
  event.preventDefault();
  console.log('h1 click');
  IDStorage = {};
  $('#main').empty();
  roomFilter = null;
});

//getdata with posts from people
var displayData = function(data){
  console.log(data);
  for (var i = 0; i < data.results.length; i++) {
    if(isNew(data.results[i].objectId) && (!roomFilter || data.results[i].roomname == roomFilter)){
       var message = data.results[i];
       var chat = $('<div>').addClass('chat').addClass(message.roomname).text(message.text);
       var username = $('<div>').addClass('username').text(message.username);
       chat.prepend(username);
       $("#main").prepend(chat);
       roomStorage[data.results[i].roomname] = data.results[i].roomname;
       updateRooms();
    }
  }
}

var sendMessage = function(object) { $.ajax({
  // always use this url
  url: 'https://api.parse.com/1/classes/chatterbox',
  type: 'POST',
  data: JSON.stringify(object),
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message sent');
  },
  error: function (data) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message');
  }
}); }

$('button').click(function() {
  var message = $('#sendChat').val();
  var object = {
    'username':window.location.search.slice(10),
    'text': message,
    'roomname': roomFilter || 'lbc'
  }
  sendMessage(object);
  $('#sendChat').val('');
});

var retrieveAllMessages = function(){
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',
    success: displayData
  });
};


setInterval(retrieveAllMessages, 1000);
// retrieveAllMessages();


// $.ajax({
//       url: this.props.url,
//       dataType: 'json',
//       success: function(data) {
//         this.setState({data: data});
//       }.bind(this),
//       error: function(xhr, status, err) {
//         console.error(this.props.url, status, err.toString());
//       }.bind(this)
//     });
