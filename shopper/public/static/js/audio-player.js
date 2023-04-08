
Promise.all([Base.contentLoaded(), Includer.include([
    "simple-renderer.js"
])]).then(() => {

    const {createTree, SimplerRenderer, SceneObject, ObjectCreator} = SimpleGFX;

    TimeLine.DEFAULT_SIZE = 2;
    TimeLine.DEFAULT_COLOR = '#ff0000';
    Ball.DEFAULT_SIZE = 6;
    Ball.DEFAULT_COLOR = '#bbbef8';

    function init()
    {
    
        /* defined inside the framework somewhere. */
        const currTree = createTree();
        const renderer = new SimplerRenderer();
    
        TimeLine.prototype = Object.create(SceneObject.prototype);
    
        Ball.prototype = Object.create(SceneObject.prototype);
    
    
        const canvas = renderer.prepare('.canvas-player');
    
        if (!canvas)
            throw new Error;
    
        const rect    = canvas.getBoundingClientRect();
        canvas.width  = rect.width;
        canvas.height = rect.height;
    
        const timeLine  = GenTimeline();
        const ball      = GenBall();
    
        timeLine.setPosition({x: 0, y: canvas.height / 2});
        timeLine.style.horizontalMargin = 30;
        timeLine.size = 3;
        timeLine.color = '#ffffff';
        
        
        ball.setPosition({x: 0, y: 0});
        timeLine.push(ball);
        
        currTree.push([timeLine]);
    
        renderer.render(currTree);
    }
        
    function Ball()
    {
        SceneObject.call(this);

        this.size = Ball.DEFAULT_SIZE;
        this.color = Ball.DEFAULT_COLOR;

        this.draw = function() {
            const ctx = this.getRendererContext().getCanvasContext();
            ctx.fillStyle = this.color;

            // this.getRendererContext().fillRect()

            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
        }
    }


    function TimeLine()
    {
        SceneObject.call(this);

        this.size = TimeLine.DEFAULT_SIZE;
        this.color = TimeLine.DEFAULT_COLOR;

        this.draw = function() {
            const ctx = this.getRendererContext().getCanvasContext();
            ctx.fillStyle = this.color;
            // this.getRendererContext().fillRect()

            ctx.fillRect(0, -this.size / 2, ctx.canvas.width, this.size);
        }
    }

    function GenTimeline()
    {
        return ObjectCreator.spawn(TimeLine);
    }

    function GenBall()
    {
        return ObjectCreator.spawn(Ball);
    }

    init();

});