(function (e) {
        var t = [],
            n = function () {}, r = {
                defaultPath: "/",
                before: n,
                on: n,
                notfound: n
            }, o = {
                current: null,
                previous: null,
                config: function (e) {
                    for (var t in e) e.hasOwnProperty(t) && (r[t] = e[t]);
                    return o
                },
                add: function (e, n, r) {
                    return e && n && ("function" == typeof n && (r = n, n = null), t.push({
                                path: e,
                                name: n,
                                fn: r || function () {}
                            })), o
                },
                go: function (e) {
                    return location.hash = e, o
                },
                back: function (e) {
                    return o.previous ? (history.back(), o.previous = null) : e && (location.hash = e), o
                }
            }, i = function () {
                var e = location.hash.slice(1),
                    n = !1,
                    i = o.current;
                e || (e = r.defaultPath), i && i != o.previous && (o.previous = i), o.current = e;
                for (var s = 0, a = t.length; a > s && !n; s++) {
                    var l = t[s],
                        c = l.path,
                        u = l.name,
                        f = l.fn;
                    if ("string" == typeof c) c.toLowerCase() == e.toLowerCase() && (r.before.call(o, c, u), f.call(o), r.on.call(o, c, u), n = !0);
                    else {
                        var d = e.match(c);
                        d && (r.before.call(o, c, u, d), f.apply(o, d), r.on.call(o, c, u, d), n = !0)
                    }
                }
                return n || r.notfound.call(o), o
            };
        o.init = function () {
            return e.addEventListener("hashchange", i), i()
        }, o.reload = i, e.ruto = o
    })(window),
