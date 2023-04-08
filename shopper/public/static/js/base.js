((m) => {

    const Scripts = [
        'audio-player.js'
    ];

    __getModule('Includer').ScriptUri = 'static/js';

    function contentLoaded()
    {
        return new Promise((res, rej) => {
            if (document.readyState == 'interactive' || document.readyState == 'complete')
                res();
            else
                document.addEventListener('DOMContentLoaded', res);
        });
    }
    
    function __getModule(__module)
    {
        return __module in m ? m[__module] : m[__module] = {};
    }
    
    function __setModule(__module, obj)
    {
        if (__module in m)
            Object.assign(m[__module], obj);
        else
            m[__module] = obj;
    }

    function __loadScript(script) {
        return new Promise((res, rej) => {
            const scr = document.createElement('script');
            scr.src = __getModule('Includer').ScriptUri + '/' + script;
            scr.async = false;
            document.head.appendChild(scr);
            scr.addEventListener('load', res);
        });
    }

    async function init()
    {
        await __loadScript('includer.js');
        Includer.include(Scripts);
    }

    init();

    __setModule('Base', {
        __getModule: __getModule,
        __setModule: __setModule,
        contentLoaded: contentLoaded
    });

})(window);