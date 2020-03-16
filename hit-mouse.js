function MouseGame() {
    this.mousesWrap = this.$('.game-content');
    this.mouses = this.$('.game-content div');
    this.gameStart = this.$('#game-start');
    this.gameTime = this.$('#game-time');
    this.gameScore = this.$('#game-score');
    this.goodScore = 100;
    this.badScore = 50;

    this.bindEvent();
}

MouseGame.prototype = {
    constructor: MouseGame,

    /**
     * 获取元素
     * @param  {String} elem 元素的字符串标识
     * @example
     * $('div') | $('p.active')
     * @return {NodeList}      获取的元素集
     */
    $: function(elem) {
        return document.querySelectorAll(elem);
    },

    /**
     * 获取给定范围的随机数
     * @param  {Number} from 起始
     * @param  {Number} to   结束
     * @return {Number}      随机数
     */
    getRandom: function(from, to) {
        return Math.floor(Math.random() * (to - from + 1)) + from;
    },

    /**
     * 设置元素内容
     * @param  {HTMLElement} elem 要设置的元素
     * @param  {String} val  设置的内容
     * @return {String}      设置好的内容|元素本身的内容
     */
    text: function(elem, val) {
        if (elem.textContent) {
            return val !== undefined ? elem.textContent = val : elem.textContent;
        } else if (elem.innerText) {
            return val !== undefined ? elem.innerText = val : elem.innerText;
        }
    },

    randomMouse: function(count) {
        var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        var shuffled = arr.slice(0),
            i = arr.length,
            min = i - count,
            temp, index;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(min);
    },

    // 运动操作
    moveUpAndDown: function() {
        var that = this;
        that.moveUpAndDownAction();
        // 定时器随机定义good|bad老鼠个数，以及需要显示的个数
        that.moveTime = setInterval(function() {
            that.moveUpAndDownAction();
        }, 3000);
    },

    moveUpAndDownAction: function() {
        var that = this;
        for (var i = 0, j = that.mouses.length; i < j; ++i) {
            that.mouses[i].setAttribute('clicked', '0');
            that.mouses[i].style.display = 'none';
        }

        var actionMouseNum = 3;

        if (that.totalTime < 40 && that.totalTime > 20) {
            actionMouseNum = 4;
        } else if (that.totalTime < 20) {
            actionMouseNum = 6;
        }

        var actionMouses = that.randomMouse(actionMouseNum);

        for (var i = 0; i < actionMouseNum; i++) {

            if ((Math.floor(Math.random() * Math.floor(1000))) % 2 == 1) {
                that.mouses[actionMouses[i]].className = 'good active';
            } else {
                that.mouses[actionMouses[i]].className = 'bad active';
            }
            that.mouses[actionMouses[i]].style.display = 'block';
        }
    },

    // 打地鼠操作
    bindEvent: function() {
        var that = this;

        // 监听游戏开始/重新开始
        that.gameStart[0].addEventListener('click', function() {
            that.startGame();
        }, false);

        // 打地鼠操作
        that.mousesWrap[0].addEventListener('click', function(e) {
            e = e || window.event;
            var elem = e.target || e.srcElement;

            // 如果当前项被隐藏则不操作，多次点击只取第一次分数
            if (elem.style.display !== 'block' || elem.getAttribute('clicked') === '1') {
                return;
            }

            // 扣分
            if (elem.className.indexOf('bad') !== -1) {
                that.score -= that.badScore;
            }

            // 加分
            else {
                that.score += that.goodScore;
            }

            elem.setAttribute('clicked', '1');
            that.text(that.gameScore[0], that.score);
        }, false);
    },

    // 倒计时，当前剩余游戏时间
    countDown: function() {
        var that = this;

        var t = setInterval(function() {
            that.text(that.gameTime[0], --that.totalTime);

            if (that.totalTime === 0) {
                clearInterval(t);
                clearInterval(that.moveTime);

                for (var i = 0, j = that.mouses.length; i < j; ++i) {
                    that.mouses[i].style.display = 'none';
                }

                alert('遊戲結束，總分為：' + that.score);
            }
        }, 1000);
    },

    // 开始游戏
    startGame: function() {
        this.score = 0;
        this.totalTime = 60;
        this.text(this.gameTime[0], this.totalTime);
        this.text(this.gameScore[0], this.score);

        this.countDown();
        this.moveUpAndDown();
    }
};

new MouseGame();