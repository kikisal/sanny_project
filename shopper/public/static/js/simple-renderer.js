(() => {

    function ObjectCreator(obj)
    {
    
    }
    
    function SimplerRenderer()
    {
        // setting basic properties
        this.ctx = null;
        this.currTree = null;
    
        this.prepare = function(domQuery)
        {
            let canvas = document.querySelector(domQuery);
            if (!canvas)
                canvas = document.createElement('canvas');
            
            this.ctx = canvas.getContext('2d');
    
            return canvas;
        }
    
        this.setCurrTree = function(currTree)
        {
            this.currTree = currTree;
            this.currTree.setContext(this, this.currTree.objects);
        }
    
        this.nextFrame = function() {
            requestAnimationFrame(this.renderLoop.bind(this));
        }
    
        this.draw = function(objTree) {
            for (const obj of objTree)
            {
                this.ctx.save();
                this.ctx.translate(obj._position.x, obj._position.y);
                obj.draw();
                if (obj.hasChildren())
                    this.draw(obj.children);
    
                this.ctx.restore();
            }
        }
        
        this.renderLoop = function() {
            if (!this.currTree)
            {
                this.nextFrame();
                return;
            }
    
            this.clearCanvas();
            this.draw(this.currTree.objects);
            
            this.nextFrame();
        }
    
        this.clearCanvas = function()
        {
            const ctx = this.ctx;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
    
        this.render = function(currTree)
        {
            this.setCurrTree(currTree);
            requestAnimationFrame(this.renderLoop.bind(this));
        }
    
        this.getCanvasContext = function() {
            return this.ctx;
        }
    }
    
    ObjectCreator.spawn = function(obj) {
        return new obj;
    }
    
    function SceneObject()
    {
        this._position = {x: 0, y: 0};
        this._renderContext = null;
        this.style = {};
    
        this.children = [];
    
        this.hasChildren = function() {
            return this.children.length > 0;
        }
    
        this.push = function(child) {
            this.children.push(child);
            child._renderContext = this._renderContext;
        }
    
        this.draw = function() { /** do nothing really. */ }
    
        this.setRenderContext = function(ctx) {
            this._renderContext = ctx;
        }
    
        this.getRendererContext = function() { return this._renderContext; }
    
        this.setPosition = function(position) {
            this._position = position;
        }
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
        createTree: createTree
    });
})();