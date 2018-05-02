"use strict";
class PromiseOrchestrator {
  constructor() {}

  execute(context, workFunction, paramArray, option) {
    //console.log('execute',paramArray);
    let executor = new PromisesExecutor(context, workFunction, paramArray, option);
    return executor.execute();
  }

}

//maxSametimeExecution,intervalBewtwenExecution,workFunction
class PromisesExecutor {
  constructor(context, workFunction, paramArray, option) {
    this.increment = 0;
    this.incrementResolved = 0;
    this.globalOut = new Array(paramArray.length);
    this.context = context;
    this.workFunction = workFunction;
    this.paramArray = paramArray;
    this.option = option;
  }

  execute() {
    return new Promise((resolve, reject) => {
      this.initialPromiseResolve = resolve;
      this.initialPromiseReject = reject;
      //console.log("length",this.paramArray.length);
      for (let i = 0; i < Math.min(10,this.paramArray.length); i++) {
        //console.log("i",i);
        this.incrementExecute();
      }
    });
  }
  incrementExecute() {
    try {
      //console.log("incrementResolved",this.incrementResolved);
      if (this.incrementResolved == this.paramArray.length) {
        //console.log('END',  this.globalOut);
        //console.log('END');
        this.initialPromiseResolve(this.globalOut);
      } else if(this.increment < this.paramArray.length){
        //console.log('new PromiseExecutor',this.increment);
        let promiseExecutor = new PromiseExecutor(this.context, this.workFunction, this.paramArray, this.option, this.increment);
        promiseExecutor.execute().then((currentOut) => {
          //console.log("currentOut",currentOut);
          this.globalOut[currentOut.index] = currentOut.value;
          this.incrementResolved++;
          this.incrementExecute();
        }).catch((e) => {
          //this.globalOut[currentOut.index]=currentOut.value;
          this.globalOut[currentOut.index] = currentOut.value;
          this.incrementResolved++;
          this.incrementExecute();

        }).then(() => {
          // this.increment++;
          // this.incrementExecute(context,workFunction,paramArray,option);
        });
        this.increment++;
        // //console.log('incrementExecute',this.globalOut.length,paramArray.length);
        // let currentParams=this.paramArray[this.increment];
        // //console.log('apply',currentParams);
        // this.workFunction.apply(this.context,currentParams).then((currentOut)=>{
        //   //console.log('sucess execution',currentOut);
        //   this.globalOut.push(currentOut);
        //   this.increment++;
        //   this.incrementExecute();
        // }).catch((e)=>{
        //   // console.log('fail exection');
        //   this.globalOut.push({'$error':e});
        //   console.log('Orchestrator Error',e);
        //   this.increment++;
        //   this.incrementExecute();
        // }).then(()=>{
        //   // this.increment++;
        //   // this.incrementExecute(context,workFunction,paramArray,option);
        // })
      }
    } catch (e) {
      //console.log(e);
      this.initialPromiseReject(e);
    }

  }
}

class PromiseExecutor {
  constructor(context, workFunction, paramArray, option, index) {
    this.context = context;
    this.workFunction = workFunction;
    this.paramArray = paramArray;
    this.option = option;
    this.index = index;
  }
  execute() {
    return new Promise((resolve, reject) => {
      let currentParams = this.paramArray[this.index];
      //console.log('apply',currentParams);
      try {
        this.workFunction.apply(this.context, currentParams).then((currentOut) => {
          //this.globalOut[this.index] = currentOut;
          resolve({
            index: this.index,
            value: currentOut
          });
        }).catch((e) => {
          // console.log('fail exection');
          // this.globalOut[this.index] = {
          //   'error': e
          // };
          // resolve();
          resolve({
            index: this.index,
            value: {
              'error': e
            }
          });
        }).then(() => {
          // this.increment++;
          // this.incrementExecute(context,workFunction,paramArray,option);
        })
      } catch (e) {
        reject({
          index: this.index,
          value: {
            'error': e
          }
        });
      }
    });
  }
}

module.exports = PromiseOrchestrator;
