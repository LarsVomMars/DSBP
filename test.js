"use strict";
window.Dsbmobile = {
        Classes: {},
        Views: {},
        Models: {},
        ActiveView: null,
        logoutTimer: null,
        checkBrowser: function() {
            var a = navigator.userAgent;
            if (!(a.indexOf("Windows Phone") >= 0))
                if (a.indexOf("Android") >= 0) {
                    var b = parseFloat(a.slice(a.indexOf("Android") + 8));
                    b >= 4 && Dsbmobile.Notification.setNotification({
                        level: "info",
                        title: "DSBmobile",
                        message: "Jetzt die App installieren!",
                        setTimer: !1,
                        icon: "fa-android",
                        link: Dsbmobile.STORELINKS.ANDROID
                    })
                } else if (a.match(/iPad/i) || a.match(/iPhone/i)) {
                var c = a.indexOf("OS "),
                    d = parseFloat(a.substr(c + 3, 3).replace("_", "."));
                d >= 7 && Dsbmobile.Notification.setNotification({
                    level: "info",
                    title: "DSBmobile",
                    message: "Jetzt die App installieren!",
                    setTimer: !1,
                    icon: "fa-apple",
                    link: Dsbmobile.STORELINKS.IOS
                })
            }
        },
        resetLogoutTimer: function() {
            Dsbmobile.logoutTimer && clearTimeout(Dsbmobile.logoutTimer), Dsbmobile.logoutTimer = setTimeout(function() {
                location.reload()
            }, Dsbmobile.LOGOUTTIMEOUT)
        },
        init: function() {
            var a = this;
            Dsbmobile.Notification.init(), Dsbmobile.SHOWSTORENOTIFICATION && a.checkBrowser(), a.resetLogoutTimer(), Dsbmobile.Repository = new Dsbmobile.Classes.Repository({
                logging: Dsbmobile.DEBUGMODE
            }), Dsbmobile.Repository.doRequest(function() {
                Dsbmobile.Sidemenu.init(), Dsbmobile.Statusbar.init(), Dsbmobile.Content.init(), Dsbmobile.Overlay.init();
                var b = Dsbmobile.Repository.getData(),
                    c = Dsbmobile.Repository.getStartIndex();
                Dsbmobile.Router.config({}), Dsbmobile.Router.add(/menu=(\d*)&item=(\d*)/, function() {
                    var c = arguments[0],
                        d = arguments[1];
                    if (void 0 == b[c] || void 0 == b[c].childs[d]) return Dsbmobile.Router.navigate(), !1;
                    var e = b[c].childs[d].method;
                    void 0 !== Dsbmobile.VIEWTYPS[e] && (Dsbmobile.ActiveView && Dsbmobile.ActiveView.destroy && (Dsbmobile.ActiveView.destroy(), Dsbmobile.ActiveView = null), Dsbmobile.ActiveView = new Dsbmobile.VIEWTYPS[e]({
                        content: b[c].childs[d].content,
                        menuItem: b[c].childs[d]
                    }), Dsbmobile.ActiveView.init(), Dsbmobile.Sidemenu.setSelected(c, d), Dsbmobile.Statusbar.setTitle(b[c].childs[d].title)), a.resetLogoutTimer()
                }), Dsbmobile.Router.add(function() {
                    a.resetLogoutTimer(), c || (c = 0), Dsbmobile.Router.navigate("/menu=0&item=" + c)
                }), Dsbmobile.Router.listen().check(), $("#loading-overlay").hide()
            })
        }
    }, $(document).ready(function() {
        Dsbmobile.init(), $(document).bind("contextmenu", function() {
            return !1
        }), $(document).on("contextmenu", "iframe", function(a) {
            return a.stopPropagation(), a.preventDefault(), !1
        }), window.navigator.standalone && $("html").addClass("iOSApp")
    }),
    function() {
        function a() {
            function a(b, c) {
                var d, e, f = /(^([+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[0-9a-f]+$|\d+)/gi,
                    g = /(^[ ]*|[ ]*$)/g,
                    h = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
                    i = /^0x[0-9a-f]+$/i,
                    j = /^0/,
                    k = function(b) {
                        return a.insensitive && ("" + b).toLowerCase() || "" + b
                    },
                    l = k(b).replace(g, "") || "",
                    m = k(c).replace(g, "") || "",
                    n = l.replace(f, "\x00$1\x00").replace(/\0$/, "").replace(/^\0/, "").split("\x00"),
                    o = m.replace(f, "\x00$1\x00").replace(/\0$/, "").replace(/^\0/, "").split("\x00"),
                    p = parseInt(l.match(i), 16) || 1 !== n.length && l.match(h) && Date.parse(l),
                    q = parseInt(m.match(i), 16) || p && m.match(h) && Date.parse(m) || null;
                if (q) {
                    if (q > p) return -1;
                    if (p > q) return 1
                }
                for (var r = 0, s = Math.max(n.length, o.length); s > r; r++) {
                    if (d = !(n[r] || "").match(j) && parseFloat(n[r]) || n[r] || 0, e = !(o[r] || "").match(j) && parseFloat(o[r]) || o[r] || 0, isNaN(d) !== isNaN(e)) return isNaN(d) ? 1 : -1;
                    if (typeof d != typeof e && (d += "", e += ""), e > d) return -1;
                    if (d > e) return 1
                }
                return 0
            }

            function b(a) {
                var b = pako.deflate(JSON.stringify(a), {
                    to: "string",
                    gzip: !0
                });
                return b = btoa(b)
            }

            function c(a) {
                for (var b, c, d, e, f, g = "", h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i = new Uint8Array(a), j = i.byteLength, k = j % 3, l = j - k, m = 0; l > m; m += 3) f = i[m] << 16 | i[m + 1] << 8 | i[m + 2], b = (16515072 & f) >> 18, c = (258048 & f) >> 12, d = (4032 & f) >> 6, e = 63 & f, g += h[b] + h[c] + h[d] + h[e];
                return 1 == k ? (f = i[l], b = (252 & f) >> 2, c = (3 & f) << 4, g += h[b] + h[c] + "==") : 2 == k && (f = i[l] << 8 | i[l + 1], b = (64512 & f) >> 10, c = (1008 & f) >> 4, d = (15 & f) << 2, g += h[b] + h[c] + h[d] + "="), g
            }
            var d = this;
            d.toDateString = function(a) {
                var b = String(a.getDate()).length < 2 ? "0" + String(a.getDate()) : a.getDate(),
                    c = String(a.getMonth() + 1).length < 2 ? "0" + String(a.getMonth() + 1) : a.getMonth() + 1,
                    d = a.getFullYear(),
                    e = String(a.getHours()).length < 2 ? "0" + String(a.getHours()) : a.getHours() + 1,
                    f = String(a.getMinutes()).length < 2 ? "0" + String(a.getMinutes()) : a.getMinutes(),
                    g = b + "." + c + "." + d + " " + e + ":" + f;
                return g
            }, d.readCookie = function(a, b, c, d) {
                var b = document.cookie.split("; "),
                    e = {};
                for (d = b.length - 1; d >= 0; d--) c = b[d].split("="), e[c[0]] = c[1];
                return e[a]
            }, d.setCookie = function(a, b, c) {
                var d = new Date;
                d.setTime(d.getTime() + 24 * c * 60 * 60 * 1e3);
                var e = "expires=" + d.toUTCString();
                document.cookie = a + "=" + b + "; " + e
            }, a.insensitive = !0, d.naturalSort = a, d.isTouch = function() {
                return $("html").hasClass("touch")
            }, d.decode_utf8 = function(a) {
                return decodeURIComponent(escape(a))
            }, d.sendFeedback = function(a, c, d) {
                {
                    var e = {
                            AppId: Dsbmobile.APP.ID,
                            AppVersion: Dsbmobile.APP.VERSION,
                            PushId: "",
                            Device: Dsbmobile.APP.DEVICE,
                            OsVersion: navigator.userAgent,
                            Language: "de",
                            BundleId: Dsbmobile.APP.BUNDLEID,
                            Users: "",
                            Email: d,
                            Comment: c,
                            General: a.General,
                            Design: a.Design,
                            Content: a.Content,
                            Usability: a.Usability
                        },
                        f = JSON.stringify({
                            req: {
                                Data: b(e),
                                DataType: Dsbmobile.REQUESTTYPES.HMFeedbackType
                            }
                        });
                    $.ajax({
                        type: "POST",
                        url: Dsbmobile.WEBSERVICE.METHOD,
                        data: f,
                        dataType: "json",
                        contentType: "application/json;charset=utf-8",
                        success: function() {
                            Dsbmobile.Notification.setNotification({
                                level: "success",
                                title: "Feedback",
                                message: "Feedback versendet!"
                            })
                        },
                        error: function(a, b, c) {
                            c = "" != c ? "(" + c + ")" : "", Dsbmobile.Notification.setNotification({
                                level: "error",
                                title: "Webservice",
                                message: "Server nicht erreichbar! " + c
                            })
                        },
                        beforeSend: function(a) {
                            a.setRequestHeader("Bundle_ID", e.BundleId)
                        }
                    })
                }
            }, d.getHTML = function(a, b) {
                $.ajax({
                    type: "GET",
                    url: a,
                    contentType: "text/html;charset=ISO8859-1",
                    mimeType: "text/html; charset=ISO8859-1",
                    dataType: "html",
                    beforeSend: function(a) {
                        a.setRequestHeader("Bundle_ID", Dsbmobile.APP.BUNDLEID), a.overrideMimeType("text/html;charset=ISO8859-1")
                    },
                    success: function(a) {
                        b(a)
                    }
                })
            }, d.getPreviewImage = function(a, b) {
                if (void 0 != a && void 0 != b) {
                    var c = Dsbmobile.IMAGESERVICE.URL;
                    d.isRetina() && (b = 2 * b);
                    var e = c + "f=" + a + "&bg=t&x=" + b + "&nopic=false";
                    return e
                }
                return !1
            }, d.getImage = function(a, b) {
                var d = new XMLHttpRequest;
                d.open("GET", a, !0), d.responseType = "arraybuffer", d.setRequestHeader("Bundle_ID", Dsbmobile.APP.BUNDLEID), d.onreadystatechange = function(a) {
                    if (4 === d.readyState)
                        if (200 === d.status) {
                            var e = c(a.currentTarget.response),
                                f = '<img src="data:image/png;base64,' + e + '" />';
                            b(f)
                        } else {
                            Dsbmobile.Notification.setNotification({
                                level: "error",
                                title: "Webservice",
                                message: "Bild konnte nicht geladen werden!"
                            });
                            var f = "<img src='' />";
                            b(f)
                        }
                }, d.send()
            }, d.isRetina = function() {
                var a = "(-webkit-min-device-pixel-ratio: 1.5),              (min--moz-device-pixel-ratio: 1.5),              (-o-min-device-pixel-ratio: 3/2),              (min-resolution: 1.5dppx)";
                return window.devicePixelRatio > 1 ? !0 : window.matchMedia && window.matchMedia(a).matches ? !0 : !1
            }
        }
        Dsbmobile.Helper = new a
    }(),
    function() {
        function a() {
            var a = this;
            a.routes = [], a.mode = null, a.root = "/", a.currentPath = null, a.config = function(a) {
                return this.mode = a && a.mode && "history" == a.mode && history.pushState ? "history" : "hash", this.root = a && a.root ? "/" + this.clearSlashes(a.root) + "/" : "/", this
            }, a.getFragment = function() {
                var a = "";
                if ("history" === this.mode) a = this.clearSlashes(decodeURI(location.pathname + location.search)), a = a.replace(/\?(.*)$/, ""), a = "/" != this.root ? a.replace(this.root, "") : a;
                else {
                    var b = window.location.href.match(/#(.*)$/);
                    a = b ? b[1] : ""
                }
                return this.clearSlashes(a)
            }, a.clearSlashes = function(a) {
                return a.toString().replace(/\/$/, "").replace(/^\//, "")
            }, a.add = function(a, b) {
                return "function" == typeof a && (b = a, a = ""), this.routes.push({
                    re: a,
                    handler: b
                }), this
            }, a.remove = function(a) {
                for (var b, c = 0; c < this.routes.length, b = this.routes[c]; c++)
                    if (b.handler === a || b.re.toString() === a.toString()) return this.routes.splice(c, 1), this;
                return this
            }, a.flush = function() {
                return this.routes = [], this.mode = null, this.root = "/", this
            }, a.check = function(a) {
                for (var b = a || this.getFragment(), c = 0; c < this.routes.length; c++) {
                    var d = b.match(this.routes[c].re);
                    if (d) return d.shift(), this.routes[c].handler.apply({}, d), this
                }
                return this
            }, a.listen = function() {
                var a = this,
                    b = a.getFragment(),
                    c = function() {
                        b !== a.getFragment() && (b = a.getFragment(), a.check(b))
                    };
                return clearInterval(this.interval), this.interval = setInterval(c, 50), this
            }, a.navigate = function(a) {
                return a = a ? a : "", this.currentPath = a, "history" === this.mode ? history.pushState(null, null, this.root + this.clearSlashes(a)) : (window.location.href.match(/#(.*)$/), window.location.href = window.location.href.replace(/#(.*)$/, "") + "#" + a), this
            }
        }
        Dsbmobile.Router = new a
    }(),
    function() {
        Dsbmobile.Classes.Repository = function(a) {
            function b(a) {
                var b = pako.deflate(JSON.stringify(a), {
                    to: "string",
                    gzip: !0
                });
                return b = btoa(b)
            }

            function c(a, b, d) {
                var e = "desc" == d ? -1 : 1;
                a.length > 1 && a.sort(function(a, c) {
                    return void 0 !== a[b] && void 0 !== c[b] && a instanceof Dsbmobile.Classes.ContentItem && c instanceof Dsbmobile.Classes.ContentItem ? Dsbmobile.Helper.naturalSort(a[b], c[b]) * e : 0
                });
                for (var f in a) {
                    var g = a[f];
                    void 0 !== g.content && g.content.length > 0 ? g.content = c(g.content, b, d) : void 0 !== g.childs && g.childs.length > 0 && (g.childs = c(g.childs, b, d))
                }
                return a
            }

            function d(a) {
                var b = StringView.base64ToBytes(a),
                    c = pako.inflate(b),
                    d = new StringView(c),
                    e = d.toString(),
                    f = JSON.parse(e);
                return f
            }

            function e(a) {
                var b = f(a.ResultMenuItems);
                return j = void 0 !== a.StartIndex && a.StartIndex > -1 ? a.StartIndex : !1, j !== !1 ? b[0].childs[j]["default"] = !0 : b[0].childs[0]["default"] = !0, b
            }

            function f(a) {
                var b = Array();
                for (var c in a) {
                    var d = a[c],
                        e = new Dsbmobile.Classes.MenuItem({
                            iconLink: d.IconLink,
                            index: parseInt(d.Index),
                            method: d.MethodName,
                            title: d.Title
                        });
                    !d.Root && d.Childs.length > 0 ? (e.childs = f(d.Childs), e.childs.sort(function(a, b) {
                        return a.index - b.index
                    })) : d.Root && d.Root.Childs.length > 0 && (e.content = g(d.Root.Childs, e), e.content.sort(function(a, b) {
                        return a.index - b.index
                    })), b.push(e)
                }
                return b
            }

            function g(a, b) {
                var c = Array();
                for (var d in a)
                    if (a[d]) {
                        var e = a[d],
                            f = e.Date,
                            h = f.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})\s(\d{1,2})\:(\d{1,2})/i),
                            i = new Dsbmobile.Classes.ContentItem({
                                parent: b ? b : null,
                                type: e.ConType,
                                date: new Date(h[3], parseInt(h[2]) - 1, h[1], h[4], h[5], 0, 0),
                                url: e.Detail,
                                id: e.Id,
                                index: e.Index,
                                priority: e.Prio,
                                tags: e.Tags,
                                title: e.Title,
                                preview: e.Preview
                            });
                        e.Childs.length > 0 && (i.childs = g(e.Childs, i), i.childs.sort(function(a, b) {
                            return a.index - b.index
                        })), c.push(i)
                    } return c
            }

            function h(a, b) {
                if (m) var f = a;
                else var f = d(a.d);
                i.logging && console.log(f), 1 == f.Resultcode ? Dsbmobile.Notification.setNotification({
                    level: "error",
                    title: "DSBmobile",
                    message: "Nicht eingeloggt"
                }) : (k = e(f), k = c(k, l.field, l.direction), b())
            }
            var i = this;
            i.logging = void 0 !== a.logging ? a.logging : !1;
            var j = !1,
                k = Array(),
                l = {
                    field: Dsbmobile.Helper.readCookie("sortingField") ? Dsbmobile.Helper.readCookie("sortingField") : "date",
                    direction: Dsbmobile.Helper.readCookie("sortingDirection") ? Dsbmobile.Helper.readCookie("sortingDirection") : "desc"
                },
                m = Dsbmobile.DEBUGMODE,
                n = {
                    UserId: "",
                    UserPw: "",
                    Abos: Array(),
                    AppVersion: Dsbmobile.APP.VERSION,
                    Language: "de",
                    OsVersion: navigator.userAgent,
                    AppId: Dsbmobile.APP.ID,
                    Device: Dsbmobile.APP.DEVICE,
                    PushId: "",
                    BundleId: Dsbmobile.APP.BUNDLEID,
                    Date: new Date,
                    LastUpdate: new Date
                };
            i.doRequest = function(a) {
                var c = JSON.stringify({
                    req: {
                        Data: b(n),
                        DataType: Dsbmobile.REQUESTTYPES.HMDataType
                    }
                });
                if (m) {
                    $.ajax({
                        url: "data.json",
                        success: function(b) {
                            h(b, a)
                        }
                    })
                } else {
                    $.ajax({
                        type: "POST",
                        url: Dsbmobile.WEBSERVICE.METHOD,
                        data: c,
                        dataType: "json",
                        contentType: "application/json;charset=utf-8",
                        success: function(b) {
                            h(b, a)
                        },
                        error: function(a, b, c) {
                            c = "" != c ? "(" + c + ")" : "", Dsbmobile.Notification.setNotification({
                                level: "error",
                                title: "Webservice",
                                message: "Server nicht erreichbar! (" + c + ")"
                            })
                        },
                        beforeSend: function(a) {
                            a.setRequestHeader("Bundle_ID", n.BundleId)
                        }
                    })
                }
            }, i.getData = function() {
                return k
            }, i.getStartIndex = function() {
                return j
            }, i.getSorting = function() {
                return l
            }, i.changeSorting = function(a, b) {
                l = {
                    field: a,
                    direction: b
                }, Dsbmobile.Helper.setCookie("sortingField", a, 100), Dsbmobile.Helper.setCookie("sortingDirection", b, 100), k = c(k, a, b)
            }
        }
    }(),
    function() {
        function a() {
            function a() {
                $(e).on("click touchstart", function(a) {
                    function b(a) {
                        "sort-action" != a.target.className && (a.preventDefault(), a.stopPropagation(), $(f).hide()), document.removeEventListener("click", b, !0)
                    }
                    a.preventDefault(), a.stopPropagation(), $(f).toggle(), $(f).is(":visible") && document.addEventListener("click", b, !0)
                }), $(".sort-action").on("click touchstart", function() {
                    var a = $(this).data("sort-attribute"),
                        c = $(this).data("sort-direction");
                    void 0 != a && void 0 != c && (Dsbmobile.Repository.changeSorting($(this).data("sort-attribute"), $(this).data("sort-direction")), Dsbmobile.ActiveView.reload(), b(), $(f).toggle())
                })
            }

            function b() {
                var a = Dsbmobile.Repository.getSorting();
                $(".sort-action").each(function() {
                    a.field == $(this).data("sort-attribute") && a.direction == $(this).data("sort-direction") ? $(this).addClass("active") : $(this).removeClass("active")
                })
            }
            var c = this,
                d = ($("#statusbar"), $("#statusbar .title")),
                e = $("#statusbar .sort-desc"),
                f = $("#statusbar .sort-menu");
            c.setTitle = function(a) {
                $(d).html(a)
            }, c.init = function() {
                a(), b()
            }
        }
        Dsbmobile.Statusbar = new a
    }(),
    function() {
        function a(a) {
            function b() {
                $(g).on("click", c), $(g).load(function() {
                    $(g).fadeIn(300), $(g).parent().find(".spinner").hide()
                })
            }

            function c(a) {
                $(g).hasClass("zoomable") && ($(g).hasClass("zoomed") ? ($(g).removeClass("zoomed"), $("#zoom-in").show(), $("#zoom-out").hide()) : (d(a.offsetX, a.offsetY), $("#zoom-in").hide(), $("#zoom-out").show()))
            }

            function d(a, b) {
                var c = $(g).width(),
                    d = $(g).position().left,
                    e = $(g).position().top;
                $(g).addClass("zoomed");
                var f = $(g).width() / c,
                    h = b * (f - 1) - e,
                    i = a * (f - 1) - d;
                $(g).parent()[0].scrollTop = h, $(g).parent()[0].scrollLeft = i
            }

            function e() {
                $(g).hasClass("zoomed") || ($(g).width() < $(g).parent().innerWidth() && $(g).height() < $(g).parent().innerHeight() ? ($(g).removeClass("zoomable"), $("#zoom-in").hide()) : ($(g).addClass("zoomable"), $("#zoom-in").show()))
            }
            var f = this,
                g = a.el ? a.el : null;
            g && b(), f.toggleZoom = function() {
                $(g).hasClass("zoomed") ? ($(g).removeClass("zoomed"), $("#zoom-in").show(), $("#zoom-out").hide()) : (d(.5 * $(g).width(), .5 * $(g).height()), $("#zoom-in").hide(), $("#zoom-out").show())
            }, f.reset = function() {
                $(g).removeClass("zoomed"), $(g).off("load", e), $(window).off("resize", e)
            }, f.init = function() {
                $("#zoom-in").hide(), $("#zoom-out").hide(), $("#open-link").hide(), $(g).addClass("zoomable"), e(), $(g).on("load", e), $(window).on("resize", e)
            }
        }
        Dsbmobile.ImageView = a
    }(),
    function() {
        function a(a) {
            function b() {
                $(d).find("iframe").load(function() {
                    $(this).fadeIn(300), $(d).parent().find(".spinner").fadeOut(300)
                })
            }
            var c = this,
                d = a.el ? a.el : null;
            d && b(), c.reset = function() {}, c.init = function() {
                $("#zoom-in").hide(), $("#zoom-out").hide(), $("#open-link").show()
            }
        }
        Dsbmobile.IframeView = a
    }(),
    function() {
        function a(a) {
            function b() {
                $(g).toggleClass("active"), $(h).toggleClass("active"), $(menu).toggleClass("active"), $(i).toggleClass("active")
            }

            function c() {
                $(i).bind("touchstart click", function(a) {
                    a.preventDefault(), a.stopPropagation(), b()
                }), $("body").on("click touchstart", "#clickpreventer-overlay.active", function(a) {
                    a.preventDefault(), a.stopPropagation(), b()
                }), $("body").on("click", "#rootmenu a", function(a) {
                    a.stopPropagation(), a.preventDefault(), Dsbmobile.Router.navigate($(this).attr("href").substring(1)), $(g).removeClass("active"), $(h).removeClass("active"), $(menu).removeClass("active"), $(i).removeClass("active")
                });
                var a, c;
                $("body").on("touchstart", "#rootmenu a", function(b) {
                    var d = b.originalEvent.touches[0] || b.originalEvent.changedTouches[0];
                    a = d.pageX, c = d.pageY
                }), $("body").on("touchend", "#rootmenu a", function(b) {
                    b.preventDefault(), b.stopPropagation();
                    var d = b.originalEvent.touches[0] || b.originalEvent.changedTouches[0],
                        e = Math.abs(d.pageX - a),
                        f = Math.abs(d.pageY - c);
                    3 > e && 3 > f && (Dsbmobile.Router.navigate($(this).attr("href").substring(1)), $(g).removeClass("active"), $(h).removeClass("active"), $(menu).removeClass("active"), $(i).removeClass("active"))
                })
            }

            function d(a, b, c, e) {
                var f = $("#menuItemTemplate").html(),
                    g = Handlebars.compile(f);
                for (var h in a) {
                    var i = a[h],
                        j = document.createElement("li");
                    if (b.append(j), "" == i.method) $(j).html("<span>" + i.title + "</span>");
                    else {
                        var k = $.parseHTML(g({
                            href: "#menu=" + e + "&item=" + h,
                            imgsrc: i.iconLink,
                            title: i.title,
                            itemId: "#menu=" + e + "&item=" + h
                        }));
                        $(j).html(k)
                    }
                    if (i.childs.length > 0) {
                        var l = document.createElement("ul");
                        b.append(l), d(i.childs, $(l), !0, h)
                    }
                }
            }
            var e = this,
                a = a ? a : {},
                f = a.el ? a.el : $("#menu"),
                g = a.layout ? a.layout : $("#layout"),
                h = a.layout ? a.layout : $("#clickpreventer-overlay"),
                i = a.menuLink ? a.menuLink : $("#menuLink");
            e.setSelected = function(a, b) {
                $(f).find(".menu-selected").removeClass("menu-selected"), $("#rootmenu a").each(function() {
                    $(this).attr("data-item-id") == "#menu=" + a + "&item=" + b && $(this).addClass("menu-selected")
                })
            }, e.init = function() {
                var a = Dsbmobile.Repository.getData();
                c(), d(a, f.find("#rootmenu"), !1)
            }
        }
        Dsbmobile.Sidemenu = new a
    }(),
    function() {
        function a() {
            var a = this;
            a.el = $("#content"), a.init = function() {
                $(a.el).html("")
            }, a.setContent = function(b) {
                $(a.el).html(""), $("body").scrollTop(0), $(a.el).html(b)
            }
        }
        Dsbmobile.Content = new a
    }(),
    function() {
        function a() {
            function a() {
                f = new Hammer($("#overlay #close-btn")[0]), f.on("tap", function(a) {
                    a.srcEvent.preventDefault(), i.setVisibility(!1), $(j).find(".overlay-content").html(""), b()
                }), g = new Hammer($(l)[0]), g.on("tap", function(a) {
                    a.srcEvent.preventDefault(), $(this).hasClass("disabled") || i.toSlide(parseInt(d) + 1)
                }), h = new Hammer($(m)[0]), h.on("tap", function(a) {
                    a.srcEvent.preventDefault(), $(this).hasClass("disabled") || i.toSlide(parseInt(d) - 1)
                }), $(j).find(".zoom-control").hammer().on("tap", function() {
                    null != d && e[d].imageView && e[d].imageView.toggleZoom()
                })
            }

            function b() {
                f.off("tap"), g.off("tap"), h.off("tap"), $(j).find(".zoom-control").off("tap")
            }

            function c() {
                d + 1 > k - 1 ? $(l).addClass("disabled") : $(l).removeClass("disabled"), 0 > d - 1 ? $(m).addClass("disabled") : $(m).removeClass("disabled")
            }
            var d, e, f, g, h, i = this,
                j = $("#overlay"),
                k = 0,
                l = null,
                m = null,
                n = 0;
            i.init = function() {
                var a = $("#overlayTemplate").html(),
                    b = Handlebars.compile(a);
                $(j).html(b()), l = $(j).find(".control-next"), m = $(j).find(".control-prev")
            }, i.setContent = function(b) {
                $(j).find(".overlay-content").hide(), $(j).find(".overlay-content").html(b), $(j).find(".overlay-content").fadeIn(500), a()
            }, i.toSlide = function(a) {
                a = parseInt(a);
                var b = d;
                if (null != d && e[d].imageView ? e[d].imageView.reset() : null != d && e[d].IframeView && e[d].IframeView.reset(), d = a > k - 1 ? k - 1 : 0 > a || void 0 == a ? 0 : a, b != d) {
                    var f = $(j).find(".slides-wrapper"),
                        g = $(f).children().eq(d);
                    if ($(g).find("img").length) {
                        var h = $(g).find("img"),
                            i = $(h).attr("data-src");
                        $(h).attr({
                            src: i
                        }), e[d] && e[d].imageView && e[d].imageView.init()
                    }
                    if ($(g).find("iframe").length) {
                        var i = $(g).find("iframe").attr("data-src");
                        $(g).find("iframe").attr({
                            src: i
                        }), $("#open-link").attr({
                            href: i
                        }), e[d] && e[d].IframeView && e[d].IframeView.init()
                    }
                    var l = -100 * d;
                    $(f).css({
                        transform: "translateX(" + l + "%)",
                        "-webkit-transform": "translateX(" + l + "%)",
                        "-moz-transform": "translateX(" + l + "%)",
                        "-o-transform": "translateX(" + l + "%)"
                    }), c(), $(j).find(".position").html(parseInt(d) + 1 + "/" + k)
                }
            }, i.setSlider = function(a, b) {
                n = b, e = a, d = null, k = a.length, a[b] && a[b].parent && $(".overlay-head .title").html(a[b].parent.title);
                var c = $("#sliderTemplate").html(),
                    f = Handlebars.compile(c),
                    g = $.parseHTML(f());
                i.setContent(g), i.setVisibility(!0);
                for (var h = $(g).find(".slides-wrapper"), c = $("#sliderItemTemplate").html(), j = Handlebars.compile(c), b = 0; b < a.length; b++) {
                    var l = a[b],
                        m = $.parseHTML(j());
                    h.append(m);
                    var o = $(m).find(".slide-content");
                    switch ($(o).html('<div class="spinner dark"><div class="loader">Loading...</div></div>'), parseInt(l.type)) {
                        case Dsbmobile.SPOTTYPS.IMG:
                            var p = $('<img class="preview" style="display: none" data-src="' + l.url + '" />');
                            $(o).append('<span class="vertical-align-helper"></span>'), $(o).append(p), l.imageView = new Dsbmobile.ImageView({
                                el: p
                            });
                            break;
                        case Dsbmobile.SPOTTYPS.HTML:
                        case Dsbmobile.SPOTTYPS.URL:
                            var q = $.parseHTML('<div class="iframe-wrapper"><iframe style="display: none" data-src="' + l.url + '" ></iframe></div>');
                            $(o).append(q), l.IframeView = new Dsbmobile.IframeView({
                                el: q
                            })
                    }
                }
                i.toSlide(n), setTimeout(function() {
                    $(h).addClass("animate")
                }, 300)
            }, i.setVisibility = function(a) {
                if (1 == a) j.show(), $("body").css({
                    top: -1 * $(document).scrollTop() + "px"
                }), $("body").addClass("noTouch noScroll");
                else {
                    var b = -1 * parseInt($("body").css("top"));
                    j.hide(), $("body").css({
                        top: 0
                    }), $("body").removeClass("noTouch noScroll"), $(document).scrollTop(b)
                }
            }
        }
        Dsbmobile.Overlay = new a
    }(),
    function() {
        function a() {
            function a() {
                document.addEventListener("click", c, !0), document.addEventListener("touchstart", c, !0)
            }

            function b() {
                document.removeEventListener("click", c, !0), document.removeEventListener("touchstart", c, !0)
            }

            function c(a) {
                a.stopPropagation(), $(a.target).is("#notificationView") && d.clickCallback && d.clickCallback(), d.el.removeClass("active"), b()
            }
            var d = this;
            d.el = $("#notificationView"), d.title = $("#notificationView").find(".title"), d.message = $("#notificationView").find(".message"), d.icon = $("#notificationView").find(".notification-icon"), d.clickCallback, d.init = function() {
                d.title.html(""), d.message.html("")
            }, d.setNotification = function(b) {
                b.setTimer = void 0 != b.setTimer ? b.setTimer : !0, b.level = void 0 != b.level ? b.level : "info", d.clickCallback = b.clickCallback ? b.clickCallback : null, d.el.removeClass("warning"), d.el.removeClass("success"), d.el.removeClass("info"), d.el.addClass(b.level), d.el.addClass("active"), d.title.html(b.title), d.message.html(b.message), b.link && d.el.find("a").attr("href", b.link), d.icon.html(b.icon ? '<i class="fa ' + b.icon + '"></i>' : "success" == b.level ? '<i class="fa fa-check-circle"></i>' : "error" == b.level ? '<i class="fa fa-exclamation-circle"></i>' : '<i class="fa fa-info-circle"></i>'), b.setTimer && setTimeout(function() {
                    d.el.removeClass("active")
                }, 1e4), a()
            }
        }
        Dsbmobile.Notification = new a
    }(),
    function() {
        Dsbmobile.ConfirmationView = function(a) {
            function b() {
                d.el.off("click touchstart", ".okBtn"), d.el.off("click touchstart", ".cancelBtn"), d.el.on("click touchstart", ".okBtn", function(a) {
                    a.preventDefault(), a.stopPropagation(), void 0 !== d.onOk && d.onOk(), d.el.fadeOut(200), setTimeout(function() {
                        d.el.remove()
                    }, 200)
                }), d.el.on("click touchstart", ".cancelBtn", function(a) {
                    a.preventDefault(), a.stopPropagation(), void 0 !== d.onCancel && d.onCancel(), d.el.fadeOut(200), setTimeout(function() {
                        d.el.remove()
                    }, 200)
                })
            }

            function c() {
                var a = $("#confirmationTemplate").html(),
                    c = Handlebars.compile(a),
                    e = $.parseHTML(c({
                        title: d.title,
                        text: d.text,
                        ok: d.okTitle,
                        cancel: d.cancelTitle
                    }));
                $("body").append(e), d.el = $("#confirmationDialog"), b()
            }
            var d = this;
            d.options = void 0 !== a ? a : {}, d.el = null, d.okTitle = void 0 !== d.options.okTitle ? d.options.okTitle : void 0, d.cancelTitle = void 0 !== d.options.cancelTitle ? d.options.cancelTitle : void 0, d.title = void 0 !== d.options.title ? d.options.title : void 0, d.text = void 0 !== d.options.text ? d.options.text : void 0, d.onCancel = void 0 !== d.options.onCancel ? d.options.onCancel : void 0, d.onOk = void 0 !== d.options.onOk ? d.options.onOk : void 0, c()
        }
    }(),
    function() {
        Dsbmobile.Classes.Slider = function(a) {
            var b = this;
            b.options = a ? a : {}, b.debug = b.options.debug ? b.options.debug : 0, b.el = b.options.el ? b.options.el : $(".slider"), b.wrapperWidth = 0, b.parentWidth = 0, b.parentHeight = 0, b.slidePosition = b.options.start ? b.options.start : 0, b.numberOfSlides = b.el.find(".slides-wrapper").find(".slide").length, b.positionBox = b.el.find(".position"), b.currentScale = 1, b.init = function() {
                b.reset(), b.resizeSlider(), b.bindEvents()
            }, b.reset = function() {
                b.el.find(".control-left").off("click touchstart"), b.el.find(".control-right").off("click touchstart"), b.el.off()
            }, b.setPositionIndicator = function() {
                if (b.positionBox.html(""), b.numberOfSlides > 1 && b.numberOfSlides < 10)
                    for (var a = 0; a < b.numberOfSlides; a++)
                        if (a == b.slidePosition) b.positionBox.append('<div class="circle active"></div>');
                        else {
                            var c = $.parseHTML('<div class="circle" onclick=""></div>');
                            b.positionBox.append(c),
                                function(a) {
                                    $(c).on("click touchstart", function(c) {
                                        c.stopPropagation(), b.slidePosition = a, b.moveSlide(300)
                                    })
                                }(a)
                        }
                else b.numberOfSlides > 1 && b.positionBox.html(parseInt(b.slidePosition) + 1 + " von " + b.numberOfSlides)
            }, b.disableTouch = function() {}, b.setScale = function(a) {
                var c = b.el.find(".slides-wrapper").find(".slide:eq(" + b.slidePosition + ")");
                b.currentScale = a, c.find(".preview").css({
                    "-webkit-transform": "scale(" + a + ")",
                    "-moz-transform": "scale(" + a + ")",
                    "-ms-transform": "scale(" + a + ")",
                    "-o-transform": "scale(" + a + ")",
                    transform: "scale(" + a + ")"
                })
            }, b.bindEvents = function() {
                b.el.find(".control-left").on("touchstart click", function(a) {
                    a.preventDefault(), a.stopPropagation(), b.setScale(1), b.slidePosition--, b.moveSlide()
                }), b.el.find(".control-right").on("touchstart click", function(a) {
                    a.preventDefault(), a.stopPropagation(), b.setScale(1), b.slidePosition++, b.moveSlide()
                }), b.el.find(".control-left, .control-right").on("touchend", function(a) {
                    a.stopPropagation()
                }), b.el.find(".position").on("click touchstart", function(a) {
                    a.stopPropagation()
                }), $(window).off("resize", b.resizeSlider), $(window).resize(b.resizeSlider), $(b.el).on("mouseenter", function() {
                    $(this).addClass("hover")
                }), $(b.el).on("hover", "iframe", function() {
                    $(this).parents(b.el).addClass("hover")
                }), $(b.el).on("mouseleave", function() {
                    $(this).removeClass("hover")
                });
                var a, c, d, e = 50,
                    f = 200;
                b.el.bind("touchstart", function(e) {
                    e.preventDefault(), e.stopPropagation();
                    var f = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                    c = f.pageX, a = parseInt(b.el.find(".slides-wrapper").css("marginLeft")), d = (new Date).getTime()
                }), b.el.bind("touchmove", function(d) {
                    d.preventDefault(), d.stopPropagation();
                    var e = d.originalEvent.touches[0] || d.originalEvent.changedTouches[0];
                    b.el.find(".slides-wrapper").css("marginLeft", a + (e.pageX - c) + "px")
                }), b.el.bind("touchend", function(g) {
                    g.preventDefault(), g.stopPropagation();
                    var h = g.originalEvent.touches[0] || g.originalEvent.changedTouches[0],
                        i = (new Date).getTime() - d,
                        j = h.pageX - c;
                    b.setScale(1), f >= i && j >= e ? b.slidePosition-- : f >= i && Math.abs(j) >= e ? b.slidePosition++ : (a = parseInt(b.el.find(".slides-wrapper").css("marginLeft")), b.slidePosition = Math.round(-a / b.parentWidth)), b.slidePosition < 0 && (b.slidePosition = 0), b.slidePosition >= b.numberOfSlides && (b.slidePosition = b.numberOfSlides - 1), b.moveSlide()
                })
            }, b.toggleControls = function() {
                var a = b.el.find(".slides-wrapper").find(".slide:eq(" + b.slidePosition + ")");
                a.find("iframe").length > 0 ? (b.el.find(".control-left").addClass("iframe"), b.el.find(".control-right").addClass("iframe")) : (b.el.find(".control-left").removeClass("iframe"), b.el.find(".control-right").removeClass("iframe")), b.slidePosition < 1 ? b.el.find(".control-left").addClass("hide") : b.el.find(".control-left").removeClass("hide"), b.slidePosition >= b.numberOfSlides - 1 ? b.el.find(".control-right").addClass("hide") : b.el.find(".control-right").removeClass("hide")
            }, b.resizeSlider = function() {
                b.parentWidth = b.el.width(), b.parentHeight = b.el.find(".slides-wrapper").height(), b.el.find(".slide").width(b.parentWidth), b.el.find(".slide").height(b.parentHeight), b.el.find(".slide").css({
                    "max-height": b.parentHeight + "px"
                }), b.el.find(".slides-wrapper").width(b.numberOfSlides * b.parentWidth), b.el.find(".iframe-wrapper").each(function() {
                    $(this).width(b.parentWidth), $(this).height(b.parentHeight)
                }), b.setScale(1), b.moveSlide(0)
            }, b.moveSlide = function(a) {
                var a = void 0 != a ? a : 250,
                    c = b.el.find(".slides-wrapper");
                c.animate({
                    "margin-left": -(b.parentWidth * b.slidePosition) + "px"
                }, a);
                for (var d = c.find(".slide"), e = b.slidePosition - 1 < 0 ? 0 : b.slidePosition - 1, f = b.slidePosition + 1 > d.length ? d.length : b.slidePosition + 1, g = e; f >= g; g++)
                    if ($(d[g]).find("img")) {
                        var h = $(d[g]).find("img").attr("data-src");
                        $(d[g]).find("img").attr({
                            src: h
                        })
                    } b.toggleControls(), b.setPositionIndicator()
            }
        }
    }(),
    function() {
        Dsbmobile.Views.News = function(a) {
            var b = this,
                c = a.content;
            b.init = function() {
                var a = $("#newsTemplate").html(),
                    b = Handlebars.compile(a),
                    d = $.parseHTML(b()),
                    a = $("#newsItemTemplate").html(),
                    e = Handlebars.compile(a);
                if (0 == c.length) {
                    var f = document.createElement("div");
                    $(f).addClass("noContent"), $(f).html("Es wurden keine News hinterlegt."), $(d).append(f)
                } else
                    for (var g in c) {
                        var h = c[g],
                            i = $.parseHTML(e({
                                title: h.title,
                                meta: Dsbmobile.Helper.toDateString(h.date),
                                content: h.url
                            }));
                        $(d).find(".news-wrapper").append(i)
                    }
                Dsbmobile.Content.setContent(d);
                new Masonry(".news-wrapper", {
                    itemSelector: ".news-element",
                    transitionDuration: "0.1s",
                    columnWidth: ".news-element"
                })
            }, b.reload = function() {
                Dsbmobile.Content.setContent(""), b.init()
            }
        }
    }(),
    function() {
        Dsbmobile.Views.Timetable = function(a) {
            function b(a, b) {
                ! function() {
                    var c = new Hammer.Manager($(a)[0]);
                    c.add(new Hammer.Tap({
                        event: "singletap"
                    })), c.on("singletap", function(a) {
                        a.srcEvent.preventDefault(), Dsbmobile.Overlay.setSlider(e[b].childs, 0)
                    })
                }()
            }
            var c = this,
                d = "timetableView clearfix",
                e = a.content ? a.content : Array();
            c.init = function() {
                var a = document.createElement("div");
                if ($(a).addClass(d), Dsbmobile.Content.setContent(a), 0 == e.length) {
                    var c = document.createElement("div");
                    $(c).addClass("noContent"), $(c).html("Es wurden keine Inhalte hinterlegt."), $(a).append(c)
                } else
                    for (var f in e) {
                        var g = e[f],
                            h = $("#timetableItemTemplate").html(),
                            i = Handlebars.compile(h),
                            j = $(i({
                                uuid: g.id,
                                title: g.title,
                                meta: Dsbmobile.Helper.toDateString(g.date),
                                page: g.childs.length,
                                index: f
                            }));
                        $(a).append(j);
                        var k = Dsbmobile.Helper.getPreviewImage(g.childs[0].preview, 600);
                        0 != k ? ($(j).find(".timetable-content").append('<img class="preview" style="display: none" src="' + k + '" />'), $(j).find(".timetable-content .preview").load(function() {
                            $(this).fadeIn(300), $(this).parent().find(".preview-default").fadeOut(300)
                        })) : $(j).find(".overlay-bg").fadeOut(300), b($(j), f)
                    }
            }, c.reload = function() {
                Dsbmobile.Content.setContent(""), c.init()
            }
        }
    }(),
    function() {
        Dsbmobile.Views.Tiles = function(a) {
            var b = this,
                c = null,
                d = "tilesView",
                e = a.content,
                f = Array();
            b.destroy = function() {
                for (var a in f) f[a].destroy()
            }, b.reload = function() {
                Dsbmobile.Content.setContent(""), b.destroy(), b.init()
            }, b.init = function() {
                var a = document.createElement("div");
                if ($(a).addClass(d), Dsbmobile.Content.setContent(a), c = $(a), 0 == e.length) {
                    var b = document.createElement("div");
                    $(b).addClass("noContent"), $(b).html("Es wurden keine Inhalte hinterlegt."), $(a).append(b)
                } else
                    for (var g in e) {
                        var h = e[g].childs,
                            i = $("#tileRowTemplate").html(),
                            j = (Handlebars.compile(i), $.parseHTML("<div></div>"));
                        $(a).append(j);
                        var k = new Dsbmobile.Views.TilesRow({
                            el: j,
                            content: h
                        });
                        f.push(k)
                    }
            }
        }
    }(),
    function() {
        Dsbmobile.Views.tileItemView = function(a) {
            function b() {
                var a = new Hammer.Manager(d[0]);
                a.add(new Hammer.Tap({
                    event: "singletap"
                })), a.on("singletap", function(a) {
                    a.srcEvent.preventDefault(), Dsbmobile.Overlay.setSlider(f, g)
                })
            }

            function c() {
                var a = Dsbmobile.Helper.getPreviewImage(e.preview, 300);
                if (0 != a) {
                    var b = new Image;
                    b.onload = function() {
                        $(d).find(".tile-content").css({
                            backgroundImage: 'url("' + a + '")'
                        })
                    }, b.src = a
                }
            }
            var d = a.el,
                e = a.content,
                f = a.rowContent,
                g = a.index;
            b(), c()
        }
    }(),
    function() {
        Dsbmobile.Views.TilesRow = function(a) {
            function b() {
                var a = $("#tileRowTemplate").html(),
                    b = Handlebars.compile(a);
                $(l).append(b()), i = $(l).find(".control-left"), j = $(l).find(".control-right");
                for (var c in m) {
                    var a = $("#tileItemTemplate").html(),
                        d = Handlebars.compile(a),
                        e = $(d({
                            title: m[c].title,
                            meta: Dsbmobile.Helper.toDateString(m[c].date),
                            page: parseInt(c) + 1 + "/" + m.length
                        }));
                    $(l).find(".tiles-wrapper").append(e), Dsbmobile.Views.tileItemView({
                        el: e,
                        content: m[c],
                        rowContent: m,
                        index: c
                    })
                }
            }

            function c() {
                {
                    var a = $(l).width(),
                        b = ($(l).find(".tiles-wrapper"), $(l).find(".tiles-wrapper").width());
                    $(l).find(".tiles-wrapper").find(".tile").outerWidth(!0)
                }
                0 == o ? i.addClass("deactive") : i.removeClass("deactive"), a >= b + o ? j.addClass("deactive") : j.removeClass("deactive")
            }

            function d() {
                n = o
            }

            function e(a) {
                a.srcEvent.preventDefault(), a.srcEvent.stopPropagation();
                var b = $(l).find(".tiles-wrapper"),
                    c = parseInt(n) + parseInt(a.deltaX);
                $(b).css({
                    transform: "translateX(" + c + "px)",
                    "-webkit-transform": "translateX(" + c + "px)",
                    "-moz-transform": "translateX(" + c + "px)",
                    "-o-transform": "translateX(" + c + "px)",
                    "-ms-transform": "translateX(" + c + "px)"
                }), o = c
            }

            function f() {
                var a = $(l).find(".tiles-wrapper"),
                    b = $(l).find(".tiles-wrapper"),
                    d = $(l).width(),
                    e = $(l).find(".tiles-wrapper").width(),
                    f = $(l).find(".tile").outerWidth(!0),
                    g = Math.floor(d / f);
                g = g > m.length ? m.length : g;
                var h = g * f,
                    i = Math.round(o / f) * f;
                i > 0 ? i = 0 : 0 > e - h + i && (i = -(e - h)), a.addClass("animate"), $(b).css({
                    transform: "translateX(" + i + "px)",
                    "-webkit-transform": "translateX(" + i + "px)",
                    "-moz-transform": "translateX(" + i + "px)",
                    "-o-transform": "translateX(" + i + "px)",
                    "-ms-transform": "translateX(" + i + "px)"
                }), o = i, setTimeout(function() {
                    a.removeClass("animate"), c()
                }, 300)
            }

            function g(a) {
                var b = $(l).find(".tiles-wrapper"),
                    d = b.parent().width(),
                    e = $(b).find(".tile").outerWidth(!0),
                    f = 0;

                b.addClass("animate"), "right" == a && (f = o - Math.floor(d / e) * e), "left" == a && (f = o + Math.floor(d / e) * e, f = f > 0 ? 0 : f), $(b).css({
                    transform: "translateX(" + f + "px)",
                    "-webkit-transform": "translateX(" + f + "px)",
                    "-moz-transform": "translateX(" + f + "px)",
                    "-o-transform": "translateX(" + f + "px)",
                    "-ms-transform": "translateX(" + f + "px)"
                }), o = f, setTimeout(function() {
                    b.removeClass("animate"), c()
                }, 300)
            }

            function h() {
                var a = new Hammer($(l).find(".tiles-wrapper")[0]);
                a.on("panstart", d), a.on("panmove", e), a.on("panend", f), $(l).find(".control-right").on("click", function() {
                    g("right")
                }), $(l).find(".control-left").on("click", function() {
                    g("left")
                }), $(window).on("resize", c)
            }
            var i, j, k = this,
                l = a.el,
                m = a.content,
                n = 0,
                o = 0;
            b(), h(), c(), k.destroy = function() {
                $(l).find(".control-right").off("click", function() {
                    g("right")
                }), $(l).find(".control-left").off("click", function() {
                    g("left")
                }), $(window).off("resize", c)
            }
        }
    }(),
    function() {
        Dsbmobile.Views.List = function(a) {
            function b() {
                $(".list-wrapper").on("scroll", function() {
                    i.scrollTop = $(".list-wrapper").scrollTop()
                })
            }

            function c(a, b) {
                ! function(a, b) {
                    a.click(function(a) {
                        if (a.preventDefault(), b.item.type == Dsbmobile.SPOTTYPS.FOLDER || a.shiftKey || "prev" == b.action)
                            if (d(b.item), "next" == b.action) {
                                var c = $.parseHTML("<li>" + b.foldername + "</li>");
                                k.append(c)
                            } else k.children().last().remove();
                        else b.item.type != Dsbmobile.SPOTTYPS.FOLDER && Dsbmobile.Overlay.setSlider(b.item.childs, 0)
                    })
                }(a, b)
            }

            function d(a) {
                var b = a.parent ? a.parent : null,
                    d = Array();
                if (void 0 != a.childs && a.childs.length > 0 ? d = a.childs : void 0 != a.content && a.content.length > 0 && (d = a.content), i = a, $(j).html(""), void 0 != b) {
                    var g = $("#listItemTemplate").html(),
                        h = Handlebars.compile(g),
                        k = $.parseHTML(h({
                            title: "...",
                            isBack: !0
                        }));
                    $(j).append(k), c($(k), {
                        item: b,
                        action: "prev"
                    })
                }
                var l = f(d, Dsbmobile.SPOTTYPS.FOLDER, !0),
                    m = f(d, Dsbmobile.SPOTTYPS.FOLDER);
                e(m, j), e(l, j), $(".list-wrapper").scrollTop(void 0 != i.scrollTop && i.scrollTop > 0 ? i.scrollTop : 0)
            }

            function e(a, b) {
                if (a.length > 0)
                    for (var d = 0; d < a.length; d++) {
                        var e = $("#listItemTemplate").html(),
                            f = Handlebars.compile(e),
                            g = $.parseHTML(f({
                                isFolder: a[d].type == Dsbmobile.SPOTTYPS.FOLDER ? !0 : !1,
                                title: a[d].title,
                                action: "next",
                                meta: Dsbmobile.Helper.toDateString(a[d].date)
                            }));
                        $(b).append(g), c($(g), {
                            foldername: a[d].title,
                            rootIndex: d,
                            content: a,
                            item: a[d],
                            action: "next"
                        })
                    }
            }

            function f(a, b, c) {
                var d = Array(),
                    c = void 0 != c ? c : !1;
                if (a.length > 0)
                    for (var e = 0; e < a.length; e++)(a[e].type == b && 0 == c || a[e].type != b && 1 == c) && d.push(a[e]);
                return d
            }
            var g = this,
                h = (a.content, a.menuItem),
                i = null,
                j = null,
                k = null;
            g.init = function() {
                var a = $("#listTemplate").html(),
                    c = Handlebars.compile(a),
                    e = $.parseHTML(c());
                j = $(e).find(".list-wrapper"), Dsbmobile.Content.setContent(e), h.scrollTop = 0, d(h, null), k = $("#current-path"), b()
            }, g.reload = function() {
                d(i)
            }
        }
    }(),
    function() {
        Dsbmobile.Views.Feedback = function() {
            function a() {
                $(".feedbackView").on("mouseleave", ".rankingStars", function() {
                    c($(this), $(this).attr("data-stars"))
                }), $(".feedbackView").on("mouseenter", ".star", function() {
                    var a = $(this).index() + 1;
                    c($(this).parent(), a)
                }), $(".feedbackView").on("click touchstart", ".star", function() {
                    var a = $(this).index() + 1;
                    $(this).parent().attr("data-stars", a), c($(this).parent(), a)
                }), $(".feedbackView").on("focusout", "#mail", function() {
                    "" == $(this).val() || b($(this).val()) || $(this).addClass("error")
                }), $(".feedbackView").on("keypress", "#mail.error", function() {
                    (b($(this).val()) || "" == $(this).val()) && $(this).removeClass("error")
                }), $(".feedbackView").on("click touchstart", "#sendmail", function(a) {
                    a.preventDefault(), a.stopPropagation();
                    var c = {};
                    $(".rankingStars").each(function() {
                        c[$(this).attr("data-criteria")] = $(this).attr("data-stars")
                    }), $("#comment").blur(), $("#mail").blur();
                    var d = $("#comment").val(),
                        e = $("#mail").val();
                    if ("" != e && !b(e)) return void Dsbmobile.Notification.setNotification({
                        level: "warning",
                        title: "Feedback",
                        message: "Keine gültige E-Mail-Adresse"
                    });
                    if ("" == e) {
                        new Dsbmobile.ConfirmationView({
                            okTitle: "Senden",
                            cancelTitle: "Abbrechen",
                            title: "Achtung",
                            text: "Wollen Sie wirklich keine E-Mail-Adresse eingeben? Diese kann für eventuelle Rückfragen verwendet werden.",
                            onOk: function() {
                                Dsbmobile.Helper.sendFeedback(c, d, e), $(".feedbackView").off("click touchstart", "#sendmail"), $("#sendmail").addClass("disabled")
                            },
                            onCancle: function() {}
                        })
                    } else Dsbmobile.Helper.sendFeedback(c, d, e), $(".feedbackView").off("click touchstart", "#sendmail"), $("#sendmail").addClass("disabled")
                })
            }

            function b(a) {
                var b = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
                return b.test(a)
            }

            function c(a, b) {
                var c = a.children();
                c.attr("src", "images/star-o.png");
                for (var d = 0; b > d; d++) $(c[d]).attr("src", "images/star-full.png")
            }
            var d = this;
            d.el = null, d.init = function() {
                var b = $("#feedbackTemplate").html(),
                    c = Handlebars.compile(b),
                    e = $.parseHTML(c());
                Dsbmobile.Content.setContent(e), d.el = $(e).find(".feedbackView");
                for (var f in Dsbmobile.FEEDBACKTYPES) {
                    var b = $("#feedbackItemTemplate").html(),
                        c = Handlebars.compile(b),
                        g = $.parseHTML(c({
                            criteria: f,
                            title: Dsbmobile.FEEDBACKTYPES[f]
                        }));
                    $(e).find(".rankingItems").append(g)
                }
                a()
            }
        }
    }(),
    function() {
        Dsbmobile.Views.Text = function(a) {
            var b = this;
            b.options = void 0 !== a ? a : {}, b.contentTemplate = void 0 !== b.options.contentTemplate ? b.options.contentTemplate : void 0, b.init = function() {
                var a = $("#textTemplate").html(),
                    c = Handlebars.compile(a),
                    d = $.parseHTML(c());
                if (Dsbmobile.Content.setContent(d), void 0 !== b.contentTemplate) {
                    var a = $(b.contentTemplate).html(),
                        c = Handlebars.compile(a),
                        e = $.parseHTML(c());
                    $(d).html(e)
                }
            }
        }
    }(),
    function() {
        Dsbmobile.Views.About = function() {}, Dsbmobile.Views.About.prototype = new Dsbmobile.Views.Text, Dsbmobile.Views.About.prototype.contentTemplate = "#aboutTemplate"
    }(),
    function() {
        Dsbmobile.Views.Logout = function() {
            var a = this;
            a.init = function() {
                location.assign("Login.aspx?logout")
            }
        }
    }(),
    function() {
        Dsbmobile.Classes.MenuItem = function(a) {
            var b = this;
            b.iconLink = a.iconLink ? a.iconLink : "", b.index = a.index ? a.index : "", b["default"] = a["default"] ? a["default"] : !1, b.method = a.method ? a.method : "", b.title = a.title ? a.title : "", b.childs = a.childs ? a.childs : Array(), b.content = a.content ? a.content : Array()
        }
    }(),
    function() {
        Dsbmobile.Classes.NewsCollection = function() {}
    }(),
    function() {
        Dsbmobile.Classes.ContentItem = function(a) {
            var b = this;
            b.parent = a.parent ? a.parent : null, b.type = a.type ? a.type : "", b.date = a.date ? a.date : "", b.url = a.url ? a.url : "", b.id = a.id ? a.id : "", b.priority = a.priority ? a.priority : "", b.tags = a.tags ? a.tags : "", b.title = a.title ? a.title : "", b.childs = a.childs ? a.childs : Array(), b.preview = a.preview ? a.preview : ""
        }
    }(),
    function() {
        function a(a, b) {
            return new c(this.slice(a, b))
        }

        function b(a, b) {
            arguments.length < 2 && (b = 0);
            for (var c = 0, d = a.length; d > c; ++c, ++b) this[b] = 255 & a[c]
        }

        function c(c) {
            var d;
            if ("number" == typeof c) {
                d = [];
                for (var e = 0; c > e; ++e) d[e] = 0
            } else d = c.slice(0);
            return d.subarray = a, d.buffer = d, d.byteLength = d.length, d.set = b, "object" == typeof c && c.buffer && (d.buffer = c.buffer), d
        }
        return "undefined" != typeof Uint8Array ? ("undefined" == typeof Uint8Array.prototype.subarray && (Uint8Array.prototype.subarray = function(a, b) {
            return new Uint8Array(this.slice(a, b))
        }, Float32Array.prototype.subarray = function(a, b) {
            return new Float32Array(this.slice(a, b))
        }), void("undefined" == typeof Float64Array && (window.Float64Array = Float32Array))) : (window.Uint8Array = c, window.Uint32Array = c, window.Int32Array = c, window.Uint16Array = c, window.Float32Array = c, void(window.Float64Array = c))
    }(),
    function() {
        "undefined" == typeof Object.create && (Object.create = function(a) {
            var b = function() {};
            return b.prototype = a, new b
        })
    }(),
    function() {
        if ("undefined" != typeof Object.defineProperty) {
            var a = !0;
            try {
                Object.defineProperty(new Image, "id", {
                    value: "test"
                });
                var b = function() {};
                b.prototype = {
                    get id() {}
                }, Object.defineProperty(new b, "id", {
                    value: "",
                    configurable: !0,
                    enumerable: !0,
                    writable: !1
                })
            } catch (c) {
                a = !1
            }
            if (a) return
        }
        Object.defineProperty = function(a, b, c) {
            delete a[b], "get" in c && a.__defineGetter__(b, c.get), "set" in c && a.__defineSetter__(b, c.set), "value" in c && (a.__defineSetter__(b, function(a) {
                return this.__defineGetter__(b, function() {
                    return a
                }), a
            }), a[b] = c.value)
        }
    }(),
    function() {
        "undefined" == typeof Object.keys && (Object.keys = function(a) {
            var b = [];
            for (var c in a) a.hasOwnProperty(c) && b.push(c);
            return b
        })
    }(),
    function() {
        if ("undefined" != typeof FileReader) {
            var a = FileReader.prototype;
            "readAsArrayBuffer" in a || Object.defineProperty(a, "readAsArrayBuffer", {
                value: function(a) {
                    var b = new FileReader,
                        c = this;
                    b.onload = function(a) {
                        for (var b = a.target.result, d = new ArrayBuffer(b.length), e = new Uint8Array(d), f = 0, g = b.length; g > f; f++) e[f] = b.charCodeAt(f);
                        Object.defineProperty(c, "result", {
                            value: d,
                            enumerable: !0,
                            writable: !1,
                            configurable: !0
                        });
                        var h = document.createEvent("HTMLEvents");
                        h.initEvent("load", !1, !1), c.dispatchEvent(h)
                    }, b.readAsBinaryString(a)
                }
            })
        }
    }(),
    function() {
        function a() {
            this.overrideMimeType("text/plain; charset=x-user-defined")
        }

        function b() {
            var a, b = this.responseText,
                c = b.length,
                d = new Uint8Array(c);
            for (a = 0; c > a; ++a) d[a] = 255 & b.charCodeAt(a);
            return d
        }
        var c = XMLHttpRequest.prototype;
        if ("overrideMimeType" in c || Object.defineProperty(c, "overrideMimeType", {
                value: function() {}
            }), !("response" in c || "mozResponseArrayBuffer" in c || "mozResponse" in c || "responseArrayBuffer" in c)) {
            if ("undefined" != typeof VBArray) return void Object.defineProperty(c, "response", {
                get: function() {
                    return new Uint8Array(new VBArray(this.responseBody).toArray())
                }
            });
            "function" == typeof c.overrideMimeType && Object.defineProperty(c, "responseType", {
                set: a
            }), Object.defineProperty(c, "response", {
                get: b
            })
        }
    }(),
    function() {
        if (!("btoa" in window)) {
            var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            window.btoa = function(b) {
                var c, d, e = "";
                for (c = 0, d = b.length; d > c; c += 3) {
                    var f = 255 & b.charCodeAt(c),
                        g = 255 & b.charCodeAt(c + 1),
                        h = 255 & b.charCodeAt(c + 2),
                        i = f >> 2,
                        j = (3 & f) << 4 | g >> 4,
                        k = d > c + 1 ? (15 & g) << 2 | h >> 6 : 64,
                        l = d > c + 2 ? 63 & h : 64;
                    e += a.charAt(i) + a.charAt(j) + a.charAt(k) + a.charAt(l)
                }
                return e
            }
        }
    }(),
    function() {
        "atob" in window || (window.atob = function(a) {
            for (var b, c, d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", e = String(a).replace(/=+$/, ""), f = 0, g = 0, h = ""; c = e.charAt(g++); ~c && (b = f % 4 ? 64 * b + c : c, f++ % 4) ? h += String.fromCharCode(255 & b >> (-2 * f & 6)) : 0) c = d.indexOf(c);
            return h
        })
    }(),
    function() {
        "undefined" == typeof Function.prototype.bind && (Function.prototype.bind = function(a) {
            var b = this,
                c = Array.prototype.slice.call(arguments, 1),
                d = function() {
                    var d = Array.prototype.concat.apply(c, arguments);
                    return b.apply(a, d)
                };
            return d
        })
    }(),
    function() {
        if ("documentMode" in document && (9 === document.documentMode || 10 === document.documentMode)) {
            var a = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, "src");
            Object.defineProperty(HTMLIFrameElement.prototype, "src", {
                get: function() {
                    return this.$src
                },
                set: function(b) {
                    return this.$src = b, "data:text/html" != b.substr(0, 14) ? void a.set.call(this, b) : (a.set.call(this, "about:blank"), void setTimeout(function() {
                        var a = this.contentDocument;
                        a.open("text/html"), a.write(b.substr(b.indexOf(",") + 1)), a.close()
                    }.bind(this), 0))
                },
                enumerable: !0
            })
        }
    }(),
    function() {
        var a = document.createElement("div");
        "dataset" in a || Object.defineProperty(HTMLElement.prototype, "dataset", {
            get: function() {
                if (this._dataset) return this._dataset;
                for (var a = {}, b = 0, c = this.attributes.length; c > b; b++) {
                    var d = this.attributes[b];
                    if ("data-" == d.name.substring(0, 5)) {
                        var e = d.name.substring(5).replace(/\-([a-z])/g, function(a, b) {
                            return b.toUpperCase()
                        });
                        a[e] = d.value
                    }
                }
                return Object.defineProperty(this, "_dataset", {
                    value: a,
                    writable: !1,
                    enumerable: !1
                }), a
            },
            enumerable: !0
        })
    }(),
    function() {
        function a(a, b, c, d) {
            var e = a.className || "",
                f = e.split(/\s+/g);
            "" == f[0] && f.shift();
            var g = f.indexOf(b);
            0 > g && c && f.push(b), g >= 0 && d && f.splice(g, 1), a.className = f.join(" ")
        }
        var b = document.createElement("div");
        if (!("classList" in b)) {
            var c = {
                add: function(b) {
                    a(this.element, b, !0, !1)
                },
                remove: function(b) {
                    a(this.element, b, !1, !0)
                },
                toggle: function(b) {
                    a(this.element, b, !0, !0)
                }
            };
            Object.defineProperty(HTMLElement.prototype, "classList", {
                get: function() {
                    if (this._classList) return this._classList;
                    var a = Object.create(c, {
                        element: {
                            value: this,
                            writable: !1,
                            enumerable: !0
                        }
                    });
                    return Object.defineProperty(this, "_classList", {
                        value: a,
                        writable: !1,
                        enumerable: !1
                    }), a
                },
                enumerable: !0
            })
        }
    }(),
    function() {
        "undefined" == typeof console ? console = {
            log: function() {},
            error: function() {}
        } : "bind" in console.log || (console.log = function(a) {
            return function(b) {
                return a(b)
            }
        }(console.log), console.error = function(a) {
            return function(b) {
                return a(b)
            }
        }(console.error))
    }(),
    function() {
        function a(a) {
            b(a.target) && a.stopPropagation()
        }

        function b(a) {
            return a.disabled || a.parentNode && b(a.parentNode)
        } - 1 != navigator.userAgent.indexOf("Opera") && document.addEventListener("click", a, !0)
    }(),
    function() {
        "language" in navigator || Object.defineProperty(navigator, "language", {
            get: function() {
                var a = navigator.userLanguage || "en-US";
                return a.substring(0, 2).toLowerCase() + a.substring(2).toUpperCase()
            },
            enumerable: !0
        })
    }();
