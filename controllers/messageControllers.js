import messageModel from "../model/messageModel.js"


export const getMessage = async(req,res)=>{
    try{
     const {from,to} = req.body
     const messages = await messageModel.find({
        users: {
          $all: [from, to],
        },
      }).sort({ updatedAt: 1 })
     const projectedMessage = messages.map((msg)=>{
        return{
            fromSelf:msg.sender.toString() === from,
            message:msg.message.text,
        }
     });
     res.send({
        success:true,
        message:'Message received',
        data:projectedMessage
    })
    }catch(err) {
        res.status(500)
    }
}

export const addMessage = async(req,res)=>{
    try{
      const {to,message,from} = req.body
      const data = await messageModel.create({
        message:{text:message},
        users:[from,to],
        sender:from
      })
      console.log(data);
      if(data){
        res.send({
            success:true,
            message:'Message added',
        })
      }else{
        res.send({
            success:false,
            message:'Failed to add message',
        })
      }
    }catch(err) {
        res.status(500)
    }
}

export const getOwnerMessage = async(req,res)=>{
    try{
     const {from,to} = req.body
     const messages = await messageModel.find({
        users: {
          $all: [from, to],
        },
      }).sort({ updatedAt: 1 });

      const projectedMessages = messages.map((msg) => {
        return {
          fromSelf: msg.sender.toString() === from,
          message: msg.message.text,
        };
      });
      res.send({
        success:true,
        message:'Message received',
        data:projectedMessages
    })
    }catch(err) {
        res.status(500)
    }
}

export const addOwnerMessage = async(req,res)=>{
    try{
        const {from,to,message} = req.body
        const data = await messageModel.create({
            message:{text:message},
            users:[from,to],
            sender:from,
        })
        if(data){
            res.send({
                success:true,
                message:'Message added',
            })
          }else{
            res.send({
                success:false,
                message:'Failed to add message',
            })
          }
    }catch(err) {
        res.status(500)
    }
}