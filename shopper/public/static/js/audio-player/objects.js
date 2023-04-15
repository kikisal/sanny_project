/**
 * Exclusive script by weeki. 
 * 
 * @author weeki
 * 
 */
Base.__setModule('AudioPlayer', {
    Widgets: {
        Ball: function () {
            SimpleGFX.SceneObject.call(this);

            const { Ball } = AudioPlayer.Widgets;

            this.size = Ball.DEFAULT_SIZE;
            this.color = Ball.DEFAULT_COLOR;

            this.toResume = false;

            this.update = function () {

                if (SimpleGFX.SceneObject.update.call(this))
                    return;

                const audio = this.getParent().getAudioPlayer();

                /* mouse handling. */
                const mouse = this.getRendererContext().getMouse();

                if (mouse.down) {
                    if (audio.isPlaying()) {
                        this.toResume = true;
                        audio.pause();
                    }

                    const matrix = this.getRendererContext().getCanvasContext().getTransform();

                    this._position.x = mouse.x - matrix.e;
                    if (this._position.x < 0)
                        this._position.x = 0;

                    if (this._position.x > this.getParent().width)
                        this._position.x = this.getParent().width;

                    audio.setCursor((this._position.x / this.getParent().width) * audio.getDuration());

                } else {
                    if (this.toResume) {
                        audio.play();
                        this.toResume = false;
                    }


                    if (audio.isPlaying()) {
                        const currTime = audio.getCurrentTime() / audio.getDuration();
                        this._position.x = currTime * this.getParent().width;
                    }

                    if (audio.fullyPlayed()) {
                        audio.pause();
                        audio.setCursor(0);

                        this.moveTo({ x: 0, y: 0 }, 1000);

                        setTimeout(function () { if (!audio.isPlaying()) audio.stop(); }.bind(this), 5000);

                        this.getParent().getAudioPlayer().onFullyPlayed();
                    }
                }

            };

            this.draw = function () {
                const ctx = this.getRendererContext().getCanvasContext();
                ctx.fillStyle = this.color;

                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();
            }
        },

        TimeLine: function () {
            SimpleGFX.SceneObject.call(this);

            const { TimeLine, Ball } = AudioPlayer.Widgets;

            this.size = TimeLine.DEFAULT_SIZE;
            this.portion = .8;
            this.width = 0;
            this.color = TimeLine.DEFAULT_COLOR;
            this.openPosition = null;
            this.closePosition = null;
            this._audioPlayer = null;

            this.ball = SimpleGFX.ObjectCreator(Ball);

            this.push(this.ball);

            this.ball.setPosition({ x: 0, y: 0 });

            this.setAudioPlayer = function (audioPlayer) {
                this._audioPlayer = audioPlayer;
            };

            this.getAudioPlayer = function () {
                return this._audioPlayer;
            };

            this.close = function (onCloseListener) {

                this.moveTo(this.closePosition, 2000, onCloseListener);
            };

            this.open = function () {
                this.moveTo(this.openPosition, 6000);
            };


            this.init = function () {
                this.width = this.getRendererContext().getCanvasWidth() * this.portion;
            };

            this.draw = function () {
                const ctx = this.getRendererContext().getCanvasContext();
                ctx.fillStyle = this.color;
                // this.getRendererContext().fillRect()

                ctx.fillRect(0, -this.size / 2, this.width, this.size);
            }
        },
    },

    GenTimeline: function () {
        return SimpleGFX.ObjectCreator.spawn(AudioPlayer.Widgets.TimeLine);
    },

    GenBall: function () {
        return SimpleGFX.ObjectCreator.spawn(AudioPlayer.Widgets.Ball);
    }
});

AudioPlayer.Widgets.TimeLine.DEFAULT_SIZE = 2;
AudioPlayer.Widgets.TimeLine.DEFAULT_COLOR = '#ff0000';
AudioPlayer.Widgets.Ball.DEFAULT_SIZE = 6;
AudioPlayer.Widgets.Ball.DEFAULT_COLOR = '#bbbef8';
