/**
 * Exclusive script by weeki. 
 * 
 * @author weeki
 * 
 */
(() => {

    Promise.all([Base.contentLoaded(), Includer.include([
        "simple-renderer.js",
        "audio-player/objects.js"
    ])]).then(initAudioPlayer);

    let resolvePromise = null;
    let fullFilled = false;

    let [createTree, SimplerRenderer, SceneObject, ObjectCreator, SharedRenderer] = [
        null, null, null, null, null
    ];

    let sharedRenderer = null;

    const audioPlayers = [];
    let currentAudioPlayerPlaying = null;

    Base.__setModule('AudioPlayer', {
        ready: new Promise((res, rej) => {
            if (fullFilled)
                res();
            else
                resolvePromise = res;
        })
    });

    function initAudioPlayer()
    {
        createTree      = SimpleGFX.createTree;
        SimplerRenderer = SimpleGFX.SimplerRenderer;
        SharedRenderer  = SimpleGFX.SharedRenderer;
        SceneObject     = SimpleGFX.SceneObject;
        ObjectCreator   = SimpleGFX.ObjectCreator;
        sharedRenderer  = new SharedRenderer();
        sharedRenderer.run();

        // init();
        resolvePromise();
        fullFilled = true;
    }
    
    function init()
    {
        // currTree.push([timeLine]);
    }


    function AudioPlayer(src, targetNode, options)
    {
        this._audio            = new Audio(src);

        this._renderer = SharedRenderer.createRenderer();

        const { GenTimeline } = Base.__getModule('AudioPlayer');

        this._timeLine  = GenTimeline();
        this._timeLine.setAudioPlayer(this);

        this._timeLine.style.horizontalMargin = 30;
        this._timeLine.size = 3;
        this._timeLine.color = '#ffffff';
        
        this._mainTree = createTree();
        this._mainTree.push([this._timeLine]);

        this._renderer.setCurrTree(this._mainTree);
        
        this._dom_canvas_node  = null;
        this._shadow_layer     = null;
    
        this._targetNode = targetNode;

        this._callBacks = {
            onPlaying: options.onPlaying,
            onPause: options.onPause,
            onStop: options.onStop,
            onFullyPlayed: options.onFullyPlayed,
            onError: options.onError
        };
    
        this.showShadowLayer = function() {
            this._shadow_layer.classList.add('active');
        };

        this.hideShadowLayer = function() {
            this._shadow_layer.classList.remove('active');
        };

        this.audioReady = function() {
            return this._audio && this._audio.readyState >= 2;
        };
    
        this.play = function() {
            if (this._audio.readyState >= 2)
            {
                if (currentAudioPlayerPlaying && currentAudioPlayerPlaying !== this)
                    currentAudioPlayerPlaying.stop();
                
                if (this.isPlaying())
                    return;

                this._audio.play();
                this.showShadowLayer();

                sharedRenderer.addRenderer(this._renderer);

                this._timeLine.open();

                currentAudioPlayerPlaying = this;

                // fire user events
                this._callBacks.onPlaying();
            }
        };
        
        this.pause = function() {
            if (this.audioReady())
            {
                this._audio.pause();
                // fire user events
                this._callBacks.onPause();
            }
        };
    
        this.stop = function() {
            if (this.audioReady())
            {
                this._audio.pause();
                this._audio.currentTime = 0;
                this._timeLine.close(function() {
                    sharedRenderer.removeRenderer(this._renderer);
                    this._renderer.clearCanvas();
                }.bind(this));

                this.hideShadowLayer();
                this._callBacks.onStop();
            }
        };

        this.fullyPlayed = function() {
            return this._audio.currentTime == this._audio.duration;
        };

        this.setCursor = function(time) {
            this._audio.currentTime = time;
        };

        this.onFullyPlayed = function() {
            this._callBacks.onFullyPlayed();
        };
    
        this.isPlaying = function() {
            return !this._audio.paused;
        };
    
        this._onAudioLoaded = function() {
            this._dom_canvas_node   = CreateAudioNode();
            this._shadow_layer      = CreateShadowLayer();
            
            const rect = this._targetNode.getBoundingClientRect();
    
            this._targetNode.appendChild(this._shadow_layer);
            this._targetNode.appendChild(this._dom_canvas_node);
    
            this._dom_canvas_node.width  = rect.width;
            this._dom_canvas_node.height = rect.height;

            this._renderer.prepare(this._dom_canvas_node);
            this._timeLine.init();
            this._timeLine.openPosition  = {x: ((1 - .8) * this._renderer.getCanvasWidth())/2, y: this._dom_canvas_node.height/2};
            this._timeLine.closePosition = {x: ((1 - .8) * this._renderer.getCanvasWidth())/2, y: this._dom_canvas_node.height + 10};
            
            this._timeLine.setPosition(Object.assign({}, this._timeLine.closePosition));
            
            // ctx.fillRect(0, 0, 20, 20);


        };
        
    
        this._audio.addEventListener('loadeddata', this._onAudioLoaded.bind(this));
    }
    
    AudioPlayer.prototype = {
        getAudio: function() {
            return this._audio;
        },

        getCurrentTime: function() {
            return this._audio.currentTime;
        },

        getDuration: function() {
            return this._audio.duration;
        },
    
        getDomNode: function() {
            return this._dom_canvas_node;
        },
    
        getTargetNode: function() {
            return this._targetNode;
        }
    };
    
    AudioPlayer.spawn = function(options) {
        
        if (!fullFilled)
            return null; // render engine not ready yet.
        
        const aud = new AudioPlayer(options.src, 'node' in options ? options['node'] : document.querySelector(options.query), Object.assign({}, options));
        audioPlayers.push(aud);
        return aud;
    }


    Base.__setModule('AudioPlayer', AudioPlayer);

    function CreateAudioNode()
    {
        const canvas = document.createElement('canvas');
        canvas.classList.add('audio-canvas');
        return canvas;
    }
    
    function CreateShadowLayer() {
        const el = document.createElement('div');
        el.classList.add('shadow-layer');
    
        return el;
    }
})();
