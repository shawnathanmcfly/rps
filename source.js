
var c = document.getElementById("game-window");
var ctx = c.getContext("2d");
var bg = document.getElementById("bg");
var rock = document.getElementById("rock");
var paper = document.getElementById("paper");
var cut = document.getElementById("cut");
var rock1 = 0;
var paper1 = 1;
var cut1 = 2;

var myId = undefined;
var myName;
var myChoice;
var myOpp;
var oppChoice = 0;
var playerScore = 0;
var oppScore = 0;




function pick( choice ){

    ctx.clearRect(0, 0, 200, 200);

    switch( choice ){
        case rock1:
        ctx.drawImage(rock, c.width / 2, c.height - 100, 100, 100);
        firebase.database().ref( myId ).update({
            choice: "rock"
        });
        myChoice = "rock";
        break;
        case paper1:
        ctx.drawImage(paper, c.width / 2, c.height - 100, 100, 100);
        firebase.database().ref( myId ).update({
            choice: "paper"
        });
        myChoice = "paper";
        break;
        case cut1:
        ctx.drawImage(cut, c.width / 2, c.height - 100, 100, 100);
        firebase.database().ref( myId ).update({
            choice: "cut"
        });
        myChoice = "cut";
        break;
        default:
        break;
    }

}

function results( choice, opp ){
    
    if( choice && opp ){

        if( opp === "rock" ){
            ctx.drawImage(rock, c.width / 2, 5, 100, 100);
        }else if( opp === "paper" ){
            ctx.drawImage(paper, c.width / 2, 5, 100, 100);
        }else if( opp === "cut" ){
            ctx.drawImage(cut, c.width / 2, 5, 100, 100);
        }

        ctx.clearRect( 0, 0, 150, 100 );

        if( (choice === "rock" && opp === "cut") ||
            (choice === "cut" && opp === "paper") ||
            (choice === "paper" && opp === "rock") ){
                ctx.font="20px Georgia";
                ctx.fillText("You Win!",10,50);
                
                playerScore++;
                
                
        }else if( choice === opp ){
            
            ctx.font="20px Georgia";
            ctx.fillText("Draw",10,50);
            
        }else{
            ctx.font="20px Georgia";
            ctx.fillText("YOU LOSE!",10,50);
            
            oppScore++;
        }

        oppChoice = 0;
        myChoice = 0;
        myId.child('choice').set( 0 );

        setTimeout( () => {
            ctx.clearRect( c.width / 2, 0, 200, c.height );
        }, 2000 );

        ctx.fillText("PLAYER: " + playerScore ,10,70);
        ctx.fillText("JERK: " + oppScore ,10,90);
    }
}

window.onload = function(){

    firebase.database().ref().once('value').then( childSnap => {

        if( childSnap.child('player1/online').val() === "no" && myId === undefined ){
            myId = firebase.database().ref('player1');
            myName = 'player1'
            myId.child('online').set( "filled" );
            myOpp = firebase.database().ref('player2');
            firebase.database().ref().update({
                curMsg : "<p><strong style='color:green'>" + myName.toUpperCase() + " CONNECTED</strong></p>"
            });
            firebase.database().ref("player1").onDisconnect().set({ online : "no", wins : 0, choice : 0});
            firebase.database().ref('player2').on( "child_changed", data => {
                
                if( data.key === "choice"){

                    results( myChoice, data.val() );

                    oppChoice = data.val();
                    
                }
            });
            firebase.database().ref('player1').on( "child_changed", data => {
                
                if( data.key === "choice"){

                    results( data.val(), oppChoice );

                   
                    
                }
            });
        }

        if( childSnap.child('player2/online').val() === "no" && myId === undefined ){
            myId = firebase.database().ref('player2');
            myName = 'player2'
            myId.child('online').set( "filled" );
            myOpp = firebase.database().ref('player1');
            firebase.database().ref().update({
                curMsg : "<p><strong style='color:green'>" + myName.toUpperCase() + " CONNECTED</strong></p>"
            });
            firebase.database().ref("player2").onDisconnect().set({ online : "no", wins : 0, choice : 0});
            firebase.database().ref('player1').on( "child_changed", data => {
                
                if( data.key === "choice"){
                    results( myChoice, data.val() );
                    
                    oppChoice = data.val();
                }
            });
            firebase.database().ref('player2').on( "child_changed", data => {
                
                if( data.key === "choice"){

                    results( data.val(), oppChoice );

                }
            });
        }
    });
        
    //when message has been sent, post it in message box
    $("#send-msg").on( "click", () => {
        firebase.database().ref().update({
            curMsg : "<p><strong style='color:yellow'>" +
            myName +
            ": </strong>" + $("#chat-window").val() + "</p>"
        });
    });

    firebase.database().ref().on( "child_changed", data => {
        if( data.key === "curMsg"){
            $("#msg-window").append( data.val() );
            $("#chat-window").val('');
            $("#msg-window").scrollTop( $("#msg-window")[0].scrollHeight );
        }
    });

}