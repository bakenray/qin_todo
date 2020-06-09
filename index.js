const db = require('./db.js')
const inquirer = require('inquirer')

function markAsDone(list,index){
    list[index].done = true
    db.write(list)
}
function markAsUndone(list,index){
    list[index].done = false
    db.write(list)
}
function updateTitle(list,index){
    inquirer.prompt({
        type:'input',
        name:'title',
        message:'请输入新标题',
        default:list[index].title
    }).then((answers)=>{
        list[index].title = answers.title
        db.write(list)
    })
}
function remove(list,index){
    list.splice(index,1)
    db.write(list)
}
function askForAction(list,index){
    const actions = {markAsDone,markAsUndone,updateTitle,remove}

    inquirer.prompt({
        type:'list',
        name:'action',
        message:'请选择操作',
        choices:[
            {name:'已完成',value:'markAsDone'},
            {name:'未完成',value:'markAsUndone'},
            {name:'改标题',value:'updateTitle'},
            {name:'删除',value:'remove'},
            {name:'退出',value:'quit'}
        ]
    })
    .then((answers)=>{
        const action = actions[answers.action]
        action && action(list,index)
      })
}
function askForCreateTask(list){
    inquirer.prompt({
        type:'input',
        name:'title',
        message:'输入todo标题'
    }).then((answers)=>{
        list.push({
            title:answers.title,
            done:false
        })
        db.write(list)
    })
}
function printTasks(list){
    let showList = list.map((task,index)=>{
        return {
            name:`${task.done?'[o]':'[x]'} ${index + 1} - ${task.title}`,
            value:index.toString()
        }
    })

    let allList = [
        ...showList,
        {name:'[新建]',value:'-1'},
        {name:'[退出]',value:'-2'},
    ]
    inquirer
      .prompt({
            type:'list',
            name:'index',
            message:'请选择想操作的任务',
            choices:allList
      })
      .then(answers => {
          const index = Number(answers.index)
          if(index>= 0){
              askForAction(list,index)
          }
          else if(index === -1){
            askForCreateTask(list)
          }
      })
}

module.exports.add = async (title) => {
    // 读取
    const list = await db.read()
    // 添加
    list.push({title,done:false})
    // 储存
    await db.write(list)
}
module.exports.clear = async () => {
    await db.write([])
}
module.exports.showAll = async () => {    
    const list = await db.read()
    printTasks(list)
}


