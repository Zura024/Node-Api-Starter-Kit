const utils = require('./utils')

it('should add two number',()=>{
    let res = utils.add(14,17) ;

    if (res !== 31){
        throw new Error(`Expected 4, but got ${res}`);
    }
});

it('should square number',()=>{
    let res = utils.square(5) ;

    if (res !== 25){
        throw new Error(`Expected 25, but got ${res}`);
    }
});