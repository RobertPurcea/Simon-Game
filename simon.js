$(document).ready(function() {
    var posArray = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
    var AI = [];
    var user = [];
    var strictMode = false;

    //power on/off
    var power = false;
    $("#main").click(function() {
        //play switch sound
        var turn = document.getElementById("turn");
        turn.play();

        //turn off everything on power off
        power = !power;
        if (power) {
            $("#start").removeClass("disabledButton");
            $("#strict").removeClass("disabledButton");
            buttonSound();
        } else {
            $("#strict").removeClass("activeStrict");
            strictMode = false;
            $(".btn").addClass("disabledButton");
            $("#start").addClass("disabledButton");
            $("#strict").addClass("disabledButton");
            $("#score span").html(0);
            user = [];
            AI = [];
        }

        //switch animation
        $("#nd").toggleClass("second");
        $("#st").toggleClass("first");
    });

    //Sound play while pressing one of the four coloured buttons
    function buttonSound() {
        var tl = document.getElementById("tl");
        var topLeft = document.getElementById("topLeft");
        topLeft.addEventListener("mousedown", topLeftFunction);

        function topLeftFunction() {
            tl.load();
            tl.play();
        }


        var tr = document.getElementById("tr");
        var topRight = document.getElementById("topRight");
        topRight.addEventListener("mousedown", topRightFunction);

        function topRightFunction() {
            tr.load();
            tr.play();
        }

        var bl = document.getElementById("bl");
        var bottomLeft = document.getElementById("bottomLeft");
        bottomLeft.addEventListener("mousedown", bottomLeftFunction);

        function bottomLeftFunction() {
            bl.load();
            bl.play();
        }

        var br = document.getElementById("br");
        var bottomRight = document.getElementById("bottomRight");
        bottomRight.addEventListener("mousedown", bottomRightFunction);

        function bottomRightFunction() {
            br.load();
            br.play();
        }
    }

    //MAIN GAME FLOW
    $("#start").on("click", function() {
        var controlSound = document.getElementById("controlButtons");
        controlSound.play();
        $("#start").addClass("disabledButton");
        $("#strict").addClass("disabledButton");
        AI.push(random());
        setTimeout(function() {
            timer(0, AI);
        }, 1000);
    });

    //User Turn Logic
    function userPlay() {

        //POWER OFF ==> STOP
        if (!power) {
            return;
        }

        //enable buttons
        $(".btn").removeClass("disabledButton");

        //counter for comparing the AI and USER moves
        var j = 0;
        $(".btn").off("click").click(function() {
            //get current location
            user.push(this.id);

            //if the user made a mistake ELSE if he completed all the moves
            if (user[j] !== AI[j]) {
                if (strictMode) {
                    wrong();
                    AI = [];
                    user = [];
                    $(".btn").addClass("disabledButton");
                    AI.push(random());
                    setTimeout(function() {
                        timer(0, AI);
                    }, 1000);
                    $("#score span").html(0);
                } else {
                    wrong();
                    $(".btn").addClass("disabledButton");
                    user = [];
                    setTimeout(function() {
                        timer(0, AI);
                    }, 1000);
                }
            } else if (j === (AI.length - 1)) {
                if (AI.length === 19) {
                    alert("You won, good job. I thought noone would have your patience :D");
                    AI = [];
                    user = [];
                    $("#score span").html(0);
                } else {
                    $("#score span").html(user.length);
                    AI.push(random());
                    $(".btn").addClass("disabledButton");
                    user = [];
                    setTimeout(function() {
                        timer(0, AI);
                    }, 1000);
                }

            }
            //move on to the next move
            j++;
        });
    }

    //when the user misscliked the tile
    function wrong() {
        $("#deny")[0].play();
    }

    //play button sound when it's ai's turn
    function aiButtonSound(pos) {
        switch (pos) {
            case "topLeft":
                $("#tl")[0].play();
                break;
            case "topRight":
                $("#tr")[0].play();
                break;
            case "bottomLeft":
                $("#bl")[0].play();
                break;
            case "bottomRight":
                $("#br")[0].play();
                break;
        }
    }

    //this is how AI works
    function timer(i, AI) {
        if (!power) {
            return;
        }
        //Wait a few milisecons between every AI action
        setTimeout(function() {
            //Color
            $("#" + AI[i]).addClass("ai" + AI[i]);
            //Sound
            aiButtonSound(AI[i]);

            //After some time, remove both color and sound, and call timer again if there are more moves left
            setTimeout(function() {
                $("#" + AI[i]).removeClass("ai" + AI[i]);
                if (i < (AI.length - 1)) {
                    i++;
                    timer(i, AI);
                } else {
                    //End of AI
                    userPlay();
                }
            }, (700 - AI.length * 25));
        }, 100);

    }

    //get random tile position
    function random() {
        var rand = Math.floor(Math.random() * 4);
        return posArray[rand];
    }

    //Strict Mode click
    $("#strict").click(function() {
        $("#strict").toggleClass("activeStrict");
        strictMode = !strictMode;
        var sound = document.getElementById("controlButtons");
        sound.play();
    });

    //Display Instructions
    $("#instructions").click(function() {
        $("#info").animate({
            height: 'toggle'
        });

    });

    //Collapse/Show Simon Web Page
    $("#info button").on("click", function() {
        $("#info").animate({
            height: 'toggle'
        });
    });

    //Collapse/Show Legend
    $("#legend").on("click", function() {
        $("#legend ul").animate({
            height: 'toggle'
        });
    });
});
