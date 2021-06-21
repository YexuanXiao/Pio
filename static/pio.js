/* ----

# Pio Plugin
# By: Dreamer-Paul
# Last Update: 2021.5.6

一个支持更换 Live2D 模型的 JS 插件

本代码为奇趣保罗原创，并遵守 GPL 2.0 开源协议。欢迎访问我的博客：https://paugram.com

---- */

var Paul_Pio = function (prop) {
    var that = this

    var current = {
        idol: 0,
        menu: document.querySelector('.pio-container .pio-action'),
        canvas: document.getElementById('pio'),
        body: document.querySelector('.pio-container'),
        root: document.location.protocol +'//' + document.location.hostname +'/'
    }

    /* - 方法 */
    var modules = {
        // 更换模型
        idol() {
            current.idol = current.idol < prop.model.length - 1 ? current.idol++ : 0
            return current.idol
        },
        // 创建内容
        create(tag, prop) {
            var e = document.createElement(tag)
            if(prop.class) e.className = prop.class
            return e
        },
        // 随机内容
        rand(arr) {
            return arr[Math.floor(Math.random() * arr.length + 1) - 1]
        },
        // 创建对话框方法
        render(text) {
            if(text.constructor === Array){
                dialog.innerText = modules.rand(text)
            }
            else if(text.constructor === String){
                dialog.innerText = text
            }
            else{
                dialog.innerText = '输入内容出现问题了 X_X'
            }

            dialog.classList.add('active')

            clearTimeout(this.t)
            this.t = setTimeout(() => {
                dialog.classList.remove('active')
            }, Math.round(Math.random() * 10 + 15) * 1000)
        },
        // 移除方法
        destroy() {
            that.initHidden()
            localStorage.setItem('posterGirl', 0)
        },
        // 是否为移动设备
        isMobile() {
            return window.matchMedia('(max-width: 1024px)').matches
        }
    }
    this.destroy = modules.destroy

    var elements = {
        home: modules.create('span', {class: 'pio-home'}),
        skin: modules.create('span', {class: 'pio-skin'}),
        info: modules.create('span', {class: 'pio-info'}),
        night: modules.create('span', {class: 'pio-night'}),
        close: modules.create('span', {class: 'pio-close'}),
        totop: modules.create('span', {class: 'pio-totop'}),
        show: modules.create('div', {class: 'pio-show'})
    }

    var dialog = modules.create('div', {class: 'pio-dialog'})
    current.body.appendChild(dialog)
    current.body.appendChild(elements.show)

    /* - 提示操作 */
    var action = {
        // 欢迎
        welcome() {
            if(document.referrer !== '' && document.referrer.indexOf(current.root) === -1){
                var referrer = document.createElement('a')
                referrer.href = document.referrer
                modules.render (prop.content.referer ? (prop.content.referer.replace(/%t/, '“' + referrer.hostname + '”')) : ('欢迎来自 “' + referrer.hostname + '” 的朋友！'))
            }
            else if(prop.tips){
                var text, date = new Date()
                date.setHours(date.getHours() + 1)
                var hour = date.getHours / 3
                switch(hour){
                    case 0:
                        text = '已经这么晚了呀，早点休息吧，晚安~'
                        break
                    case 1:
                        text = '你是夜猫子吗？这么晚还不睡觉，明天起的来嘛'
                        break
                    case 2:
                        text = '早上好！现在是否元气满满呢？'
                        break
                    case 3:
                        text = '上午好！不要久坐，多起来走动走动哦！'
                        break
                    case 4:
                        text = '中午了，该休息了，现在是午餐时间！'
                        break
                    case 5:
                        text = '午后很容易犯困呢，今天的目标完成了吗？'
                        break
                    case 6:
                        text = '傍晚了！窗外夕阳的景色很美丽呢，今天是否是个好天气呢'
                        break
                    case 7:
                        text = '晚上好，今天过得怎么样？'
                        break
                    default:
                        try {
                            if (!hour || hour > 7 || hour < 0) throw '发生了不可能发生的事呢！'
                        } catch (err) {
                            console.log(err)
                        }
                }
                modules.render(text)
            }
            else{
                modules.render(prop.content.welcome || '欢迎来到本站！')
            }
        },
        // 触摸
        touch() {
            current.canvas.onclick = () => {
                modules.render(prop.content.touch || ['你在干什么？', '再摸我就报警了！', 'HENTAI!', '不可以这样欺负我啦！'])
            }
        },
        // 右侧按钮
        buttons() {

            // 返回首页
            elements.home.onclick = () => {
                location.href = current.root
            }
            elements.home.onmouseover = () => {
                modules.render(prop.content.home || '点击这里回到首页！')
            }
            if(!prop.button.home){
                current.menu.appendChild(elements.home)
            }

            // 返回顶部
            elements.totop.onclick = () => {
                var element = document.querySelector('html')
                var a = element.style.scrollBehavior
                var b = document.body.style.scrollBehavior
                element.style.scrollBehavior = 'smooth'
                b = ''
                document.documentElement.scrollTop = document.body.scrollTop = 0
                element.style.scrollBehavior = a
                element.body.style.scrollBehavior = b
            }
            elements.totop.onmouseover = () => {
                modules.render('点击这里回到顶部！')
            }
            if(!prop.button.totop){
                current.menu.appendChild(elements.totop)
            }

            // 更换模型
            elements.skin.onclick = () => {
                loadlive2d('pio', prop.model[modules.idol()])
                modules.render(prop.content.skin && prop.content.skin[1] ? prop.content.skin[1] : '新衣服真漂亮~')
            }
            elements.skin.onmouseover = () => {
                modules.render( prop.content.skin && prop.content.skin[0] ? prop.content.skin[0] : '想看看我的新衣服吗？')
            }
            if(!prop.button.skin){
                if(prop.model.length > 1) current.menu.appendChild(elements.skin)
            }

            // 关于我
            elements.info.onclick = () => {
                window.open(prop.content.link || 'https://paugram.com/coding/add-poster-girl-with-plugin.html')
            }
            elements.info.onmouseover = () => {
                modules.render('想了解更多关于我的信息吗？')
            }
            if(!prop.button.info){
                current.menu.appendChild(elements.info)
            }

            // 夜间模式
            if(prop.night){
                elements.night.onclick = () => {
                    try{
                        new Function('return ' + prop.night)();
                    }catch(err){
                        console.log(prop.night + ' is not a correct function call!')
                    }
                }
                elements.night.onmouseover = () => {
                    modules.render('夜间点击这里可以保护眼睛呢')
                }
                if(!prop.button.night){
                    current.menu.appendChild(elements.night)
                }
            }

            // 关闭看板娘
            elements.close.onclick = () => {
                modules.destroy()
            }
            elements.close.onmouseover = () => {
                modules.render(prop.content.close || 'QWQ 下次再见吧~')
            }
            if(!prop.button.close){
                current.menu.appendChild(elements.close)
            }
        },
        custom() {
            prop.content.custom.forEach(t => {
                if(!t.type) t.type = 'default'
                var e = document.querySelectorAll(t.selector)

                if(e.length){
                    for(var j = 0; j < e.length; j++){
                        if(t.type === 'read'){
                            e[j].onmouseover = function () {
                                modules.render('想阅读 %t 吗？'.replace(/%t/, '“' + this.innerText.substring(0, 30) + '”'))
                            }
                        }
                        else if(t.type === 'link'){
                            e[j].onmouseover = function () {
                                modules.render('想了解一下 %t 吗？'.replace(/%t/, '“' + this.innerText.substring(0, 30) + '”'))
                            }
                        }
                        else if(t.text){
                            e[j].onmouseover = () => {
                                modules.render(t.text.substring(0, 30))
                            }
                        }
                    }
                }
            })
        }
    }

    /* - 运行 */
    var begin = {
        static() {
            current.body.classList.add('static')
        },
        fixed() {
            action.touch(); action.buttons()
        },
        draggable() {
            action.touch(); action.buttons()

            var body = current.body
            body.onmousedown = function (downEvent) {
                var location = {
                    x: downEvent.clientX - this.offsetLeft,
                    y: downEvent.clientY - this.offsetTop
                }

                function move(moveEvent) {
                    body.classList.add('active')
                    body.classList.remove('right')
                    body.style.left = (moveEvent.clientX - location.x) + 'px'
                    body.style.top  = (moveEvent.clientY - location.y) + 'px'
                    body.style.bottom = 'auto'
                }

                document.addEventListener('mousemove', move)
                document.addEventListener('mouseup', () => {
                    body.classList.remove('active')
                    document.removeEventListener('mousemove', move)
                })
            }
        }
    }

    // 运行
    this.init = onlyText => {
        if(!(prop.hidden && modules.isMobile())){
            if(!onlyText){
                action.welcome()
                loadlive2d('pio', prop.model[0])
            }

            switch (prop.mode){
                case 'static': begin.static(); break
                case 'fixed':  begin.fixed(); break
                case 'draggable': begin.draggable(); break
            }

            if(prop.content.custom) action.custom()
        }
    }

    // 隐藏状态
    this.initHidden = () => {
        // ! 清除预设好的间距
        if(prop.mode === 'draggable'){
            current.body.style.top = null
            current.body.style.left = null
            current.body.style.bottom = null
        }

        current.body.classList.add('hidden')
        dialog.classList.remove('active')

        elements.show.onclick = () => {
            current.body.classList.remove('hidden')
            localStorage.setItem('posterGirl', 1)
            that.init()
        }
    }

    var callback = localStorage.getItem('posterGirl') == 0 ? this.initHidden : this.init
    callback()
}

// 请保留版权说明
if (window.console && window.console.log) {
    console.log('%c Pio %c https://paugram.com ','color: #fff; margin: 1em 0; padding: 5px 0; background: #673ab7;','margin: 1em 0; padding: 5px 0; background: #efefef;')
}