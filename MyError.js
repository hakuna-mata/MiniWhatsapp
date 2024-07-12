class MyError extends Error{
    constructor(status,msg){
        super()
        this.status=status;
        this.msg=msg;
    }
}

module.exports=MyError;