function (e, t) {
    function n(e, n) {
        r.addType(e, function (i, s, a) {
                var l, c, u, f, d = s,
                    m = (new Date).getTime();
                if (!i) {
                    d = {}, f = [], u = 0;
                    try {
                        for (i = n.length; i = n.key(u++);) o.test(i) && (c = JSON.parse(n.getItem(i)), c.expires && m >= c.expires ? f.push(i) : d[i.replace(o, "")] = c.data);
                        for (; i = f.pop();) n.removeItem(i)
                    } catch (p) {}
                    return d
                }
                if (i = "__amplify__" + i, s === t) {
                    if (l = n.getItem(i), c = l ? JSON.parse(l) : {
                            expires: -1
                        }, !(c.expires && m >= c.expires)) return c.data;
                    n.removeItem(i)
                } else if (null === s) n.removeItem(i);
                else {
                    c = JSON.stringify({
                            data: s,
                            expires: a.expires ? m + a.expires : null
                        });
                    try {
                        n.setItem(i, c)
                    } catch (p) {
                        r[e]();
                        try {
                            n.setItem(i, c)
                        } catch (p) {
                            throw r.error()
                        }
                    }
                }
                return d
            })
    }
    var r = e.store = function (e, t, n) {
        var o = r.type;
        return n && n.type && n.type in r.types && (o = n.type), r.types[o](e, t, n || {})
    };
    r.types = {}, r.type = null, r.addType = function (e, t) {
        r.type || (r.type = e), r.types[e] = t, r[e] = function (t, n, o) {
            return o = o || {}, o.type = e, r(t, n, o)
        }
    }, r.error = function () {
        return "amplify.store quota exceeded"
    };
    var o = /^__amplify__/;
    for (var i in {
            localStorage: 1,
            sessionStorage: 1
        }) try {
            window[i].setItem("__amplify__", "x"), window[i].removeItem("__amplify__"), n(i, window[i])
    } catch (s) {}
    if (!r.types.localStorage && window.globalStorage) try {
            n("globalStorage", window.globalStorage[window.location.hostname]), "sessionStorage" === r.type && (r.type = "globalStorage")
    } catch (s) {}(function () {
            if (!r.types.localStorage) {
                var e = document.createElement("div"),
                    n = "amplify";
                e.style.display = "none", document.getElementsByTagName("head")[0].appendChild(e);
                try {
                    e.addBehavior("#default#userdata"), e.load(n)
                } catch (o) {
                    return e.parentNode.removeChild(e), t
                }
                r.addType("userData", function (o, i, s) {
                        e.load(n);
                        var a, l, c, u, f, d = i,
                            m = (new Date).getTime();
                        if (!o) {
                            for (d = {}, f = [], u = 0; a = e.XMLDocument.documentElement.attributes[u++];) l = JSON.parse(a.value), l.expires && m >= l.expires ? f.push(a.name) : d[a.name] = l.data;
                            for (; o = f.pop();) e.removeAttribute(o);
                            return e.save(n), d
                        }
                        if (o = o.replace(/[^\-._0-9A-Za-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c-\u200d\u203f\u2040\u2070-\u218f]/g, "-"), o = o.replace(/^-/, "_-"), i === t) {
                            if (a = e.getAttribute(o), l = a ? JSON.parse(a) : {
                                    expires: -1
                                }, !(l.expires && m >= l.expires)) return l.data;
                            e.removeAttribute(o)
                        } else null === i ? e.removeAttribute(o) : (c = e.getAttribute(o), l = JSON.stringify({
                                        data: i,
                                        expires: s.expires ? m + s.expires : null
                                    }), e.setAttribute(o, l));
                        try {
                            e.save(n)
                        } catch (p) {
                            null === c ? e.removeAttribute(o) : e.setAttribute(o, c), r.userData();
                            try {
                                e.setAttribute(o, l), e.save(n)
                            } catch (p) {
                                throw null === c ? e.removeAttribute(o) : e.setAttribute(o, c), r.error()
                            }
                        }
                        return d
                    })
            }
        })(),
    function () {
        function e(e) {
            return e === t ? t : JSON.parse(JSON.stringify(e))
        }
        var n = {}, o = {};
        r.addType("memory", function (r, i, s) {
                return r ? i === t ? e(n[r]) : (o[r] && (clearTimeout(o[r]), delete o[r]), null === i ? (delete n[r], null) : (n[r] = i, s.expires && (o[r] = setTimeout(function () {
                                    delete n[r], delete o[r]
                                }, s.expires)), i)) : e(n)
            })
    }()
}(this.amplify = this.amplify || {});
var Hogan = {};
(function (e, t) {
        function n(e, t, n) {
            var r;
            return t && "object" == typeof t && (null != t[e] ? r = t[e] : n && t.get && "function" == typeof t.get && (r = t.get(e))), r
        }

        function r(e, t, n, r) {
            function o() {}

            function i() {}
            o.prototype = e, i.prototype = e.subs;
            var s, a = new o;
            a.subs = new i, a.subsText = {}, a.ib();
            for (s in t) a.subs[s] = t[s], a.subsText[s] = r;
            for (s in n) a.partials[s] = n[s];
            return a
        }

        function o(e) {
            return (null === e || void 0 === e ? "" : e) + ""
        }

        function i(e) {
            return e = o(e), f.test(e) ? e.replace(s, "&amp;").replace(a, "&lt;").replace(l, "&gt;").replace(c, "&#39;").replace(u, "&quot;") : e
        }
        e.Template = function (e, t, n, r) {
            e = e || {}, this.r = e.code || this.r, this.c = n, this.options = r || {}, this.text = t || "", this.partials = e.partials || {}, this.subs = e.subs || {}, this.ib()
        }, e.Template.prototype = {
            r: function () {
                return ""
            },
            v: i,
            t: o,
            render: function (e, t, n) {
                return this.ri([e], t || {}, n)
            },
            ri: function (e, t, n) {
                return this.r(e, t, n)
            },
            ep: function (e, t) {
                var n = this.partials[e],
                    o = t[n.name];
                if (n.instance && n.base == o) return n.instance;
                if ("string" == typeof o) {
                    if (!this.c) throw Error("No compiler available.");
                    o = this.c.compile(o, this.options)
                }
                return o ? (this.partials[e].base = o, n.subs && (void 0 === this.activeSub && (t.stackText = this.text), o = r(o, n.subs, n.partials, t.stackText || this.text)), this.partials[e].instance = o, o) : null
            },
            rp: function (e, t, n, r) {
                var o = this.ep(e, n);
                return o ? o.ri(t, n, r) : ""
            },
            rs: function (e, t, n) {
                var r = e[e.length - 1];
                if (!d(r)) return n(e, t, this), void 0;
                for (var o = 0; r.length > o; o++) e.push(r[o]), n(e, t, this), e.pop()
            },
            s: function (e, t, n, r, o, i, s) {
                var a;
                return d(e) && 0 === e.length ? !1 : ("function" == typeof e && (e = this.ms(e, t, n, r, o, i, s)), a = !! e, !r && a && t && t.push("object" == typeof e ? e : t[t.length - 1]), a)
            },
            d: function (e, t, r, o) {
                var i, s = e.split("."),
                    a = this.f(s[0], t, r, o),
                    l = this.options.modelGet,
                    c = null;
                if ("." === e && d(t[t.length - 2])) a = t[t.length - 1];
                else for (var u = 1; s.length > u; u++) i = n(s[u], a, l), null != i ? (c = a, a = i) : a = "";
                return o && !a ? !1 : (o || "function" != typeof a || (t.push(c), a = this.mv(a, t, r), t.pop()), a)
            },
            f: function (e, t, r, o) {
                for (var i = !1, s = null, a = !1, l = this.options.modelGet, c = t.length - 1; c >= 0; c--) if (s = t[c], i = n(e, s, l), null != i) {
                        a = !0;
                        break
                    }
                return a ? (o || "function" != typeof i || (i = this.mv(i, t, r)), i) : o ? !1 : ""
            },
            ls: function (e, t, n, r, i) {
                var s = this.options.delimiters;
                return this.options.delimiters = i, this.b(this.ct(o(e.call(t, r)), t, n)), this.options.delimiters = s, !1
            },
            ct: function (e, t, n) {
                if (this.options.disableLambda) throw Error("Lambda features disabled.");
                return this.c.compile(e, this.options).render(t, n)
            },
            b: t ? function (e) {
                this.buf.push(e)
            } : function (e) {
                this.buf += e
            },
            fl: t ? function () {
                var e = this.buf.join("");
                return this.buf = [], e
            } : function () {
                var e = this.buf;
                return this.buf = "", e
            },
            ib: function () {
                this.buf = t ? [] : ""
            },
            ms: function (e, t, n, r, o, i, s) {
                var a, l = t[t.length - 1],
                    c = e.call(l);
                return "function" == typeof c ? r ? !0 : (a = this.activeSub && this.subsText[this.activeSub] ? this.subsText[this.activeSub] : this.text, this.ls(c, l, n, a.substring(o, i), s)) : c
            },
            mv: function (e, t, n) {
                var r = t[t.length - 1],
                    i = e.call(r);
                return "function" == typeof i ? this.ct(o(i.call(r)), r, n) : i
            },
            sub: function (e, t, n, r) {
                var o = this.subs[e];
                o && (this.activeSub = e, o(t, n, this, r), this.activeSub = !1)
            }
        };
        var s = /&/g,
            a = /</g,
            l = />/g,
            c = /\'/g,
            u = /\"/g,
            f = /[&<>\"\']/,
            d = Array.isArray || function (e) {
                return "[object Array]" === Object.prototype.toString.call(e)
            }
    })("undefined" != typeof exports ? exports : Hogan),
function (e) {
    var t = function () {
        return +new Date
    }, n = !! e.XDomainRequest,
        r = "withCredentials" in new XMLHttpRequest || n,
        o = !1,
        i = 2e4,
        s = {};
    try {
        o = new Worker("js/hnapi-worker.js"), o.addEventListener("message", function (e) {
                var t = e.data,
                    n = t.url || "";
                if (s[n]) {
                    var r = s[n];
                    t.error ? r.error(t.error) : r.success(t.response), delete s[n]
                }
            }, !1)
    } catch (a) {}
    var l = function (a, l, c) {
        if (l || (l = function () {}), c || (c = function () {}), r) if (o) s[a] = {
                    success: l,
                    error: c
            }, o.postMessage({
                url: a,
                timeout: i
            });
        else {
            var u = s[a] || (n ? new XDomainRequest : new XMLHttpRequest);
            u._timeout && clearTimeout(u._timeout), u._timeout = setTimeout(function () {
                    u.abort()
                }, i), u.onload = function () {
                clearTimeout(this._timeout), delete s[a];
                try {
                    l(JSON.parse(this.responseText))
                } catch (e) {
                    c(e)
                }
            }, u.onerror = u.onabort = u.ontimeout = function (e) {
                clearTimeout(this._timeout), delete s[a], c(e)
            }, (1 >= u.readyState || n) && (u.open("GET", a + "?" + t(), !0), u.send()), s[a] = u
        } else {
            var f = e.document,
                d = f.createElement("script"),
                m = "callback" + t();
            e[m] = l, d.onerror = c, d.src = a + "?callback=" + m, f.body.appendChild(d)
        }
    }, c = ["http://node-hnapi-eu.herokuapp.com/", "http://node-hnapi.azurewebsites.net/", "http://node-hnapi-asia.azurewebsites.net/", "http://node-hnapi-eus.azurewebsites.net/", "http://node-hnapi-weu.azurewebsites.net/", "http://node-hnapi-wus.azurewebsites.net/", "http://node-hnapi-ncus.azurewebsites.net/"],
        u = function (e) {
            for (var t = e.length - 1; t > 0; t--) {
                var n = Math.floor(Math.random() * (t + 1)),
                    r = e[t];
                e[t] = e[n], e[n] = r
            }
        };
    u(c);
    var f = c.length,
        d = function (e, t, n, r) {
            var o = f - 1 > e ? function () {
                    d(e + 1, t, n, r)
                } : r;
            l(c[e] + t, n, o)
        }, m = function (e, t, n) {
            l(c[0] + e, t, function () {
                    d(0, e, t, n)
                })
        }, p = {
            urls: c,
            news: function (e, t) {
                m("news", e, t)
            },
            news2: function (e, t) {
                m("news2", e, t)
            },
            item: function (e, t, n) {
                m("item/" + e, t, n)
            },
            comments: function (e, t, n) {
                m("comments/" + e, t, n)
            }
        };
    e.hnapi = p
}(window),
function (e, t) {
    "function" == typeof define && define.amd ? define("tappable", [], function () {
            return t(e, window.document), e.tappable
        }) : t(e, window.document)
}(this, function (e, t) {
        var n = Math.abs,
            r = function () {}, o = {
                noScroll: !1,
                activeClass: "tappable-active",
                onTap: r,
                onStart: r,
                onMove: r,
                onMoveOut: r,
                onMoveIn: r,
                onEnd: r,
                onCancel: r,
                allowClick: !1,
                boundMargin: 50,
                noScrollDelay: 0,
                activeClassDelay: 0,
                inactiveClassDelay: 0
            }, i = "ontouchend" in document,
            s = {
                start: i ? "touchstart" : "mousedown",
                move: i ? "touchmove" : "mousemove",
                end: i ? "touchend" : "mouseup"
            }, a = function (e, n) {
                var r = t.elementFromPoint(e, n);
                return 3 == r.nodeType && (r = r.parentNode), r
            }, l = function (e) {
                var t = e.target;
                if (t) return 3 == t.nodeType && (t = t.parentNode), t;
                var n = e.targetTouches[0];
                return a(n.clientX, n.clientY)
            }, c = function (e) {
                return e.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "")
            }, u = function (e, t) {
                return t ? e.classList ? (e.classList.add(t), void 0) : (c(e.className).indexOf(t) > -1 || (e.className = c(e.className + " " + t)), void 0) : void 0
            }, f = function (e, t) {
                return t ? e.classList ? (e.classList.remove(t), void 0) : (e.className = e.className.replace(RegExp("(^|\\s)" + t + "(?:\\s|$)"), "$1"), void 0) : void 0
            }, d = function (e, n) {
                var r = t.documentElement,
                    o = r.matchesSelector || r.mozMatchesSelector || r.webkitMatchesSelector || r.oMatchesSelector || r.msMatchesSelector;
                return o.call(e, n)
            }, m = function (e, t) {
                var n = !1;
                do n = d(e, t); while (!n && (e = e.parentNode) && e.ownerDocument);
                return n ? e : !1
            };
        e.tappable = function (e, r) {
            "function" == typeof r && (r = {
                    onTap: r
                });
            var i = {};
            for (var c in o) i[c] = r[c] || o[c];
            var d, p, h, v, b, w, g, y, _ = i.containerElement || t.body,
                T = !1,
                S = !1,
                k = i.activeClass,
                E = i.activeClassDelay,
                L = i.inactiveClassDelay,
                x = i.noScroll,
                M = i.noScrollDelay,
                A = i.boundMargin,
                N = function (t) {
                    var n = m(l(t), e);
                    if (n) {
                        if (E ? (clearTimeout(w), w = setTimeout(function () {
                                        u(n, k)
                                    }, E)) : u(n, k), L && n == p && clearTimeout(g), h = t.clientX, v = t.clientY, !h || !v) {
                            var r = t.targetTouches[0];
                            h = r.clientX, v = r.clientY
                        }
                        d = n, T = !1, S = !1, b = x ? n.getBoundingClientRect() : null, M && (clearTimeout(y), x = !1, y = setTimeout(function () {
                                    x = !0
                                }, M)), i.onStart.call(_, t, n)
                    }
                }, C = function (e) {
                    if (d) {
                        x ? e.preventDefault() : clearTimeout(w);
                        var t = e.target,
                            r = e.clientX,
                            o = e.clientY;
                        if (!t || !r || !o) {
                            var s = e.changedTouches[0];
                            r || (r = s.clientX), o || (o = s.clientY), t || (t = a(r, o))
                        }
                        x ? r > b.left - A && b.right + A > r && o > b.top - A && b.bottom + A > o ? (S = !1, u(d, k), i.onMoveIn.call(_, e, t)) : (S = !0, f(d, k), i.onMoveOut.call(_, e, t)) : !T && n(o - v) > 10 && (T = !0, f(d, k), i.onCancel.call(t, e)), i.onMove.call(_, e, t)
                    }
                }, I = function (e) {
                    if (d) {
                        if (clearTimeout(w), L) {
                            E && !T && u(d, k);
                            var t = d;
                            g = setTimeout(function () {
                                    f(t, k)
                                }, L)
                        } else f(d, k);
                        i.onEnd.call(_, e, d);
                        var n = 3 == e.which || 2 == e.button;
                        T || S || n || i.onTap.call(_, e, d), p = d, d = null, setTimeout(function () {
                                h = v = null
                            }, 400)
                    }
                }, q = function (e) {
                    d && (f(d, k), d = h = v = null, i.onCancel.call(_, e))
                }, O = function (t) {
                    var r = m(t.target, e);
                    r ? t.preventDefault() : h && v && 25 > n(t.clientX - h) && 25 > n(t.clientY - v) && (t.stopPropagation(), t.preventDefault())
                };
            return _.addEventListener(s.start, N, !1), _.addEventListener(s.move, C, !1), _.addEventListener(s.end, I, !1), _.addEventListener("touchcancel", q, !1), i.allowClick || _.addEventListener("click", O, !1), {
                el: _,
                destroy: function () {
                    return _.removeEventListener(s.start, N, !1), _.removeEventListener(s.move, C, !1), _.removeEventListener(s.end, I, !1), _.removeEventListener("touchcancel", q, !1), i.allowClick || _.removeEventListener("click", O, !1), this
                }
            }
        }
    });
