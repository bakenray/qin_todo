#! /usr/bin/env node

const program = require('commander');
const api =  require('./index.js');
const pkg = require('./package.json')
if(process.argv.length === 2){ //说明用户直接运行 node cli.js 没有传参数
   void api.showAll()
   return 
}

program
  .version(pkg.version)
  .option('-x, --xxx','this is xxx')

program
  .command('add')
  .description('Add a todo item')
  .action((...args) => {
    const words = args.slice(1).join(' ')
    api.add(words).then(
        ()=>{console.log('添加成功')},
        ()=>{console.log('添加失败')}
    )
  })
program
  .command('clear')
  .description('clear todo item')
  .action(() => {
    api.clear().then(
        ()=>{console.log('清除完毕')},
        ()=>{console.log('清除失败')}
    )
  })

program.parse(process.argv);


