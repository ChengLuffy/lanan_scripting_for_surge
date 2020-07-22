import requests
import base64
import json
import time
from urllib import parse
from urllib.parse import unquote

# 方式1 订阅链接
SUB_URL = ""
# 转译后的文件存储位置
FILE_PATH = ""

response = requests.get(url=SUB_URL)
content = response.content.decode("utf-8")

all = base64.b64decode(content).decode("utf-8")
arr = all.split('\n')

ret = "#%s\n" % (time.asctime( time.localtime(time.time()) ))
for ele in arr:
    if ele.startswith('vmess'):
        json_str = base64.b64decode(ele.split('vmess://')[-1]).decode("utf-8")
        if len(json_str) != 0 :
            dict = json.loads(json_str)
            ws = ''
            if str(dict['net']) == "ws":
                ws = ', ws=true, ws-path=%s' % (dict['path'])
                pass
            item = "%s = vmess, %s, %s, username=%s, tls=%s%s\n" % (dict["ps"], dict["add"], dict["port"], dict["id"], "true" if dict["tls"] == "tls" else "false", ws)
            ret += item
            pass
        pass
    elif ele.startswith('trojan'):
        trojanInfo = parse.urlparse(ele)
        nodeInfo = trojanInfo.netloc.split('@')
        password = nodeInfo[0]
        serverInfoStr = nodeInfo[1]
        serverInfo = serverInfoStr.split(':')
        server = serverInfo[0]
        port = serverInfo[1]
        name = trojanInfo.fragment.replace("\r", "")
        item = "%s = trojan, %s, %s, password=%s\n" % (unquote(name, 'utf-8'), server, port, password)
        ret += item
        pass

with open(FILE_PATH, 'wt') as f:
    f.write(ret)
    f.close()
