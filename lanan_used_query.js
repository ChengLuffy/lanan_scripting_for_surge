// 用户名
const name = "";
// 密码
const passwd = "";

var token;

const url = "https://v2ray.api.lanan.xyz/client/api.php";

function login() {
    console.log("开始登录");

    var params = {
        "username": name,
        "password": passwd
    }

    var formBody = [];

    for (var property in params) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(params[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    let table = {
        url: url + "?s=user.auth",
        header: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) lanan-mac/2.0.1 Chrome/59.0.3071.115 Electron/1.8.7 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formBody
    }

    $httpClient.post(table, async function(error, response, data) {
        if (error) {
            console.log(error);
            $notification.post(title + '登录失败', error, "");
        } else {
            console.log(data.data);
            var obj = JSON.parse(data);
            token = obj.data;
            await loadPackages()
        }
    })
}

function loadPackages() {

    console.log("开始获取套餐");

    let table = {
        url: url + "?s=whmcs.hosting&token=" + token,
        header: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) lanan-mac/2.0.1 Chrome/59.0.3071.115 Electron/1.8.7 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }

    $httpClient.get(table, async function(error, response, data) {
        if (error) {
            console.log(error);
            $notification.post(title + '获取套餐信息失败', error, "");
        } else {
            var obj = JSON.parse(data);
            var arr = obj.data;
            for (let i = 0; i < arr.length; i++) {
                var element = arr[i];
                await loadUseage(element.serverId, element.packageId, element.name, element.regDate, element.expireDate)
            }
        }
    })
}

function loadUseage(serverId, packageId, name, regDate, expireDate) {

    console.log("开始获取套餐使用情况");

    let table = {
        url: url + "?s=v2ray.userInfo&token=" + token + "&serverId=" + serverId + "&packageId=" + packageId,
        header: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) lanan-mac/2.0.1 Chrome/59.0.3071.115 Electron/1.8.7 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }
    $httpClient.get(table, async function(error, response, data) {
        if (error) {
            console.log(error);
            $notification.post(title + '获取套餐使用信息失败', error, "");
        } else {
            console.log("获取套餐使用成功");
            var obj = JSON.parse(data);
            var u = obj.data.u / 1024.0 / 1024.0 / 1024.0;
            var d = obj.data.d / 1024.0 / 1024.0 / 1024.0;
            var transfer_enable = obj.data.transfer_enable / 1024.0 / 1024.0 / 1024.0;
            var body = "已使用：" + (u + d).toFixed(2) + "GB  总量：" + transfer_enable + "GB";
            var content = "注册时间：" + regDate + "  到期时间：" + expireDate
            $notification.post(name, body, content);
        }
    })
}

login()
$done();