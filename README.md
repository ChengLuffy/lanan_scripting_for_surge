# lanan_scripting_for_surge
自搭建 Surge 订阅 蓝岸的服务的中转服务器，附带 Surge 定时脚本查询套餐用量

### Surge 订阅蓝岸服务器中转
—
需要安装 python3（ 以及 requests module），搭建完成后下载 [lanan_sub_for_surge.py](./lanan_sub_for_surge.py) 文件，编辑文件，填写 `SUB_URL` （蓝岸订阅方式1）、 `FILE_PATH` （转译后的文件存储的完整路径，包括文件名），之后使用 

``` 
python3 /’path_to‘/lanan_sub_for_surge.py 
``` 
验证运行结果。

上方验证通过后，利用 `corntab` 进行定时运行，起一个 `nginx` 服务，将上方 `FILE_PATH` 设定成 `nginx` 的文件目录下，通过 Surge 的 `外部代理列表` 可以实现订阅。也可以在 **Mac** 上定时运行，并直接将 `FILE_PATH` 设定成配置文件同步目录下的文件实现订阅。

### ~Surge 定时脚本查询套餐用量~由于官网设置，已经不受支持
—
~复制 [lanan_used_query.js](./lanan_used_query.js) 到 Surge 本地脚本，填写 `name`、`passwd`， 设定脚本类型为 `Cron`，填写表达式，如 `0 8 * * *` 代表每天早上八点自动运行。~