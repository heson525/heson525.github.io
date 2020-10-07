
"use strict";

function _classCallCheck(a, b) {
	if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
}
var _createClass = function () {
	function a(a, b) {
		for (var c = 0; c < b.length; c++) {
			var d = b[c];
			d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d)
		}
	}
	return function (b, c, d) {
		return c && a(b.prototype, c), d && a(b, d), b
	}
}(),
	Util = {
		leftDistance: function (a) {
			for (var b = a.offsetLeft, c = void 0; a.offsetParent;) a = a.offsetParent, b += a.offsetLeft;
			return c = document.body.scrollLeft + document.documentElement.scrollLeft, b - c
		},
		timeFormat: function (a) {
			var b = parseInt(a / 60),
				c = parseInt(a % 60);
			return (b < 10 ? "0" + b : b) + ":" + (c < 10 ? "0" + c : c)
		},
		percentFormat: function (a) {
			return (100 * a).toFixed(2) + "%"
		},
		ajax: function (a) {
			a.beforeSend && a.beforeSend();
			var b = new XMLHttpRequest;
			b.onreadystatechange = function () {
				4 === b.readyState && (b.status >= 200 && b.status < 300 ? a.success && a.success(b.responseText) : a.fail && a.fail(b.status))
			}, b.open("GET", a.url), b.send(null)
		}
	},
	instance = !1,
	baseUrl = "https://api.niubi.plus/Music/Get.php",
	CTPlayer = function () {
		function a(b) {
			var c = this;
			if (_classCallCheck(this, a), instance) return console.error("只能存在一个实例！"), Object.create(null);
			instance = !0;
			this.isMobile = /mobile/i.test(window.navigator.userAgent);
			if (this.isMobile) {
				var d = {
					element: document.getElementById("CTPlayer-mob"),
					autoplay: !1,
					mode: "listloop",
					listshow: !0
				};
			} else {
				var d = {

					element: document.getElementById("CTPlayer"),
					autoplay: !1,
					mode: "listloop",
					listshow: !0
				};
			}
			for (var e in d) b.hasOwnProperty(e) || (b[e] = d[e]);
			if (this.option = b, !(this.option.music && this.option.music.type && this.option.music.source)) return console.error("请正确配置对象！"), Object.create(null);
			this.root = this.option.element,
				this.type = this.option.music.type,
				this.music = this.option.music.source,
				this.media = this.option.music.media,
				this.isReady = !1,
				this.toggle = this.toggle.bind(this),
				this.toggleList = this.toggleList.bind(this),
				this.toggleMute = this.toggleMute.bind(this),
				this.switchMode = this.switchMode.bind(this);
				"file" === this.type ? (this.root.innerHTML = this.template(), this.init(), this.bind(), this.isReady = !0) : "cloud" === this.type && (this.root.innerHTML = '<p class="CTPlayer-tip-loading relative"><span></span> <span></span> <span></span> <span></span><span></span></p>', Util.ajax({
				url: baseUrl + "?type=collect&media=" + this.media + "&id=" + this.music,
				beforeSend: function () { },
				success: function (a) {
					c.music = JSON.parse(a), c.root.innerHTML = c.template(), c.init(), c.bind()
				},
				fail: function (a) {
					console.error("歌单拉取失败！ 错误码：" + a)
				}
			}))
		}
		return _createClass(a, [{
			key: "notice",
			value: function (a, b) {
				$.message({
					title: LocalConst.MUSIC_NOTICE,
					message: a,
					type: b
				})
			}
		}, {
			key: "template",
			value: function () {
				var a = `<audio class="CTPlayer-source" src="${("file" === this.type ? this.music[0].src : "")}" preload="auto"></audio>
				<img class="CTPlayer-cover circle mr1" src="${this.music[0].cover}" alt="" />
				<div class="CTPlayer-control">
					<p class="CTPlayer-name h6 ml1">${this.music[0].name}</p>
					<div class="playController flex">
						<div onclick="player.prev();" class="lastMusic  inline-block ">
						<svg class="icon" viewBox="0 0 1024 1024"><path d="M867.2 212.7L867.2 811.1c0 19.6-22.1 30.89999999-38 19.5l-415.9-299.2c-13.3-9.6-13.3-29.4 0-39L829.2 193.2c15.90000001-11.4 38-0.1 38 19.5z"  ></path><path d="M623.1 212.7L623.1 811.1c0 19.6-22.1 30.89999999-38 19.5l-415.90000001-299.2c-13.3-9.6-13.3-29.4 1e-8-39L585.1 193.2c15.90000001-11.4 38-0.1 38 19.5z"  ></path></svg>
						</div>
						<div class="runMusic inline-block btncon">
						<svg  id="musicbtn" class="icon play" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path   d="M51.109 30.335l-36-24A2 2 0 0 0 12 8v48a2.003 2.003 0 0 0 2 2c.388 0 .775-.113 1.109-.336l36-24a2 2 0 0 0 0-3.329z"/></svg>
						<svg style="display:none" id="musicstopbtn" class="icon pause" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path   d="M22.537 8.046h17.791c1.104 0 2.003.898 2.003 1.993v79.912a2.005 2.005 0 0 1-2.003 2.003h-17.79a2.005 2.005 0 0 1-2.003-2.003V10.04c0-1.095.898-1.993 2.002-1.993zM59.672 8.046h17.8c1.095 0 1.993.898 1.993 1.993v79.912a2.003 2.003 0 0 1-1.993 2.003h-17.8a1.997 1.997 0 0 1-1.993-2.003V10.04c0-1.095.889-1.993 1.993-1.993z"/></svg>
						</div>
						<div onclick="player.next();" class="nextMusic inline-block">
						<svg class="icon" viewBox="0 0 1024 1024"><path d="M156.8 811.3V212.9c0-19.6 22.1-30.9 38-19.5l415.9 299.2c13.3 9.6 13.3 29.4 0 39L194.8 830.8c-15.9 11.4-38 0.1-38-19.5z"  ></path><path d="M400.9 811.3V212.9c0-19.6 22.1-30.9 38-19.5l415.9 299.2c13.3 9.6 13.3 29.4 0 39L438.9 830.8c-15.9 11.4-38 0.1-38-19.5z"  ></path></svg>
						</div>
						<div style="left:95px" class="inline-block CTPlayer-list-switch">
						<svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3190" width="128" height="128"><path   d="M768 512c0-141.385-114.615-256-256-256S256 370.615 256 512s114.615 256 256 256 256-114.615 256-256z m-256 512C229.23 1024 0 794.77 0 512S229.23 0 512 0s512 229.23 512 512-229.23 512-512 512z m0-426.667c47.128 0 85.333-38.205 85.333-85.333S559.128 426.667 512 426.667 426.667 464.872 426.667 512s38.205 85.333 85.333 85.333z"  p-id="3191"></path></svg>
						</div>
					</div>
				</div>
				<ul class="CTPlayer-list absolute"  >`;
				for (var b in this.music) {
					a += `
					<li class="h6 relative px1 overflow-hidden" data-index="${b}"><i class="absolute left-0 CTPlayer-list-sign"></i><span class="absolute top-0 CTPlayer-list-index">${(parseInt(b) + 1)}</span><span class="CTPlayer-list-name" title="${this.music[b].name}">${this.music[b].name}</span><span class="right overflow-hidden CTPlayer-list-author" title="${this.music[b].author} ">${this.music[b].author}</span></li>`;
				}
				a += "</ul>";
				return a;
			}
		}, {
			key: "init",
			value: function () {
				var a = this;
				if (this.dom = {
					cover: this.root.querySelector(".CTPlayer-cover"),
					playbutton: this.root.querySelector(".btncon"),
					name: this.root.querySelector(".CTPlayer-name"),
					author: this.root.querySelector(".CTPlayer-author"),

					musiclist: this.root.querySelector(".CTPlayer-list"),
					musicitem: this.root.querySelectorAll(".CTPlayer-list li")
				}, this.audio = this.root.querySelector(".CTPlayer-source"), this.option.listshow && (this.root.className = "CTPlayer-list-on"), "singleloop" === this.option.mode && (this.audio.loop = !0), this.dom.musicitem[0].className = "h6 relative px1 overflow-hidden CTPlayer-curMusic", "file" === this.type) {
					if (this.option.autoplay && !this.isMobile) {
						var b = !0;
						iziToast.warning({
							title: '音乐播放',
							message: '即将自动播放,关闭本通知停止播放',
							position: 'topRight',
							pauseOnHover: false,
							onClosing: function () { b = !1 },
						}), setTimeout(function () {
							b && a.play()
						}, 5050);
					}

				}
				$(".CTPlayer-list-switch").click(function () {
					player.toggleList()
				});
				"cloud" === this.type && Util.ajax({
					url: baseUrl + "?type=song&media=" + this.media + "&id=" + this.music[0].song_id,
					beforeSend: function () { },
					success: function (b) {
						var c = JSON.parse(b).url;
						if (null !== c) a.isReady = !0, a.audio.src = c;
						else {
							var d = parseInt(a.dom.musiclist.querySelector(".CTPlayer-curMusic").getAttribute("data-index"));
							a.errorHandle(d)
						}
						if (a.option.autoplay && !a.isMobile) {
							var e = !0;
							iziToast.warning({
								title: '音乐播放',
								message: '即将自动播放,关闭本通知停止播放',
								position: 'topRight',
								pauseOnHover: false,
								onClosing: function () { e = !1 },
							}), setTimeout(function () {
								e && a.play()
							}, 5050);
						}
					},
					fail: function (a) {
						console.error("歌曲拉取失败！ 错误码：" + a)
					}
				})
			}
		}, {
			key: "bind",
			value: function () {
				var a = this;
				this.audio.addEventListener("canplay", function (a) { }), this.audio.addEventListener("error", function (b) {
					if (a.isReady) {
						var c = parseInt(a.dom.musiclist.querySelector(".CTPlayer-curMusic").getAttribute("data-index"));
						a.errorHandle(c)
					}
				}), this.audio.addEventListener("seeked", function (b) {
					a.play()
				}), this.audio.addEventListener("ended", function (b) {
					a.next()
				}), this.dom.playbutton.addEventListener("click", this.toggle), this.isMobile, this.dom.musiclist.addEventListener("click", function (b) {
					var c = void 0,
						d = void 0,
						e = void 0;
					if ("LI" === b.target.tagName.toUpperCase()) c = b.target;
					else {
						if ("LI" !== b.target.parentElement.tagName.toUpperCase()) return;
						c = b.target.parentElement
					}
					d = parseInt(c.getAttribute("data-index")), e = parseInt(a.dom.musiclist.querySelector(".CTPlayer-curMusic").getAttribute("data-index")), d === e ? a.play() : a.switchMusic(d + 1)
				})
			}
		}, {
			key: "prev",
			value: function () {
				var a = parseInt(this.dom.musiclist.querySelector(".CTPlayer-curMusic").getAttribute("data-index"));
				0 === a ? 1 === this.music.length ? this.play() : this.switchMusic(this.music.length - 1 + 1) : this.switchMusic(a - 1 + 1)
			}
		}, {
			key: "next",
			value: function () {
				var a = parseInt(this.dom.musiclist.querySelector(".CTPlayer-curMusic").getAttribute("data-index"));
				a === this.music.length - 1 ? 1 === this.music.length ? this.play() : this.switchMusic(1) : this.switchMusic(a + 1 + 1)
			}
		}, {
			key: "errorHandle",
			value: function (a) {
				this.dom.musicitem[a].classList.add("invalid-name"), $.message({
					title: LocalConst.MUSIC_NOTICE,
					message: LocalConst.MUSIC_FAILE_END,
					type: "error"
				})
			}
		}, {
			key: "sleep",
			value: function (a) {
				for (var b = Date.now(); Date.now - b <= a;);
			}
		}, {
			key: "switchMusic",
			value: function (a) {
				var b = this;
				return "number" != typeof a ? void console.error("请输入正确的歌曲序号！") : (a -= 1) < 0 || a >= this.music.length ? void console.error("请输入正确的歌曲序号！") : a == this.dom.musiclist.querySelector(".CTPlayer-curMusic").getAttribute("data-index") ? void this.play() : (this.dom.musiclist.querySelector(".CTPlayer-curMusic").classList.remove("CTPlayer-curMusic"), this.dom.musicitem[a].classList.add("CTPlayer-curMusic"), this.dom.name.innerHTML = this.music[a].name, this.dom.cover.src = this.music[a].cover, void ("file" === this.type ? void 0 !== this.music[a].src ? (this.audio.src = this.music[a].src, this.isReady = !0, this.play()) : this.errorHandle(a) : "cloud" === this.type && Util.ajax({
					url: baseUrl + "?type=song&media=" + this.media + "&id=" + this.music[a].song_id,
					beforeSend: function () { },
					success: function (a) {
						var c = JSON.parse(a).url;
						null !== c ? (b.audio.src = c, b.isReady = !0, b.play()) : 1 !== b.music.length && b.next()
					},
					fail: function (a) {
						console.error("歌曲拉取失败！ 错误码：" + a)
					}
				})))
			}
		}, {
			key: "play",
			value: function () {
				this.audio.paused && (this.audio.play(), this.dom.cover.classList.add("CTPlayer-pause"))
				$("#musicbtn").css("display", "none");
				$("#musicstopbtn").css("display", "inline-block");
				$(".fa-music-alt").addClass("fa-spin")
			}
		}, {
			key: "pause",
			value: function () {
				this.audio.paused || (this.audio.pause(), this.dom.cover.classList.remove("CTPlayer-pause"))
				$("#musicbtn").css("display", "inline-block");
				$("#musicstopbtn").css("display", "none");
				$(".fa-music-alt").removeClass("fa-spin")
			}
		}, {
			key: "toggle",
			value: function () {
				this.audio.paused ? this.play() : this.pause()
			}
		}, {
			key: "toggleList",
			value: function () {
				this.root.classList.contains("CTPlayer-list-on") ? this.root.classList.remove("CTPlayer-list-on") : this.root.classList.add("CTPlayer-list-on")
			}
		}, {
			key: "toggleMute",
			value: function () {
				this.audio.muted ? (this.audio.muted = !1, this.dom.volumebutton.className = "CTPlayer-icon glyphicon glyphicon-volume-up", this.dom.volumeline_value.style.width = Util.percentFormat(this.audio.volume)) : (this.audio.muted = !0, this.dom.volumebutton.className = "CTPlayer-icon glyphicon glyphicon-volume-off", this.dom.volumeline_value.style.width = "0%")
			}
		}, {
			key: "switchMode",
			value: function () {
				this.audio.loop ? (this.audio.loop = !1, this.dom.modebutton.classList.remove("CTPlayer-mode-loop")) : (this.audio.loop = !0, this.dom.modebutton.classList.add("CTPlayer-mode-loop"))
			}
		}, {
			key: "destroy",
			value: function () {
				instance = !1, this.audio.pause(), this.root.innerHTML = "";
				for (var a in this) delete this[a]
			}
		}]), a
	}();

    var player = new CTPlayer({
        autoplay: false,
        listshow: false,
        mode: 'listloop',
        music: {
            type: 'cloud',
            source: CUTEEN_SETTING.MUSICDATA1,
            media: CUTEEN_SETTING.MUSICDATA2
        }
    });