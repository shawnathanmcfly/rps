
var c = document.getElementById("game-window");
var ctx = c.getContext("2d");
var bg = document.getElementById("bg");
var rock = document.getElementById("rock");
var paper = document.getElementById("paper");
var cut = document.getElementById("cut");
var rock1 = 0;
var paper1 = 1;
var cut1 = 2;
var position;
var myName;

var myId;
var playerScore = 0;
var oppScore = 0;

function pick( choice ){

    var opp;

    ctx.clearRect(0, 0, 200, 200);

    switch( choice ){
        case rock1:
        ctx.drawImage(rock, c.width / 2 - 100, c.height - 100, c.width / 10, 100);
        firebase.database().ref().child( myId ).update({
            choice: "rock"
        });
        break;
        case paper1:
        ctx.drawImage(paper, c.width / 2 - 100, c.height - 100, c.width / 10, 100);
        firebase.database().ref().child( myId ).update({
            choice: "paper"
        });
        break;
        case cut1:
        ctx.drawImage(cut, c.width / 2 - 100, c.height - 100, c.width / 10, 100);
        firebase.database().ref().child( myId ).update({
            choice: "cut"
        });
        break;
        default:
        break;
    }

    /*opp = Math.floor(Math.random() * 3);
    if( opp === rock1 ){
        ctx.drawImage(rock, 800 / 2 - 100, 5, 100, 100);
    }else if( opp === paper1 ){
        ctx.drawImage(paper, 800 / 2 - 100, 5, 100, 100);
    }else if( opp === cut1 ){
        ctx.drawImage(cut, 800 / 2 - 100, 5, 100, 100);
    }

    if( (choice === rock1 && opp === cut1) ||
        (choice === cut1 && opp === paper1) ||
        (choice === paper1 && opp === rock1) ){
            ctx.font="20px Georgia";
            ctx.fillText("You Win!",10,50);
            playerScore++;
            
            
    }else if( (choice === rock1 && opp === rock1) ||
               (choice === cut1 && opp === cut1) ||
                (choice === paper1 && opp === paper1) ){
        
                ctx.font="20px Georgia";
                ctx.fillText("Draw",10,50);
        
    }else{
        ctx.font="20px Georgia";
        ctx.fillText("YOU LOSE!",10,50);
        oppScore++;
    }*/

    
    ctx.fillText("PLAYER: " + playerScore ,10,70);
    ctx.fillText("JERK: " + oppScore ,10,90);

}

window.onload = function(){

    firebase.database().ref( 'numPlayers' ).transaction( curPlayers => {

        return curPlayers + 1;
    }).then( snap =>{

        myName = "player" + snap.snapshot.node_.value_;

        myId = firebase.database().ref().push({

            curMsg : "",
            name : myName
        });

        

        $("#msg-window").append( "<p style='color:green; font-weight:bold'>" + myName + " connected</p>" );
        
        myId.onDisconnect().remove();
    });    

    $("#send-msg").on( "click", () => {

        firebase.database().ref().update({

            curMsg : "<p><strong style='color:yellow'>" + 
            myName + 
            
            ": </strong>" + $("#chat-window").val() + "</p>"
        });

    });

    firebase.database().ref().on( "child_added", data => {

        if( data.key === "curMsg"){
            $("#msg-window").append( data.val() );
            $("#chat-window").val('');
            $("#msg-window").scrollTop( $("#msg-window")[0].scrollHeight );
        }
    });

    firebase.database().ref().on( "child_changed", data => {

        if( data.key === "curMsg"){
            $("#msg-window").append( data.val() );
            $("#chat-window").val('');
            $("#msg-window").scrollTop( $("#msg-window")[0].scrollHeight );
        }
    });

    

    //remove self from database on window or tab exit or refresh
    
}