
(() => {
    const audioPlayers = [];
    let currentAudioPlayerPlaying = null;

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
    
    function AudioPlayer(src, targetNode, options)
    {
        this._audio            = new Audio(src);
        this._dom_canvas_node  = null;
        this._shadow_layer     = null;
    
        this._targetNode = targetNode;
        this._callBacks = {
            onPlaying: options.onPlaying,
            onPause: options.onPause,
            onStop: options.onStop,
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
                if (currentAudioPlayerPlaying)
                    currentAudioPlayerPlaying.stop();

                this._audio.play();
                this.showShadowLayer();

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

                this.hideShadowLayer();
                this._callBacks.onStop();
            }
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
            const ctx = this._dom_canvas_node.getContext('2d');
            ctx.fillRect(0, 0, 20, 20);

        };
    
        this._audio.addEventListener('loadeddata', this._onAudioLoaded.bind(this));
    }
    
    AudioPlayer.prototype = {
        getAudio: function() {
            return this._audio;
        },
    
        getDomNode: function() {
            return this._dom_canvas_node;
        },
    
        getTargetNode: function() {
            return this._targetNode;
        }
    };
    
    AudioPlayer.spawn = function(options) {
        console.log('spawing');
        const aud = new AudioPlayer(options.src, 'node' in options ? options['node'] : document.querySelector(options.query), Object.assign({}, options));
        audioPlayers.push(aud);
        return aud;
    }

    Base.__setModule('AudioPlayer', AudioPlayer);

})();