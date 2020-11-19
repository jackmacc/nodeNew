const fs      = require('fs')
const express = require('express')
const multer  = require('multer')
const path    = require('path');

const app     = express();
const upload  = multer({dest:'upload/'});

//多文件上传 （限定上传文件个数）（没有修改后缀）

let uploadMultfile=upload.array('myfile',3); //如果超出数量会报错

app.post(
    '/upload-multi',(req,res)=>{
        uploadMultfile(req,res,(err)=>{
            //错误处理
        if(!!err){
            res.json({
                code: '2000',
                type:'upload-multi',
                fileList:[],
                msg: err.message
            });
        }


        //得到原始文件名输出
        let fileList = [];
        req.files.map((elem)=>{

            //___________________________________分隔_______________________________________
            //以下代码得到文件后缀
            let  name=elem.originalname;
            let nameArray=name.split('');
            let nameMime=[];
           let l=nameArray.pop();
            nameMime.unshift(l);
            while(nameArray.length!=0&&l!='.'){
                l=nameArray.pop();
                nameMime.unshift(l);
            }
            //Mime是文件的后缀
          let Mime=nameMime.join('');
           // console.log(Mime);
          //  res.send("done");
            //重命名文件 加上文件后缀
            fs.renameSync(
                './upload/'+elem.filename,
                './upload/'+elem.filename+Mime
            );


            //___________________________________分隔_______________________________________



            fileList.push({
                originalname: elem.originalname
            })
        });

        //输出文件名
        res.json({
            code: '0000',
            type:'upload-multi',
            fileList:fileList,
            msg:''
        });
    })},
    function(req,res,next){
        res.send("2 done:"+arraynum);
    }
)


//单文件上传获取信息
app.post(
    '/upload-single',
    upload.single('myfile'),
    function(req,res,next){
        let file=req.file;
        console.log("名称：%s",file.originalname);
        console.log("mime：%s",file.mimetype);
        //以下代码得到文件后缀
        const  name=file.originalname;
        nameArray=name.split('');
        var nameMime=[];
        l=nameArray.pop();
        nameMime.unshift(l);
        while(nameArray.length!=0&&l!='.'){
            l=nameArray.pop();
            nameMime.unshift(l);
        }
    //Mime是文件的后缀
        Mime=nameMime.join('');
        console.log(Mime);
        res.send("done");
        //重命名文件 加上文件后缀
        fs.renameSync(
            './upload/'+file.filename,
            './upload/'+file.filename+Mime
        );

    })

//文件下载尝试（chrome会直接在页面上展示。.最后也没有解决）
//设置download文件夹为静态 才能下载
app.use(
    '/download',
    express.static(
        path.join(__dirname, 'download')
    )
);
//
// app.use(
//     '/upload',
//     express.static(
//         path.join(__dirname, 'upload')
//     )
// );


app.use(
    '/public',
    express.static(
        path.join(__dirname, 'public')
    )
);

// app.get('/download',function(req,res){
//     var path='./download/aa.mp3';
//     res.download(path,'aa.mp3');
// });
app.get(
    '/download',
    function(req, res){
        var file = __dirname + '/download/aa.mp3';
        res.download(file);
    }
);

app.get(
    '/',
    function(req,res,next){
        res.sendFile(__dirname+"/public/upserver.html");
    }
);

app.listen(1981, ()=> {
    console.log("port:1981")
});