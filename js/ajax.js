var $ = {
    ajax: function (options) {
        var xhr = null,
            url = options.url,
            method = options.method || 'get',
            async = typeof (options, async) === 'undefined' ? true : options.async,
            data = options.data || null,
            params = '',
            callback = options.success,
            error = options.error;
        if (data) {
            for (var i in data) {
                params += i + '=' + data[i] + '&';
            }
            var reg = /['&']$/;
            params = params.replace(reg, '');
        }
        //根据method 的值改变url
        if (method == 'get') {
            url += '?' + params;

        }
        // console.log(url);
        if (typeof XMLHttpRequest != 'undefined') {
            xhr = new XMLHttpRequest();
        } else if (typeof ActiveXObject != 'undefined') {
            //IE7.0-
            var xhrArr = ['Microsoft.XMLHTTP',
                'MSXML2.XMLHTTP.6.0', 'MSXML2.XMLHTTP.5.0',
                'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0',
                'MSXML2.XMLHTTP.2.0'];
            var len = xhrArr.length;
            for (var i = 0; i < len; i++) {
                try {
                    xhr = new ActiveXObject(xhrArr[i]);
                    break;
                } catch (ex) {

                }
            }
        } else {
            throw new Error('No XHR object')
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    callback && callback(JSON.parse(xhr.responseText));
                } else {
                    error && error();
                }
            }
        }
        xhr.open(method, url, async);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(params);
    },
    jsonp: getJSONP,
}

function getJSONP(options) {
    var url = options.url,
        callback = options.callback,
        a = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
        r1 = Math.floor(Math.random * 10),
        r2 = Math.floor(Math.random * 10),
        r3 = Math.floor(Math.random * 10),
        name = 'getJSONP' + a[r1] + a[r2] + a[r3],
        cbname = 'getJSONP.' + name,
        reg = /'?'/;
    if (reg.test(url)) {
        url += '&jsonp=' + cbname;
    } else {
        url += '?jsonp=' + cbname;
    }
    var script = document.createElement('script');
    getJSONP[name] = function (data) {
        try {
            callback && callback(data);
        } catch{

        } finally {
            delete getJSONP[name];
            script.parentElement.removeChild(script);
        }

    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}



$.jsonp({
    url: 'http://class.imooc.com/api/jsonp',
    callback: function (data) {
        console.log(data);
    }
});

