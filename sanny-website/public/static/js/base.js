/**
 * Exclusive script by weeki. 
 * 
 * @author weeki
 * @description Exclusive script for this project only.
 * Includes various utilities for web modularity.
 * 
 */
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
        await Includer.include(Scripts);
        await AudioPlayer.ready;

        const cards = [
            {
                title: 'DJ Samuel Kimkò & DJ Sanny J Ft. Neon e Adrian Rivas - Para Ti Ableton Remake (House)',
                cover: 'static/images/products/product-1.png',
                price: 34.00,
                audio: 'static/js/audio-player/audio2.mp3',
            },
            {
                title: "LOST FREQUENCIES - CHEMICAL HIGH (DELUXE MIX) ABLETON REMAKE (DANCE)",
                cover: 'static/images/products/product-2.png',
                price: 34.00,
                audio: 'static/js/audio-player/audio2.mp3',
            },
            {
                title: "WANNA DANCE - TECH HOUSE ABLETON TEMPLATE (MAX STYLER STYLE)",
                cover: 'static/images/products/product-3.png',
                price: 34.00,
                audio: 'static/js/audio-player/audio2.mp3',
            },
            {
                title: "LINGUERE - TECH HOUSE ABLETON TEMPLATE (FISHER, CHRIS LAKE STYLE)",
                cover: 'static/images/products/product-4.png',
                price: 34.00,
                audio: 'static/js/audio-player/audio2.mp3',
            },
            {
                title: "DJ Samuel Kimkò & DJ Sanny J Ft. Neon e Adrian Rivas - Para Ti Ableton Remake (House)",
                cover: 'static/images/products/product-5.png',
                price: 34.00,
                audio: 'static/js/audio-player/audio2.mp3',
            },
            {
                title: 'DJ Samuel Kimkò & DJ Sanny J Ft. Neon e Adrian Rivas - Para Ti Ableton Remake (House)',
                cover: 'static/images/products/product-1.png',
                price: 34.00,
                audio: 'static/js/audio-player/audio2.mp3',
            },
            {
                title: "LOST FREQUENCIES - CHEMICAL HIGH (DELUXE MIX) ABLETON REMAKE (DANCE)",
                cover: 'static/images/products/product-2.png',
                price: 34.00,
                audio: 'static/js/audio-player/audio2.mp3',
            },
            {
                title: "WANNA DANCE - TECH HOUSE ABLETON TEMPLATE (MAX STYLER STYLE)",
                cover: 'static/images/products/product-3.png',
                price: 34.00,
                audio: 'static/js/audio-player/audio2.mp3',
            },
            {
                title: "LINGUERE - TECH HOUSE ABLETON TEMPLATE (FISHER, CHRIS LAKE STYLE)",
                cover: 'static/images/products/product-4.png',
                price: 34.00,
                audio: 'static/js/audio-player/audio2.mp3',
            },
            {
                title: "DJ Samuel Kimkò & DJ Sanny J Ft. Neon e Adrian Rivas - Para Ti Ableton Remake (House)",
                cover: 'static/images/products/product-5.png',
                price: 34.00,
                audio: 'static/js/audio-player/audio2.mp3',
            }
        ];


        function toPriceString(price)
        {
            return "" + parseInt(price) + '.' + ("" + parseInt(price * 100)).substring(2).substring(0, 2) + ' €';
        }

        const itemList = document.querySelector('.item-list');


        for (const card of cards) {
            const li = document.createElement('li');
            li.classList.add('item');
            li.setAttribute('title', card.title);
            li.innerHTML += `
            <div class="product-item shadow">
                <div class="play-btn-circle">
                    <div class="play-icon"></div>
                </div>
                <div class="product-cover">
                    <img src="static/images/products/product-1.png" alt="">
                    <div class="audio-player">

                    </div>
                </div>
            </div>
            <div class="product-name">
                <span></span>
            </div>
            <div class="price">
                <div class="text right">
                    <span></span>
                </div>
            </div>
            <div class="btn btn-theme-2">
                <button>Aggiungi al carello</button>
            </div>
            `;
            
            li.querySelector('.product-name span').innerHTML = card.title;
            li.querySelector('.price span').innerHTML        = toPriceString(card.price);
            li.querySelector('.product-cover img').src       = card.cover;
            
            const audioPlayer = li.querySelector('.audio-player');

            const playButton = li.querySelector('.play-btn-circle');
            
            const aud = __getModule('AudioPlayer').spawn({
                src: 'static/js/audio-player/audio2.mp3',
                node: audioPlayer,
                onPlaying: function() {
                    playButton.classList.add('pause');
                },
                
                onPause: function() {
                    console.log('pausing...');
                    playButton.classList.remove('pause');
                },

                onStop: function() {
                    playButton.classList.remove('pause');
                },

                onFullyPlayed: function() {
                    console.log('on fully played.');
                },

                onError: function() {

                }
            });


            playButton.addEventListener('click', () => {
                if (aud.isPlaying())
                    aud.pause();
                else aud.play();

            });
            

            itemList.appendChild(li);
        }

    

        console.log('all scripts loaded!');
    }

    init();

    __setModule('Base', {
        __getModule: __getModule,
        __setModule: __setModule,
        contentLoaded: contentLoaded
    });

})(window);