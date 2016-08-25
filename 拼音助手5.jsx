/**
* @@@BUILDINFO@@@ 拼音助手2.jsx !Version! Fri Feb 24 2012 16:02:24 GMT+0800
*/

#targetengine "pinyinzhushou" //建立新会话

ScriptPreference.enableRedraw = false;

//声明
var declare = "本脚本一切都开放，请任意使用！\n如果出错，请联系我：qq 7470718。\n请勿贩卖此脚本！！！！！！\n请把有问题的字及时发给我!\n加载字库文件时间稍长，请耐心等待！\n版权所有：闫刚，2012年2月25日";

//汉字类
function HanZi(zi, pinyin, isDuoYinZi)
{
    this.zi = zi;
    this.pinyin = pinyin;
    this.isDuoYinZi = isDuoYinZi;    
    }

//词类
function Ci(ci, pinyin, isDuoYinCi)
{
    this.ci = ci;
    this.pinyin = pinyin;
    this.isDuoYinCi =   isDuoYinCi; 
    }

////拼音字词库文件
try{
var ziFile = File ('/x/拼音助手/汉字.txt');
var changYongCiFile = new File('/x/拼音助手/常用词.txt');
var duoYinDuoDuoYiCiFile = new File ('/x/拼音助手/多音多义词.txt');
var qingShengCiFile = new File ('/x/拼音助手/轻声词.txt');
var qingShengDuoYinCiFile = new File ('/x/拼音助手/轻声多义词.txt');
var ziDingYiCiFile = new File ('/x/拼音助手/轻声多义词.txt');
}
catch(ziKuError)
{
alert("字库文件没有找到！");    
    }

var ziBiao = createZiBiao(); //字表
//$.writeln(ziBiao["2"]);
var regHanZi = /^[\u4e00-\u9fa5]/; //汉字正则表达式   
//var changYongCiBiao = createChangYongCiBiao();//常用词表
var qingShengCi = createQingShengCiBiao();
var qingShengDuoYiCi = createQingShengDuoYiCiBiao();

//如果没有打开的文件，新建一个测试文档
try{
var curDocument = app.activeDocument;
}catch(docError){
    curDocument = app.documents.add();
    var pinYinTextFrame = curDocument.pages.item(0).textFrames.add();
    pinYinTextFrame.geometricBounds = ["6p", "6p", "44p", "44p"];
    pinYinTextFrame.contents = declare;
    }

//创建多音字颜色
try{
    var duoYinColor = curDocument.colors.item("duoYinColor");
    duoYinColorName = duoYinColor.name;
    //~ //The color style did not exist, so create it. 
    }catch (colorError){//如果存在，则赋值
    var duoYinColor = curDocument.colors.add({name:"duoYinColor", model:ColorModel.process, colorValue:[15, 100, 100, 0]});
    }

/////////////////////UI

   var mainWindow = new Window ("palette", "拼音助手") ;   
   mainWindow.frameLocation= [600, 500];
   mainWindow.size= [120, 300];   
   
   mainWindow.btnPanel = mainWindow.add('panel',  [0 , 0, 120, 300]);
   mainWindow.btnPanel.ziDongZhuYinBtn =  mainWindow.btnPanel.add ('button', [10 , 20, 110, 60],  '自动注音');
   mainWindow.btnPanel.ziDongZhuYinBtn.onClick = ziDongZhuYin;
   
   mainWindow.btnPanel.jiaoDuiDuoYinZiBtn =  mainWindow.btnPanel.add ('button', [10 , 70, 110, 110],  '多音字校对');
   mainWindow.btnPanel.jiaoDuiDuoYinZiBtn.onClick = jiaoDuiDuoYinZi;
   
   mainWindow.btnPanel.qingShengCiBtn =  mainWindow.btnPanel.add ('button', [10 , 120, 110, 160],  '轻声词校对');
   
 //  mainWindow.btnPanel.jianChaDuoYinZiBtn =  mainWindow.btnPanel.add ('checkBox', [10 , 170, 110, 210],  '全部注音');
 //  mainWindow.btnPanel.jianChaDuoYinZiBtn =  mainWindow.btnPanel.add ('checkBox', [10 , 170, 110, 210],  '全部注音');
      
   mainWindow.show();

   
///////////////////////////
//自动注音
///////////////////
function ziDongZhuYin()
{
    //$.writeln("zidongzhuyin called!!");   
    sel = app.selection[0];
    
    try{
    switch(sel.constructor.name)
        {
        case "Character":
            {
                addPinYin(sel);                
                break; 
                }
        
        case "Word":
        case "Text":
        case "TextStyleRange":
        case "TextFrame":
        case "Paragraph":
            { 
                var curChar = new Character;
               $.writeln(sel.characters.length);
                var length = sel.characters.length;
                
                var count = 0; 
                while(count < length )
                    {
                        curChar = sel.characters[count];
//~                         if(sel.characters.nextItem(curChar).constructor.name != 'Character')
//~                             break;
                        if(regHanZi.test (curChar.contents.toString ()))//使用正则表达式检查是否是汉字
                            addPinYin (curChar);   
                        count++;
                        //$.writeln(sel.characters.nextItem(curChar).constructor.name);

                      };//end of while               
                break;
                } //end of case
         
        default:
            alert("请选择文本或文本框");
            break;
        }//end of switch    
        }//end of try
    catch(selError)
        {
            alert("请选择文本。");
            }
    }


