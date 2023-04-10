// can't understand truly what is it for. for dealing with already founded scripts? or for founding on-request in the main thread and giving it to a worker? Or should it completely parse http requests?
function execute(script:string){
    console.log(script);
}

export{execute}