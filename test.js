const vm = new Vue({
  el:'#app',
  data: {
    name: '叶锆锆',
    age: 32,
    sex: '男',
    pokes: ['A', '3', 'K', 'J'],
    profile: {
      email: '792142550@qq.com',
      qq: '792152660',
      mobile: '15906666156',
      wife: {
        name: '荣彤',
        age: 32,
        sex: '女',
      }
    }
  }
});
console.log(vm)
setTimeout(() => {
  // vm.$set(vm.profile, 'xyz', 'xxxxx')
  vm.pokes.push(6)
  // vm.pokes.push(6)
  // vm.pokes.push(6)
  // vm.pokes[999] = '6';
  // vm.name = '章三'
  // vm.age = '40'
  // vm.sex = '女'
  // vm.profile.email = '1234567@qq.com'

  // // vm.profile.wife.name = '周四'
  // vm.profile.wife = {
  //   name: '李若天',
  //   age: 31,
  //   sex: '女'
  // }
},3000)
setTimeout(() => {
  // vm.profile.xyz = '周五'
  vm.pokes[3] = 7;
  vm.pokes[4] = 7;
},6000)
