//A simple html5 draw board
var prepareCanvas = function () {
        "use strict";
        /*global document */
        var canDiv = document.getElementById("canvasArea"),
            canvasWidth = "680",
            canvasHeight = "400",
            canvas = document.createElement("canvas"),
            socket = io();
        canvas.setAttribute("width", canvasWidth);
        canvas.setAttribute("height", canvasHeight);
        canvas.setAttribute("id", 'canvas');
        canDiv.appendChild(canvas);
        context = canvas.getContext("2d");

        // jslint warns array liter notation [] is preferable.
        var clickX = [],
            clickY = [],
            clickDrag = [],
            paint;

        function addClick(x, y, draggin) {
            clickX.push(x);
            clickY.push(y);
            clickDrag.push(draggin);

        }


        function redraw(clickDrag, clickX, clickY) {
            var context = canvas.getContext("2d"),
                i = 0;
            context.strokeStyle = "#df4b26";
            context.lineJoin = "round";
            context.lineWidth = 5;

            for (i = 0; i < clickX.length; i++) {
                context.beginPath();
                if (clickDrag[i] && i) {
                    context.moveTo(clickX[i - 1], clickY[i - 1]);
                } else {
                    context.moveTo(clickX[i] - 1, clickY[i]);
                }

                context.lineTo(clickX[i], clickY[i]);
                context.closePath();
                context.stroke();
            }
        }


        socket.on("drawing", function (msg) {
            redraw(msg.drag, msg.x, msg.y);
        });

        $("#canvas").mousedown(function (e) {
            var mouseX = e.pageX - this.offsetLeft,
                mouseY = e.pageY - this.offsetTop,
                paint = true;
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
            socket.emit("drawing", {
                drag : clickDrag,
                x : clickX,
                y : clickY
            });
        });

        $("#canvas").mousemove(function (e) {
            if (paint) {
                addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
                socket.emit("drawing", {drag : clickDrag, x : clickX, y : clickY});
            }
        });

        $('#canvas').mouseup(function (e) {
            paint = false;
        });

        $('#canvas').mouseleave(function (e) {
            paint = false;
        });

    };
