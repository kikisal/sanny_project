/**
 * Exclusive script by weeki. 
 * 
 * @author weeki
 * 
 */
(() => {

    function __lerp(a, b, f) {
        return (b - a) * f + a;
    }
	
	
	// poor temporary implementation.
	const InputHandler = {	
		
		_updateMouseCoords: function(e) {
			this.mouse.x = e.offsetX;
			this.mouse.y = e.offsetY;
			if (this.mouse.oldX !== undefined)
				this.mouse.dx = this.mouse.x - this.mouse.oldX;
			
			if (this.mouse.oldY !== undefined)
				this.mouse.dy = this.mouse.y - this.mouse.oldY;
			
			this.mouse.oldX = this.mouse.x;
			this.mouse.oldY = this.mouse.y;
		},
		
		mouseMove: function(e) {
			InputHandler._updateMouseCoords.call(this, e);
			this.mouse.moving = true;
		},
		
		mouseDown: function(e) {
			InputHandler._updateMouseCoords.call(this, e);
			this.mouse.down = true;
		},
		
		mouseUp: function(e) {
			InputHandler._updateMouseCoords.call(this, e);
			this.mouse.down = false;
			this.mouse.moving = false;
		},
		
		addContext: function(context) {
			
			const inputHandlerObj = {
				mouse: {
					x: 		undefined, 
					y: 		undefined, 
					down: 	undefined,
					moving: undefined
				}
			};
			
			context.inputHandlerObj = inputHandlerObj;
			
			context.ctx.canvas.addEventListener('mousedown', InputHandler.mouseDown.bind(inputHandlerObj));
			context.ctx.canvas.addEventListener('mouseup'  , InputHandler.mouseUp.bind(inputHandlerObj));
			context.ctx.canvas.addEventListener('mousemove', InputHandler.mouseMove.bind(inputHandlerObj));
		}
	}

    function ObjectCreator(class_type)
    {
        return new class_type;
    }

    function SharedRenderer()
    {
        this._renderers = [];

        this.addRenderer = function(renderer) {
            if (this._renderers.includes(renderer))
                return;

            renderer._active = true;

            this._renderers.push(renderer);
            renderer.isShared = true;
            renderer.setSharedRenderer(this);

            return renderer;
        };

        this.renderers = function() {
            return this._renderers.length;
        };

        this.removeRenderer = function(renderer) {
            renderer._active = false;
            this._renderers.splice(this._renderers.indexOf(renderer), 1);
        };

        this.nextFrames = function() {
            requestAnimationFrame(this.mainLoop.bind(this));
        };

        this.mainLoop = function (time) {
        
            for (const render of this._renderers)
                render.renderLoop(time);

            this.nextFrames();
        };

        this.run = function() {
            this.nextFrames();
        };
    }

    SharedRenderer.createRenderer = function() {
        return new SimplerRenderer();
    }
    
    function SimplerRenderer()
    {
        // setting basic properties
        this.ctx             = null;
        this.currTree        = null;
        
        this.isShared        = false;
        this._sharedRenderer = null;
        this._active = true;
	
		this.inputHandlerObj = undefined;
        
        this._time = null;
		
			
		this.getMouse = function() {
			return this.inputHandlerObj.mouse;
		};

        this.getCurrentTimeMillis = function() {            
            return this._time;
        };
    
        this.setSharedRenderer = function(sRenderer) {
            this._sharedRenderer = sRenderer;
        };

        this.prepare = function(domElement)
        {
            let canvas = typeof domElement === 'string' ? document.querySelector(domElement) : domElement;
            if (!canvas)
                canvas = document.createElement('canvas');
            
            this.ctx = canvas.getContext('2d');
  
  
			InputHandler.addContext(this);
  
            return canvas;
        };
    
        this.setCurrTree = function(currTree)
        {
            if (currTree)
            {
                this.currTree = currTree;
                this.currTree.setContext(this, this.currTree.objects);    
            }
        };
    
        this.nextFrame = function() {
            if (!this.isShared)
                requestAnimationFrame(this.renderLoop.bind(this));
        };
    
        this.draw = function(objTree) {
            for (const obj of objTree)
            {
                
                this.ctx.save();
                
                obj.update();

                if (!this._active)
                    return;

                this.ctx.translate(obj._position.x, obj._position.y);
                obj.draw();
                if (obj.hasChildren())
                    this.draw(obj.children);
    
                this.ctx.restore();
            }
        };
        
        this.renderLoop = function(time) {

            if (!this._active)
                return;

            this._time = time;

            if (!this.currTree)
            {
                this.nextFrame();
                return;
            }
    
            this.clearCanvas();
            this.draw(this.currTree.objects);
            
            this.nextFrame();
        };
    
        this.clearCanvas = function()
        {
            const ctx = this.ctx;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        };
    
        this.render = function(currTree)
        {
            this.setCurrTree(currTree);
            this.nextFrame();
        };
    
        this.getCanvasContext = function() {
            return this.ctx;
        };

        this.getCanvasHeight = function() {
            return this.ctx.canvas.height;
        };
        
        this.getCanvasWidth = function() {
            return this.ctx.canvas.width;
        };
    }
    
    ObjectCreator.spawn = function(obj) {
        return new obj;
    }

    function ObjectAnimation()
    {
        this.complete = false;
        this.update = function(scene_obj)
        { /** do nothing */ };
    }

    function MoveObjectAnimation(from, target, duration, onAnimationCompleted)
    {

        ObjectAnimation.call(this);

        this.from     = from;
        this.target   = target;
        this.onAnimationCompleted = onAnimationCompleted || function() {};

        this.startTime   = null;
        this.endTime     = null;
        this.duration    = duration;

        this.update = function(scene_obj) {

            const currTime = scene_obj.getRendererContext().getCurrentTimeMillis();

            if (!this.startTime)
            {
                this.startTime = currTime;
                this.endTime   = this.startTime + this.duration;
            }
            
            const deltaTime = this.endTime - currTime;
            const factor    = deltaTime / this.duration;

            scene_obj._position.x = __lerp(this.from.x, this.target.x, 1 - factor);
            scene_obj._position.y = __lerp(this.from.y, this.target.y, 1 - factor);            
            
            if ( factor <= 0 )
            {
                console.log('completed.');
                scene_obj.position = this.target;
                this.complete = true;

                this.onAnimationCompleted();
            }
        }
    }

    ObjectAnimation.moveTo = function(from, target, duration, callback) {
        return new MoveObjectAnimation(from, target, duration, callback);
    };
    
    function SceneObject()
    {
        this._position = {x: 0, y: 0};
        this._renderContext = null;
        this._parent = null;
        this._animation = null;

        this.style = {};
        this.children = [];
    
        this.hasChildren = function() {
            return this.children.length > 0;
        }

        this.moveTo = function(pos, duration, callback) {
            this._animation = ObjectAnimation.moveTo(this._position, pos, duration, callback);
        };
    
        this.push = function(child) {
            this.children.push(child);
            child._renderContext = this._renderContext;
            child._parent = this;
        }

        this.getParent = function() {
            return this._parent;
        }
    
        this.draw = function() { /** do nothing really. */ }

        this.update = function() {
            if (this._animation)
            {

                this._animation.update(this);
                if (this._animation.complete)
                {
                    this._animation = null;
                    return true;
                }

                return false;
            }

            return false;
        }
    
        this.setRenderContext = function(ctx) {
            this._renderContext = ctx;
        }
    
        this.getRendererContext = function() { return this._renderContext; }
    
        this.setPosition = function(position) {
            this._position = position;
        }
    }

    SceneObject.update = function() {
        if (this._animation)
        {
            this._animation.update(this);
            if (this._animation.complete)
            {
                this._animation = null;
                return false;
            }

            return true;
        }

        return false;
    }
    
    function Tree()
    {
        this.objects = [];
        this._renderContext = null;
    
        this.push = function(el) {
            if (!Array.isArray(el))
            {
                el.setRenderContext(this._renderContext);
                this.objects.push(el);
            }
            else
            {
                for (const obj of el)
                {
                    obj.setRenderContext(this._renderContext);
                    this.objects.push(obj);
                }
            }
        }
    
        this.setContext = function(ctx, objects) {
            this._renderContext = ctx;
    
            for (const obj of objects)
            {
                obj.setRenderContext(ctx);
                if (obj.hasChildren())
                    this.setContext(ctx, obj.children);
            }
        }
    }
    
    function createTree()
    {
        return new Tree();
    }
    
    Base.__setModule("SimpleGFX", {
        SimplerRenderer: SimplerRenderer,
        ObjectCreator: ObjectCreator,
        Tree: Tree,
        SceneObject: SceneObject,
        createTree: createTree,
        SharedRenderer: SharedRenderer
    });
})();