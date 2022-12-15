let regexForId = /.*_/gm

let id = "g_1_xd0ru2ms"
let id2 = "g_12_xd0ru2ms"

let newId = id.replace(regexForId,"")

console.log(newId)


