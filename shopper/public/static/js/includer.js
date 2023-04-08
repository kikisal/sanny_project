(() => {
    let scriptsLoaded = [];

    Base.__setModule('Includer', {
        scriptsLoaded: [],
        
        isLoaded: function(script) {
            return Includer.scriptsLoaded.includes(script);
        },

        include: function(scripts) {
            return new Promise((res, rej) => {
                let loaded = 0;
                
                for (const script of scripts) {
                    if (Includer.isLoaded(script))
                        res();
                    else
                    {
                        const scr = document.createElement('script');
                        scr.src = 'ScriptUri' in Includer ? Includer.ScriptUri + '/' + script : '/' + script;
                        scr.async = false;
        
                        document.head.appendChild(scr);
        
                        scr.addEventListener('load', () => {
                            loaded++;
    
                            Includer.scriptsLoaded.push(script);
                            
                            if (loaded >= scripts.length)
                                res();
                        });
                    }
                }
            });
        }
    });
})();