//////////
//检查多音字
/////////
function jiaoDuiDuoYinZi()
{
    //$.writeln("zidongzhuyin called!!");
    
    sel = app.selection[0];
    
    try{
    switch(sel.constructor.name)
    {
        case "Character":
            {
                gaiDuoYinZi(sel);                
                break; 
                }
        
        case "Word":
        case "Text":
        case "TextStyleRange":
        case "TextFrame":
        case "Paragraph":
            {
                var curChar = new Character;
                $.writeln(sel.characters.length);
                var length = sel.characters.length;
                
                var count = 0; 
                while(count < length )
                    {
                        curChar = sel.characters[count]; 
                        $.writeln(count);
                        $.writeln(curChar.contents[0]);
                        
                        if(regHanZi.test(curChar.contents[0]) && ziBiao[character.contents[0]].pinyin.length > 1)
                        {
                                 gaiDuoYinZi (curChar);   
                            };
                        count++;
                        };//end of while
                    
                    break;         
                }//end of Word   Text        
        default:
            alert("请选择文本或文本框");            
        }//end of switch     
    }
    catch(selError)
    {
         alert("请选择多音字。");
       }
    }


//创建字表函数
function createZiBiao()
{
    var ziBiao = new Array;
    var haXiZiBiao = new Array;
    
    var zi;
    var pinyin;
    var isDuoYinZi = false;
    
    var tempString = new String;
    tempString = "tempString";
    var tempStringArray;
    ziFile.open('read');
    
    while(tempString!= ziFile.eof )
     {
         tempString = ziFile.readln(); 
         
         if(tempString == '')
            break;
        // $.writeln (tempString);
         tempStringArray = tempString.split('|');
        // $.writeln (tempStringArray);
         pinyin = tempStringArray[1].split(' ');
         //$.writeln (pinyin);
         
         zi = tempStringArray[0][0]; 
         //$.writeln (zi);
         if(pinyin.length>1)
             isDuoYinZi = true;         
         hanzi = new HanZi (zi, pinyin, isDuoYinZi);
         //$.writeln(hanzi.zi);
        ziBiao.push (hanzi) ;         
       }//end of while

    for(var i = 0 ; i<ziBiao.length; i++)
        {
            haXiZiBiao[ziBiao[i].zi] = ziBiao[i];
            }
    
    ziFile.close();
    return haXiZiBiao;
    }//end of  createZiBiao()

function createChangYongCiBiao()
{
    
    }



//添加拼音函数
function addPinYin(character)
{
        pinyin = ziBiao[character.contents[0]].pinyin;    
        character.rubyFlag = true;
        character.rubyString = pinyin[0];
        
        if(pinyin.length>1)
        {
            try{
                var duoYinColor = curDocument.colors.item("duoYinColor");
                duoYinColorName = duoYinColor.name;
                //~ //The color style did not exist, so create it. 
                }catch (colorError){//如果存在，则赋值
                var duoYinColor = curDocument.colors.add({name:"duoYinColor", model:ColorModel.process, colorValue:[15, 100, 100, 0]});
                }

            character.fillColor = duoYinColor;
            //character.rubyFill = duoYinZiYanSe.name;
            }
        
    }



//修改多音字函数
function gaiDuoYinZi(character)
{
    var pinyin = ziBiao[character.contents[0]].pinyin;
    var duoYinZiWin = new Window ('window',  '多音字' , [150, 150, 600, 150]);
    var yin = "";

    duoYinZiWin.size =[400, 80];
    //duoYinZiWin.size.width = 400;

    var ziPanel = duoYinZiWin.add ('panel', [5, 5, 395, 75], '选择多音字');

    var leftPos = 10;
    var rightPos = 80;

    for(var i =0; i < pinyin.length; i++)
    {
        
        tmpRButton = ziPanel.add ("radiobutton", [leftPos, 20, rightPos, 40],  pinyin[i]);
       
        leftPos += 80;
        rightPos += 80;
        
        if(rightPos> 240)
        {
            duoYinZiWin.size.width += 45;
            ziPanel.size.width += 45;        
            }
        
       if(0==i)    
          tmpRButton.value = true;
          
        tmpRButton.onClick = function()
        {
            $.writeln(this.text);
            $.writeln(character.contents);
            character.rubyString = this.text;
            
            };
        //$.writeln(yin);
                                
        };//end of for
    
      duoYinZiWin.show();

      };// end of function
    
//创建轻声词表
function createQingShengCiBiao(){
    
    };

//创建轻声多义词表
function createQingShengDuoYiCiBiao(){
    
    };