var TWEEN = TWEEN || function () {
        var e = [];
        return {
            REVISION: "10",
            getAll: function () {
                return e
            },
            removeAll: function () {
                e = []
            },
            add: function (t) {
                e.push(t)
            },
            remove: function (t) {
                var n = e.indexOf(t); - 1 !== n && e.splice(n, 1)
            },
            update: function (t) {
                if (0 === e.length) return !1;
                var n = 0,
                    r = e.length;
                for (t = void 0 !== t ? t : void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now(); r > n;) e[n].update(t) ? n++ : (e.splice(n, 1), r--);
                return !0
            }
        }
    }();
TWEEN.Tween = function (e) {
    var t = e,
        n = {}, r = {}, o = {}, i = 1e3,
        s = 0,
        a = 0,
        l = null,
        c = TWEEN.Easing.Linear.None,
        u = TWEEN.Interpolation.Linear,
        f = [],
        d = null,
        m = !1,
        p = null,
        h = null;
    for (var v in e) n[v] = parseFloat(e[v], 10);
    this.to = function (e, t) {
        return void 0 !== t && (i = t), r = e, this
    }, this.start = function (e) {
        TWEEN.add(this), m = !1, l = void 0 !== e ? e : void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now(), l += a;
        for (var i in r) {
            if (r[i] instanceof Array) {
                if (0 === r[i].length) continue;
                r[i] = [t[i]].concat(r[i])
            }
            n[i] = t[i], n[i] instanceof Array == !1 && (n[i] *= 1), o[i] = n[i] || 0
        }
        return this
    }, this.stop = function () {
        return TWEEN.remove(this), this
    }, this.delay = function (e) {
        return a = e, this
    }, this.repeat = function (e) {
        return s = e, this
    }, this.easing = function (e) {
        return c = e, this
    }, this.interpolation = function (e) {
        return u = e, this
    }, this.chain = function () {
        return f = arguments, this
    }, this.onStart = function (e) {
        return d = e, this
    }, this.onUpdate = function (e) {
        return p = e, this
    }, this.onComplete = function (e) {
        return h = e, this
    }, this.update = function (e) {
        if (l > e) return !0;
        m === !1 && (null !== d && d.call(t), m = !0);
        var v = (e - l) / i;
        v = v > 1 ? 1 : v;
        var b = c(v);
        for (var w in r) {
            var g = n[w] || 0,
                y = r[w];
            y instanceof Array ? t[w] = u(y, b) : ("string" == typeof y && (y = g + parseFloat(y, 10)), t[w] = g + (y - g) * b)
        }
        if (null !== p && p.call(t, b), 1 == v) {
            if (s > 0) {
                isFinite(s) && s--;
                for (var w in o) "string" == typeof r[w] && (o[w] = o[w] + parseFloat(r[w], 10)), n[w] = o[w];
                return l = e + a, !0
            }
            null !== h && h.call(t);
            for (var _ = 0, T = f.length; T > _; _++) f[_].start(e);
            return !1
        }
        return !0
    }
}, TWEEN.Easing = {
    Linear: {
        None: function (e) {
            return e
        }
    },
    Quadratic: {
        In: function (e) {
            return e * e
        },
        Out: function (e) {
            return e * (2 - e)
        },
        InOut: function (e) {
            return 1 > (e *= 2) ? .5 * e * e : -.5 * (--e * (e - 2) - 1)
        }
    },
    Cubic: {
        In: function (e) {
            return e * e * e
        },
        Out: function (e) {
            return --e * e * e + 1
        },
        InOut: function (e) {
            return 1 > (e *= 2) ? .5 * e * e * e : .5 * ((e -= 2) * e * e + 2)
        }
    },
    Quartic: {
        In: function (e) {
            return e * e * e * e
        },
        Out: function (e) {
            return 1 - --e * e * e * e
        },
        InOut: function (e) {
            return 1 > (e *= 2) ? .5 * e * e * e * e : -.5 * ((e -= 2) * e * e * e - 2)
        }
    },
    Quintic: {
        In: function (e) {
            return e * e * e * e * e
        },
        Out: function (e) {
            return --e * e * e * e * e + 1
        },
        InOut: function (e) {
            return 1 > (e *= 2) ? .5 * e * e * e * e * e : .5 * ((e -= 2) * e * e * e * e + 2)
        }
    },
    Sinusoidal: {
        In: function (e) {
            return 1 - Math.cos(e * Math.PI / 2)
        },
        Out: function (e) {
            return Math.sin(e * Math.PI / 2)
        },
        InOut: function (e) {
            return .5 * (1 - Math.cos(Math.PI * e))
        }
    },
    Exponential: {
        In: function (e) {
            return 0 === e ? 0 : Math.pow(1024, e - 1)
        },
        Out: function (e) {
            return 1 === e ? 1 : 1 - Math.pow(2, -10 * e)
        },
        InOut: function (e) {
            return 0 === e ? 0 : 1 === e ? 1 : 1 > (e *= 2) ? .5 * Math.pow(1024, e - 1) : .5 * (-Math.pow(2, -10 * (e - 1)) + 2)
        }
    },
    Circular: {
        In: function (e) {
            return 1 - Math.sqrt(1 - e * e)
        },
        Out: function (e) {
            return Math.sqrt(1 - --e * e)
        },
        InOut: function (e) {
            return 1 > (e *= 2) ? -.5 * (Math.sqrt(1 - e * e) - 1) : .5 * (Math.sqrt(1 - (e -= 2) * e) + 1)
        }
    },
    Elastic: {
        In: function (e) {
            var t, n = .1,
                r = .4;
            return 0 === e ? 0 : 1 === e ? 1 : (!n || 1 > n ? (n = 1, t = r / 4) : t = r * Math.asin(1 / n) / (2 * Math.PI), -(n * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - t) * 2 * Math.PI / r)))
        },
        Out: function (e) {
            var t, n = .1,
                r = .4;
            return 0 === e ? 0 : 1 === e ? 1 : (!n || 1 > n ? (n = 1, t = r / 4) : t = r * Math.asin(1 / n) / (2 * Math.PI), n * Math.pow(2, -10 * e) * Math.sin((e - t) * 2 * Math.PI / r) + 1)
        },
        InOut: function (e) {
            var t, n = .1,
                r = .4;
            return 0 === e ? 0 : 1 === e ? 1 : (!n || 1 > n ? (n = 1, t = r / 4) : t = r * Math.asin(1 / n) / (2 * Math.PI), 1 > (e *= 2) ? -.5 * n * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - t) * 2 * Math.PI / r) : .5 * n * Math.pow(2, -10 * (e -= 1)) * Math.sin((e - t) * 2 * Math.PI / r) + 1)
        }
    },
    Back: {
        In: function (e) {
            var t = 1.70158;
            return e * e * ((t + 1) * e - t)
        },
        Out: function (e) {
            var t = 1.70158;
            return --e * e * ((t + 1) * e + t) + 1
        },
        InOut: function (e) {
            var t = 2.5949095;
            return 1 > (e *= 2) ? .5 * e * e * ((t + 1) * e - t) : .5 * ((e -= 2) * e * ((t + 1) * e + t) + 2)
        }
    },
    Bounce: {
        In: function (e) {
            return 1 - TWEEN.Easing.Bounce.Out(1 - e)
        },
        Out: function (e) {
            return 1 / 2.75 > e ? 7.5625 * e * e : 2 / 2.75 > e ? 7.5625 * (e -= 1.5 / 2.75) * e + .75 : 2.5 / 2.75 > e ? 7.5625 * (e -= 2.25 / 2.75) * e + .9375 : 7.5625 * (e -= 2.625 / 2.75) * e + .984375
        },
        InOut: function (e) {
            return .5 > e ? .5 * TWEEN.Easing.Bounce.In(2 * e) : .5 * TWEEN.Easing.Bounce.Out(2 * e - 1) + .5
        }
    }
}, TWEEN.Interpolation = {
    Linear: function (e, t) {
        var n = e.length - 1,
            r = n * t,
            o = Math.floor(r),
            i = TWEEN.Interpolation.Utils.Linear;
        return 0 > t ? i(e[0], e[1], r) : t > 1 ? i(e[n], e[n - 1], n - r) : i(e[o], e[o + 1 > n ? n : o + 1], r - o)
    },
    Bezier: function (e, t) {
        var n, r = 0,
            o = e.length - 1,
            i = Math.pow,
            s = TWEEN.Interpolation.Utils.Bernstein;
        for (n = 0; o >= n; n++) r += i(1 - t, o - n) * i(t, n) * e[n] * s(o, n);
        return r
    },
    CatmullRom: function (e, t) {
        var n = e.length - 1,
            r = n * t,
            o = Math.floor(r),
            i = TWEEN.Interpolation.Utils.CatmullRom;
        return e[0] === e[n] ? (0 > t && (o = Math.floor(r = n * (1 + t))), i(e[(o - 1 + n) % n], e[o], e[(o + 1) % n], e[(o + 2) % n], r - o)) : 0 > t ? e[0] - (i(e[0], e[0], e[1], e[1], -r) - e[0]) : t > 1 ? e[n] - (i(e[n], e[n], e[n - 1], e[n - 1], r - n) - e[n]) : i(e[o ? o - 1 : 0], e[o], e[o + 1 > n ? n : o + 1], e[o + 2 > n ? n : o + 2], r - o)
    },
    Utils: {
        Linear: function (e, t, n) {
            return (t - e) * n + e
        },
        Bernstein: function (e, t) {
            var n = TWEEN.Interpolation.Utils.Factorial;
            return n(e) / n(t) / n(e - t)
        },
        Factorial: function () {
            var e = [1];
            return function (t) {
                var n, r = 1;
                if (e[t]) return e[t];
                for (n = t; n > 1; n--) r *= n;
                return e[t] = r
            }
        }(),
        CatmullRom: function (e, t, n, r, o) {
            var i = .5 * (n - e),
                s = .5 * (r - t),
                a = o * o,
                l = o * a;
            return (2 * t - 2 * n + i + s) * l + (-3 * t + 3 * n - 2 * i - s) * a + i * o + t
        }
    }
},
function () {
    for (var e = 0, t = ["ms", "moz", "webkit", "o"], n = 0; t.length > n && !window.requestAnimationFrame; ++n) window.requestAnimationFrame = window[t[n] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[t[n] + "CancelAnimationFrame"] || window[t[n] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function (t) {
            var n = (new Date).getTime(),
                r = Math.max(0, 16 - (n - e)),
                o = window.setTimeout(function () {
                        t(n + r)
                    }, r);
            return e = n + r, o
        }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function (e) {
            clearTimeout(e)
        })
}(),
function (e) {
    TEMPLATES = {
        "comments-toggle": new e({
                code: function (e, t, n) {
                    var r = this;
                    return r.b(n = n || ""), r.b('<button class="comments-toggle">'), r.b(r.v(r.f("comments_count", e, t, 0))), r.b(" "), r.b(r.v(r.f("i_reply", e, t, 0))), r.b("</button>"), r.fl()
                },
                partials: {},
                subs: {}
            }),
        comments: new e({
                code: function (e, t, n) {
                    var r = this;
                    return r.b(n = n || ""), r.s(r.f("comments", e, t, 1), e, t, 0, 13, 189, "{{ }}") && (r.rs(e, t, function (e, t, n) {
                                n.b('<li><p class="metadata"><b>'), n.b(n.v(n.f("user", e, t, 0))), n.b('</b> <time><a href="#" data-id="'), n.b(n.v(n.f("id", e, t, 0))), n.b('" class="comment-permalink">'), n.b(n.v(n.f("time_ago", e, t, 0))), n.b("</a></time></p><p>"), n.b(n.t(n.f("content", e, t, 0))), n.b("<ul>"), n.b(n.rp("<comments_list0", e, t, "")), n.b("</ul></li>")
                            }), e.pop()), r.fl()
                },
                partials: {
                    "<comments_list0": {
                        name: "comments_list",
                        partials: {},
                        subs: {}
                    }
                },
                subs: {}
            }),
        "post-comments": new e({
                code: function (e, t, n) {
                    var r = this;
                    return r.b(n = n || ""), r.b('<div class="post-content">'), r.s(r.f("has_post", e, t, 1), e, t, 0, 39, 577, "{{ }}") && (r.rs(e, t, function (e, t, n) {
                                n.b('<header><h1><a href="'), n.b(n.v(n.f("url", e, t, 0))), n.b('" target="_blank">'), n.b(n.v(n.f("title", e, t, 0))), n.b("<br>"), n.s(n.f("user", e, t, 1), e, t, 0, 107, 170, "{{ }}") && (n.rs(e, t, function (e, t, n) {
                                            n.s(n.f("domain", e, t, 1), e, t, 0, 118, 159, "{{ }}") && (n.rs(e, t, function (e, t, n) {
                                                        n.b('<span class="link-text">'), n.b(n.v(n.f("domain", e, t, 0))), n.b("</span>")
                                                    }), e.pop())
                                        }), e.pop()), n.b('</a></h1><p class="metadata">'), n.s(n.f("user", e, t, 1), e, t, 0, 217, 412, "{{ }}") && (n.rs(e, t, function (e, t, n) {
                                            n.b('<span class="inline-block">'), n.b(n.v(n.f("points", e, t, 0))), n.b(" "), n.b(n.v(n.f("i_point", e, t, 0))), n.b(" by "), n.b(n.v(n.f("user", e, t, 0))), n.b('</span> <span class="inline-block">'), n.b(n.v(n.f("time_ago", e, t, 0))), n.s(n.f("comments_count", e, t, 1), e, t, 0, 344, 386, "{{ }}") && (n.rs(e, t, function (e, t, n) {
                                                        n.b(" &middot; "), n.b(n.v(n.f("comments_count", e, t, 0))), n.b(" "), n.b(n.v(n.f("i_comment", e, t, 0)))
                                                    }), e.pop()), n.b("</span>")
                                        }), e.pop()), n.s(n.f("user", e, t, 1), e, t, 1, 0, 0, "") || (n.b('<span class="inline-block">'), n.b(n.v(n.f("time_ago", e, t, 0))), n.b("</span>")), n.b('<a href="'), n.b(n.v(n.f("hn_url", e, t, 0))), n.b('" target="_blank" class="external-link">'), n.b(n.v(n.f("short_hn_url", e, t, 0))), n.b("</a></p></header>")
                            }), e.pop()), r.s(r.f("has_content", e, t, 1), e, t, 0, 606, 929, "{{ }}") && (r.rs(e, t, function (e, t, n) {
                                n.b('<section class="grouped-tableview">'), n.b(n.t(n.f("content", e, t, 0))), n.s(n.f("has_poll", e, t, 1), e, t, 0, 667, 906, "{{ }}") && (n.rs(e, t, function (e, t, n) {
                                            n.b('<ul class="poll">'), n.s(n.f("poll", e, t, 1), e, t, 0, 693, 892, "{{ }}") && (n.rs(e, t, function (e, t, n) {
                                                        n.b('<li title="'), n.b(n.v(n.f("percentage", e, t, 0))), n.b('%"><span class="poll-details"><b>'), n.b(n.v(n.f("item", e, t, 0))), n.b('</b> <span class="points">'), n.b(n.v(n.f("points", e, t, 0))), n.b(" "), n.b(n.v(n.f("i_point", e, t, 0))), n.b('</span></span><div class="poll-bar"><span style="width: '), n.b(n.v(n.f("width", e, t, 0))), n.b('"></span></div></li>')
                                                    }), e.pop()), n.b("</ul>")
                                        }), e.pop()), n.b("</section>")
                            }), e.pop()), r.b('</div><section class="comments">'), r.s(r.f("loading", e, t, 1), e, t, 0, 989, 1030, "{{ }}") && (r.rs(e, t, function (e, t, n) {
                                n.b('<div class="loader">Loading&hellip;</div>')
                            }), e.pop()), r.s(r.f("load_error", e, t, 1), e, t, 0, 1057, 1140, "{{ }}") && (r.rs(e, t, function (e, t, n) {
                                n.b('<div class="load-error">Couldn\'t load comments.<br><button>Try again</button></div>')
                            }), e.pop()), r.s(r.f("loading", e, t, 1), e, t, 1, 0, 0, "") || r.s(r.f("load_error", e, t, 1), e, t, 1, 0, 0, "") || (r.s(r.f("has_comments", e, t, 1), e, t, 0, 1199, 1226, "{{ }}") && (r.rs(e, t, function (e, t, n) {
                                    n.b("<ul>"), n.b(n.rp("<comments_list0", e, t, "")), n.b("</ul>")
                                }), e.pop()), r.s(r.f("has_comments", e, t, 1), e, t, 1, 0, 0, "") || r.b('<p class="no-comments">No comments.</p>')), r.b("</section>"), r.fl()
                },
                partials: {
                    "<comments_list0": {
                        name: "comments_list",
                        partials: {},
                        subs: {}
                    }
                },
                subs: {}
            }),
        post: new e({
                code: function (e, t, n) {
                    var r = this;
                    return r.b(n = n || ""), r.b('<li id="story-'), r.b(r.v(r.f("id", e, t, 0))), r.b('" data-index="'), r.b(r.v(r.f("i", e, t, 0))), r.b('" class="post-'), r.b(r.v(r.f("type", e, t, 0))), r.b('"><a href="'), r.b(r.v(r.f("url", e, t, 0))), r.b('" class="'), r.s(r.f("detail_disclosure", e, t, 1), e, t, 0, 110, 127, "{{ }}") && (r.rs(e, t, function (e, t, n) {
                                n.b("detail-disclosure")
                            }), e.pop()), r.s(r.f("disclosure", e, t, 1), e, t, 0, 164, 174, "{{ }}") && (r.rs(e, t, function (e, t, n) {
                                n.b("disclosure")
                            }), e.pop()), r.b(" "), r.s(r.f("selected", e, t, 1), e, t, 0, 203, 211, "{{ }}") && (r.rs(e, t, function (e, t, n) {
                                n.b("selected")
                            }), e.pop()), r.b('"><div class="number">'), r.b(r.v(r.f("i", e, t, 0))), r.b('.</div><div class="story"><b>'), r.b(r.v(r.f("title", e, t, 0))), r.b("</b>"), r.s(r.f("user", e, t, 1), e, t, 0, 302, 594, "{{ }}") && (r.rs(e, t, function (e, t, n) {
                                n.b('<span class="metadata">'), n.s(n.f("domain", e, t, 1), e, t, 0, 336, 381, "{{ }}") && (n.rs(e, t, function (e, t, n) {
                                            n.b('<span class="link-text">'), n.b(n.v(n.f("domain", e, t, 0))), n.b("</span><br>")
                                        }), e.pop()), n.b('<span class="inline-block">'), n.b(n.v(n.f("points", e, t, 0))), n.b(" "), n.b(n.v(n.f("i_point", e, t, 0))), n.b(" by "), n.b(n.v(n.f("user", e, t, 0))), n.b('</span> <span class="inline-block">'), n.b(n.v(n.f("time_ago", e, t, 0))), n.s(n.f("comments_count", e, t, 1), e, t, 0, 519, 561, "{{ }}") && (n.rs(e, t, function (e, t, n) {
                                            n.b(" &middot; "), n.b(n.v(n.f("comments_count", e, t, 0))), n.b(" "), n.b(n.v(n.f("i_comment", e, t, 0)))
                                        }), e.pop()), n.b("</span></span>")
                            }), e.pop()), r.s(r.f("user", e, t, 1), e, t, 1, 0, 0, "") || (r.b('<span class="metadata">'), r.s(r.f("domain", e, t, 1), e, t, 0, 646, 691, "{{ }}") && (r.rs(e, t, function (e, t, n) {
                                    n.b('<span class="link-text">'), n.b(n.v(n.f("domain", e, t, 0))), n.b("</span><br>")
                                }), e.pop()), r.b('<span class="inline-block">'), r.b(r.v(r.f("time_ago", e, t, 0))), r.b("</span></span>")), r.b("</div></a>"), r.s(r.f("detail_disclosure", e, t, 1), e, t, 0, 796, 870, "{{ }}") && (r.rs(e, t, function (e, t, n) {
                                n.b('<a href="#/item/'), n.b(n.v(n.f("id", e, t, 0))), n.b('" class="detail-disclosure-button"><span></span></a>')
                            }), e.pop()), r.b("</li>"), r.fl()
                },
                partials: {},
                subs: {}
            }),
        "stories-load": new e({
                code: function (e, t, n) {
                    var r = this;
                    return r.b(n = n || ""), r.s(r.f("loading", e, t, 1), e, t, 0, 12, 53, "{{ }}") && (r.rs(e, t, function (e, t, n) {
                                n.b('<div class="loader">Loading&hellip;</div>')
                            }), e.pop()), r.s(r.f("load_error", e, t, 1), e, t, 0, 80, 132, "{{ }}") && (r.rs(e, t, function (e, t, n) {
                                n.b('<div class="load-error">Couldn\'t load stories.</div>')
                            }), e.pop()), r.fl()
                },
                partials: {},
                subs: {}
            })
    }
}(Hogan.Template),
function (e) {
    var t = e.document,
        n = e.$ = function (e) {
            return t.getElementById(e)
        }, r = {}, o = function (e) {
            var t = {};
            for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
            return t
        }, i = {
            pub: function (e, t) {
                var n = r[e];
                if (n) for (var o = 0, i = n.length; i > o; o++) n[o].call(this, t)
            },
            sub: function (e, t) {
                r[e] || (r[e] = []), r[e].push(t)
            },
            currentView: null,
            hideAllViews: function () {
                for (var e = t.querySelectorAll(".view"), n = 0, r = e.length; r > n; n++) e[n].classList.add("hidden")
            },
            tmpl: function (e, t) {
                var n = TEMPLATES[e];
                if (n) return t ? n.render(t) : n
            },
            setTitle: function (e) {
                var t = "HackerWeb";
                e && (e = e.replace(/^\s+|\s+$/g, ""), e.toLowerCase() != t.toLowerCase() && (t = e + " – " + t)), document.title = t
            }
        };
    "undefined" != typeof _gaq && i.sub("logAPIError", function (e) {
            _gaq.push(["_trackEvent", "Errors", "API", e])
        });
    var s = i.tmpl;
    amplify.store.sessionStorage && "function" == typeof amplify.store.sessionStorage || (amplify.store.sessionStorage = amplify.store.memory);
    var a = t.querySelector("#view-home .scroll"),
        l = a.querySelector("section"),
        c = !1;
    i.news = {
        options: {
            disclosure: !0
        },
        markupStory: function (e) {
            if (/^item/i.test(e.url)) e.url = "#/item/" + e.id;
            else {
                e.external = !0;
                var n = t.createElement("a");
                n.href = e.url, e.domain = n.hostname.replace(/^www\./, ""), delete n
            }
            return i.news.options.disclosure ? ("link" == e.type && (e.detail_disclosure = !0), /^#\//.test(e.url) && (e.disclosure = !0, e.domain = null)) : e.id && (e.url = "#/item/" + e.id), e.i_point = 1 == e.points ? "point" : "points", e.i_comment = 1 == e.comments_count ? "comment" : "comments", s("post", e)
        },
        markupStories: function (e, t) {
            var n = "";
            t || (t = 1);
            var r = i.news.markupStory;
            return e.forEach(function (e) {
                    e.i = t++, n += r(e)
                }), n
        },
        updateStory: function (e) {
            if (e && e.id) {
                var t, r = e.id,
                    o = e.data,
                    s = "hacker-news",
                    a = amplify.store(s);
                if (a) for (var l = 0, c = a.length; c > l; l++) {
                        var u = a[l];
                        if (r == u.id) {
                            t = u;
                            break
                        }
                }
                if (!t && (s = "hacker-news2", a = amplify.store(s))) for (var l = 0, c = a.length; c > l; l++) {
                        var u = a[l];
                        if (r == u.id) {
                            t = u;
                            break
                        }
                }
                if (t) {
                    var f = !1;
                    if (["title", "url", "time_ago", "comments_count", "points"].forEach(function (e) {
                                var n = o[e];
                                t[e] != n && (t[e] = n, f = !0)
                            }), f) {
                        amplify.store(s, a);
                        var d = n("story-" + r);
                        d && (t.selected = !! d.querySelector("a[href].selected"), t.i = d.dataset ? d.dataset.index : d.getAttribute("data-index"), d.insertAdjacentHTML("afterend", i.news.markupStory(t)), d.parentNode.removeChild(d))
                    }
                }
            }
        },
        render: function (e) {
            if (!c) {
                e || (e = {});
                var t = amplify.store("hacker-news-cached"),
                    r = s("stories-load"),
                    o = function (e) {
                        var t = e.slice(),
                            n = '<ul class="tableview tableview-links" id="hwlist">' + i.news.markupStories(t) + (amplify.store("hacker-news2") ? '<li><a class="more-link">More&hellip;<span class="loader"></span></a></li>' : "") + "</ul>";
                        l.innerHTML = n, i.pub("onRenderNews")
                    };
                if (t) {
                    var a = amplify.store("hacker-news"),
                        u = e.delay;
                    u ? (c = !0, l.innerHTML = r.render({
                                loading: !0
                            }), setTimeout(function () {
                                c = !1, o(a)
                            }, u)) : o(a)
                } else {
                    c = !0, l.innerHTML = r.render({
                            loading: !0
                        });
                    var f = function () {
                        l.innerHTML = r.render({
                                load_error: !0
                            }), i.pub("logAPIError", "news")
                    };
                    hnapi.news(function (e) {
                            return c = !1, !e || e.error ? (f(), void 0) : (amplify.store("hacker-news", e), amplify.store("hacker-news-cached", !0, {
                                        expires: 6e5
                                    }), amplify.store("hacker-news2", null), o(e), hnapi.news2(function (e) {
                                        e && !e.error && (amplify.store("hacker-news2", e), n("hwlist").insertAdjacentHTML("beforeend", '<li><a class="more-link">More&hellip;<span class="loader"></span></a></li>'))
                                    }), void 0)
                        }, function () {
                            c = !1, f()
                        })
                }
            }
        },
        reload: function () {
            i.news.render({
                    delay: 300
                })
        },
        more: function (e) {
            e.classList.add("loading");
            var t = amplify.store("hacker-news2");
            setTimeout(function () {
                    e.classList.remove("loading");
                    var r = e.parentNode;
                    if (r && (r.parentNode && r.parentNode.removeChild(r), t)) {
                        var o = t.slice(),
                            s = i.news.markupStories(o, 31);
                        n("hwlist").insertAdjacentHTML("beforeend", s)
                    }
                }, 400)
        }
    };
    var u = n("view-comments"),
        f = u.querySelector("header h1"),
        d = u.querySelector("section");
    i.comments = {
        currentID: null,
        render: function (e) {
            if (e) {
                var n = amplify.store.sessionStorage("hacker-item-" + e);
                if (i.comments.currentID != e || !n) {
                    i.comments.currentID = e;
                    var r = function (e, t) {
                        if (e && !e.error) {
                            var n = o(e);
                            amplify.store.sessionStorage("hacker-comments-" + t, n);
                            var r = d.querySelector(".comments>ul");
                            if (r.querySelector(".more-link-container") || r.insertAdjacentHTML("beforeend", '<li class="more-link-container"><a class="more-link" data-id="' + t + '">More&hellip;</a></li>'), n.more_comments_id) {
                                var i = function (e) {
                                    var t = amplify.store.sessionStorage("hacker-comments-" + e);
                                    t ? t.more_comments_id && i(t.more_comments_id) : hnapi.comments(e, function (t) {
                                            t && !t.error && (amplify.store.sessionStorage("hacker-comments-" + e, t), t.more_comments_id && i(t.more_comments_id))
                                        })
                                };
                                i(n.more_comments_id)
                            }
                        }
                    }, a = function (e, n) {
                            var a = o(e),
                                l = s("post-comments");
                            if (a.has_post = !! a.title, !a.has_post) return i.setTitle(), f.innerHTML = "", d.innerHTML = l.render(a), i.pub("adjustCommentsSection"), i.pub("onRenderComments"), void 0;
                            var c = s("comments"),
                                u = t.createElement("a");
                            if (/^item/i.test(a.url) ? a.url = "http://news.ycombinator.com/" + a.url : (u.href = a.url, a.domain = u.hostname.replace(/^www\./, "")), a.has_comments = a.comments && !! a.comments.length, a.i_point = 1 == a.points ? "point" : "points", a.i_comment = 1 == a.comments_count ? "comment" : "comments", a.has_content = !! a.content, a.poll) {
                                var m = 0,
                                    p = 0;
                                a.poll.forEach(function (e) {
                                        var t = e.points;
                                        t > p && (p = t), m += t, e.i_point = 1 == t ? "point" : "points"
                                    }), a.poll.forEach(function (e) {
                                        var t = e.points;
                                        e.percentage = (100 * (t / m)).toFixed(1), e.width = (100 * (t / p)).toFixed(1) + "%"
                                    }), a.has_poll = a.has_content = !0
                            }
                            a.short_hn_url = "news.ycombinator.com/item?id=" + n, a.hn_url = "http://" + a.short_hn_url, i.setTitle(a.title), f.innerHTML = a.title;
                            var h = l.render(a, {
                                    comments_list: c
                                }),
                                v = t.createElement("div");
                            v.innerHTML = h;
                            for (var b = v.querySelectorAll("a"), w = 0, g = b.length; g > w; w++) {
                                var y = b[w];
                                if (y.classList.contains("comment-permalink")) {
                                    var n = y.dataset ? y.dataset.id : y.getAttribute("data-id");
                                    y.href = "http://news.ycombinator.com/item?id=" + n
                                }
                                y.target = "_blank"
                            }
                            if (h.length > 2e4) for (var _ = v.querySelectorAll(".comments>ul>li>ul"), T = s("comments-toggle"), S = 0, g = _.length; g > S; S++) {
                                    var k = _[S],
                                        E = k.querySelectorAll(".metadata").length;
                                    k.style.display = "none", E && k.insertAdjacentHTML("beforebegin", T.render({
                                                comments_count: E,
                                                i_reply: 1 == E ? "reply" : "replies"
                                            }))
                            }
                            for (; d.hasChildNodes();) d.removeChild(d.childNodes[0]);
                            for (; v.hasChildNodes();) d.appendChild(v.childNodes[0]);
                            if (delete v, a.more_comments_id) {
                                var n = a.more_comments_id,
                                    L = amplify.store.sessionStorage("hacker-comments-" + n);
                                L ? r(L, n) : hnapi.comments(n, function (e) {
                                        r(e, n)
                                    })
                            }
                            i.pub("onRenderComments")
                        };
                    if (n) d.scrollTop = 0, a(n, e);
                    else {
                        var l = amplify.store("hacker-news");
                        if (l) for (var c = 0, u = l.length; u > c; c++) {
                                var m = l[c];
                                if (e == m.id) {
                                    n = m;
                                    break
                                }
                        }
                        if (!n) {
                            var l = amplify.store("hacker-news2");
                            if (l) for (var c = 0, u = l.length; u > c; c++) {
                                    var m = l[c];
                                    if (e == m.id) {
                                        n = m;
                                        break
                                    }
                            }
                        }
                        n ? (n.loading = !0, a(n, e)) : a({
                                loading: !0
                            }, e);
                        var p = function () {
                            n ? (delete n.loading, n.load_error = !0, a(n, e)) : a({
                                    load_error: !0
                                }, e), i.pub("logAPIError", "comments")
                        };
                        hnapi.item(e, function (t) {
                                if (i.comments.currentID == e) {
                                    if (!t || t.error && "comments" == i.currentView) return p(), void 0;
                                    amplify.store.sessionStorage("hacker-item-" + e, t, {
                                            expires: 3e5
                                        }), i.news.updateStory({
                                            id: e,
                                            data: t
                                        }), a(t, e)
                                }
                            }, function () {
                                i.comments.currentID == e && p()
                            })
                    }
                }
            }
        },
        toggle: function (e) {
            var t = e.nextElementSibling;
            if (t) {
                var n = t.style,
                    r = d.scrollTop;
                n.display = "none" == n.display ? "" : "none", d.scrollTop = r
            }
        },
        more: function (e) {
            var n = e.dataset ? e.dataset.id : e.getAttribute("data-id"),
                r = amplify.store.sessionStorage("hacker-comments-" + n);
            if (r) {
                var o = s("comments"),
                    i = s("comments"),
                    a = o.render(r, {
                            comments_list: o
                        }),
                    l = e.parentNode,
                    c = l.parentNode,
                    u = r.more_comments_id,
                    f = t.createElement("ul");
                f.innerHTML = a;
                for (var d = f.querySelectorAll("a"), m = 0, p = d.length; p > m; m++) d[m].target = "_blank";
                for (var h = f.children, m = 0, p = h.length; p > m; m++) {
                    var v = h[m].getElementsByTagName("ul")[0],
                        b = v.querySelectorAll(".metadata").length;
                    v.style.display = "none", b && v.insertAdjacentHTML("beforebegin", i.render({
                                comments_count: b,
                                i_reply: 1 == b ? "reply" : "replies"
                            }))
                }
                for (u && amplify.store.sessionStorage("hacker-comments-" + u) && f.insertAdjacentHTML("beforeend", '<li class="more-link-container"><a class="more-link" data-id="' + u + '">More&hellip;</a></li>'), c.removeChild(l); f.hasChildNodes();) c.appendChild(f.childNodes[0]);
                delete f
            } else alert("Oops, the comments have expired.")
        },
        reload: function () {
            i.comments.currentID = null, ruto.reload()
        }
    }, i.init = function () {
        i.news.render(), ruto.init()
    }, e.hw = i, ruto.config({
            before: function (e, t) {
                i.hideAllViews();
                var r = n("view-" + t);
                r.classList.remove("hidden"), i.currentView = t, i.setTitle(r.querySelector("header h1").textContent)
            },
            notfound: function () {
                ruto.go("/")
            }
        }).add("/", "home").add("/about", "about").add(/^\/item\/(\d+)$/i, "comments", function (e, t) {
            i.comments.render(t)
        })
}(window),
function (e) {
    var t = e.document,
        n = t.body,
        r = {
            clockwise: ["flip-out-to-left", "flip-in-from-left"],
            anticlockwise: ["flip-out-to-right", "flip-in-from-right"]
        }, o = function (e) {
            var t = e["in"],
                o = e.out,
                i = t.classList,
                s = o.classList,
                a = e.direction,
                l = e.fn,
                c = r[a],
                u = function () {
                    t.removeEventListener("webkitAnimationEnd", u, !1), n.classList.remove("viewport-flip"), s.add("hidden"), i.remove("flip"), s.remove("flip"), s.remove(c[0]), i.remove(c[1]), l && l.apply()
                };
            n.classList.add("viewport-flip"), i.remove("hidden"), s.add("flip"), i.add("flip"), t.addEventListener("webkitAnimationEnd", u, !1), s.add(c[0]), i.add(c[1])
        }, i = {
            rtl: ["slide-out-to-left", "slide-in-from-right"],
            ltr: ["slide-out-to-right", "slide-in-from-left"]
        }, s = function (e) {
            var t = e["in"],
                n = e.out,
                r = t.classList,
                o = n.classList,
                s = t.getElementsByTagName("header")[0],
                a = n.getElementsByTagName("header")[0],
                l = s.classList,
                c = a.classList,
                u = e.direction,
                f = e.fn,
                d = i[u],
                m = function () {
                    o.add("hidden"), t.removeEventListener("webkitAnimationEnd", m, !1), o.remove("sliding"), r.remove("sliding"), o.remove(d[0]), r.remove(d[1]), l.remove("transparent"), c.remove("transparent"), f && f.apply()
                };
            r.remove("hidden"), o.add("sliding"), r.add("sliding"), t.addEventListener("webkitAnimationEnd", m, !1), l.add("transparent"), c.add("transparent"), o.add(d[0]), r.add(d[1])
        }, a = function () {
            return e.innerWidth >= 640 ? "wide" : "narrow"
        }, l = t.querySelector("meta[name=viewport]");
    l || (l = t.createElement("meta"), l.name = "viewport", t.head.appendChild(l)), l.content = "width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0";
    var c = navigator.userAgent,
        u = c && /iPhone|iPod/.test(c),
        f = 6 > parseInt((c.match(/ OS (\d+)_/i) || [, 0])[1], 10);
    u && f && n.classList.add("ios5");
    var d = "wide" == a();
    e.addEventListener("resize", function () {
            var e = "wide" == a();
            e != d && (d = e, location.reload())
        }), n.insertAdjacentHTML("beforeend", d ? '<div id="overlay" class="hide"></div>' : '<header class="fake"></header>'), ruto.config({
            before: function (e, t, n) {
                var r = hw.currentView,
                    i = hw.hideAllViews,
                    a = $("view-" + t);
                switch (hw.setTitle(a.querySelector("header h1").textContent), t) {
                case "home":
                    if (d) {
                        i(), $("overlay").classList.add("hide"), a.classList.remove("hidden");
                        var l = $("view-comments");
                        l.classList.remove("hidden"), l.querySelector("section").innerHTML = '<div class="view-blank-state"><div class="view-blank-state-text">No Story Selected.</div></div>', l.querySelector("header h1").innerHTML = "", l.querySelector("header a.header-back-button").style.display = "none", hw.comments.currentID = null, hw.pub("selectCurrentStory")
                    } else r ? "about" == r ? o({
                                "in": a,
                                out: $("view-" + r),
                                direction: "anticlockwise"
                            }) : "home" != r && s({
                                "in": a,
                                out: $("view-" + r),
                                direction: "ltr"
                            }) : (i(), a.classList.remove("hidden"));
                    hw.currentView = "home";
                    break;
                case "about":
                    d ? (a.classList.remove("hidden"), $("view-home").classList.remove("hidden"), $("view-comments").classList.remove("hidden"), setTimeout(function () {
                                $("overlay").classList.remove("hide")
                            }, 1)) : r ? "about" != r && o({
                            "in": a,
                            out: $("view-home"),
                            direction: "clockwise"
                        }) : (i(), a.classList.remove("hidden")), hw.currentView = "about";
                    break;
                case "comments":
                    if (d) i(), $("overlay").classList.add("hide"), a.classList.remove("hidden"), $("view-home").classList.remove("hidden"), hw.pub("selectCurrentStory", n[1]), a.querySelector("header a.header-back-button").style.display = "";
                    else if (r) {
                        if ("comments" != r) {
                            var c = n[1];
                            c && hw.comments.currentID != c && (a.querySelector("section").scrollTop = 0), s({
                                    "in": a,
                                    out: $("view-" + r),
                                    direction: "rtl"
                                })
                        }
                    } else i(), a.classList.remove("hidden");
                    hw.currentView = "comments"
                }
            }
        }), e.addEventListener("pagehide", function () {
            for (var e = t.querySelectorAll(".view"), n = {}, r = 0, o = e.length; o > r; r++) {
                var i = e[r];
                n[i.id] = i.querySelector(".scroll section").scrollTop || 0
            }
            amplify.store("hacker-scrolltops", n)
        }, !1);
    var m = function () {
        var e = amplify.store("hacker-scrolltops");
        setTimeout(function () {
                for (var t in e) $(t).querySelector(".scroll section").scrollTop = e[t]
            }, 1)
    };
    if (e.addEventListener("pageshow", m, !1), m(), u) {
        var p = t.querySelectorAll(".view>.scroll"),
            h = null;
        Array.prototype.forEach.call(p, function (r) {
                r.addEventListener("touchstart", function () {
                        if (e.innerHeight != h) {
                            if (e.scrollTo(0, 0), f) {
                                var r = t.createElement("div");
                                r.style.height = "600px", n.appendChild(r), setTimeout(function () {
                                        n.removeChild(r)
                                    }, 100)
                            }
                            h = e.innerHeight
                        }
                    }, !1)
            })
    }
    tappable(".view>header a.header-button[href]", {
            noScroll: !0,
            onTap: function (e, t) {
                var n = t.hash;
                d && /about/i.test(ruto.current) && "#/" == n ? ruto.back("/") : location.hash = n
            }
        }), tappable("#view-home-refresh", {
            noScroll: !0,
            onTap: hw.news.reload
        });
    var v = !1;
    tappable(".view>header h1", {
            onTap: function (e, t) {
                var r = t.parentNode.nextElementSibling.firstElementChild;
                if (0 == r.scrollTop || v) {
                    if (u) {
                        var o = n.style.height;
                        n.style.height = "100%", setTimeout(function () {
                                n.style.height = o
                            }, 100)
                    }
                } else {
                    if (v) return;
                    v = !0;
                    var i = r.style.overflow;
                    r.style.overflow = "hidden", setTimeout(function () {
                            r.style.overflow = i;
                            var e, t = new TWEEN.Tween({
                                        scrollTop: r.scrollTop
                                    }).to({
                                        scrollTop: 0
                                    }, 300).easing(TWEEN.Easing.Cubic.InOut).onUpdate(function () {
                                        r.scrollTop = this.scrollTop
                                    }).onComplete(function () {
                                        cancelAnimationFrame(e), t.stop(), v = !1, delete t
                                    }).start(),
                                n = function () {
                                    TWEEN.update(), requestAnimationFrame(n)
                                };
                            e = requestAnimationFrame(n)
                        }, 200)
                }
            }
        });
    var b;
    tappable("#view-home .tableview-links li>a:first-child", {
            allowClick: !d,
            activeClassDelay: 100,
            inactiveClassDelay: d ? 100 : 1e3,
            onStart: function (e, t) {
                if (d) {
                    var n = t.parentNode;
                    n && (n = n.parentNode, b = setTimeout(function () {
                                n && n.classList.add("list-tapped")
                            }, 100))
                }
            },
            onMove: function () {
                d && clearTimeout(b)
            },
            onEnd: function (e, t) {
                if (d) {
                    clearTimeout(b);
                    var n = t.parentNode.parentNode;
                    setTimeout(function () {
                            n && n.classList.remove("list-tapped")
                        }, 100)
                }
            },
            onTap: function (t, n) {
                n.classList.contains("more-link") ? hw.news.more(n) : /^#\//.test(n.getAttribute("href")) ? location.hash = n.hash : n.href && d && e.open(n.href)
            }
        }), tappable("#view-about .grouped-tableview-links li>a:first-child", {
            allowClick: !0,
            activeClassDelay: 100,
            inactiveClassDelay: 1e3
        }), tappable("#view-home .tableview-links li>a.detail-disclosure-button", {
            noScroll: !0,
            noScrollDelay: 100,
            onTap: function (e, t) {
                location.hash = t.hash
            }
        }), tappable("button.comments-toggle", function (e, t) {
            hw.comments.toggle(t)
        }), tappable("section.comments li>a.more-link", function (e, t) {
            hw.comments.more(t)
        }), tappable("#view-comments .load-error button", hw.comments.reload), hw.sub("selectCurrentStory", function (e) {
            if (d) {
                e || (e = (location.hash.match(/item\/(\d+)/) || [, ""])[1]);
                for (var t = $("view-home"), n = t.querySelectorAll("a[href].selected"), r = 0, o = n.length; o > r; r++) n[r].classList.remove("selected");
                if (e) {
                    var i = t.querySelector('a[href*="item/' + e + '"]');
                    i && (i.classList.add("selected"), setTimeout(function () {
                                i.scrollIntoViewIfNeeded ? i.scrollIntoViewIfNeeded() : i.scrollIntoView()
                            }, 1))
                }
            }
        }), hw.sub("onRenderNews", function () {
            hw.pub("selectCurrentStory")
        }), e.addEventListener("pageshow", function () {
            setTimeout(function () {
                    "home" == hw.currentView && $("hwlist") && !amplify.store("hacker-news-cached") && hw.news.reload()
                }, 1)
        }, !1);
    var w = function () {
        var e = t.querySelector("#view-comments section");
        if (e) {
            var n = e.querySelector(".post-content"),
                r = e.querySelector(".comments");
            if (r) {
                var o = e.offsetHeight - n.offsetHeight + 1,
                    i = $("comment-section-style");
                i || (i = t.createElement("style"), i.id = "comment-section-style", t.head.appendChild(i)), i.textContent = ".view section.comments{min-height: " + o + "px;}"
            }
        }
    };
    hw.sub("onRenderComments", function () {
            setTimeout(w, d ? 1 : 360)
        }), e.addEventListener("resize", w, !1), e.addEventListener("orientationchange", w, !1);
    var g = e.orientation !== void 0,
        y = function () {
            g && (n.style.height = screen.height + "px", setTimeout(function () {
                        e.scrollTo(0, 0), n.style.height = e.innerHeight + "px"
                    }, 1))
        };
    if (d) {
        var _ = $("apploader");
        _.parentNode.removeChild(_)
    } else "complete" == t.readyState ? y() : e.addEventListener("load", y, !1), g && (e.onorientationchange = y), setTimeout(function () {
                var e = $("apploader");
                e && (e.classList.add("hide"), e.addEventListener("webkitTransitionEnd", function () {
                            e.parentNode.removeChild(e)
                        }, !1))
            }, 200);
    hw.news.options.disclosure = !d, hw.init()
}(window);
