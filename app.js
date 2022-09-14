const express= require('express');
const app=express();
const bodyparser=require('body-parser');
const mongoose=require('mongoose');
const _=require('lodash');
mongoose.connect("mongodb://localhost:27017/todolist",{useNewUrlParser:true})
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'));

const itemSchema= mongoose.Schema({
    item:String
});
const Item=new mongoose.model('Item',itemSchema);
const item1= Item({
    item:"Eat Food"
});
const item2= Item({
    item:"Drink Coffee"
})

defaultitems=[item1,item2];
const listSchema=mongoose.Schema({
    name:String,
    items:[itemSchema]
})
const List= mongoose.model('List',listSchema)
app.get('/',function (req,res){
    Item.find({},function (err,itemfounded){
    if(itemfounded==0){
    Item.insertMany(defaultitems,function (err){
    if(err){
        console.log(err)
    }
    else {
        console.log("/ in Successfully added")
    }
   })
   res.redirect('/')
    }
    else { 
       
        
        res.render('list',{ListTitle:"Today", itemlist:itemfounded});}
        
    })
   
})
app.post('/delete',function (req,res){
    let checkid=req.body.checkbox;
    let list=req.body.list[0];
    
   if(list=="Today"){
   Item.findOneAndRemove({id:checkid},function (err,result){
    if(!err){ 
        console.log("Successfully deleted.")
        
        
        
    }
    else {
       console.log(err);
    }
   
   })
     res.redirect('/')
}
   else {
     
     List.findOneAndRemove({name:list},{$pull:{items:{id:checkid}}},function (err,result){
        if(!err){
        console.log("result is "+result)
        }
        else {
            console.log(err)
        }
    }
    
     )
     res.redirect('/'+list);
   
   }
})

app.post('/', function (req,res){
    let itemName=req.body.text;
    let itemParams=_.capitalize(req.body.button);
    
     const item= Item({
        item:itemName
    })
   
   if(itemParams=="Today"){ 
    

    item.save();
    res.redirect('/')
    }
   else {
     List.findOne({name:itemParams},function (err,founded){
        founded.items.push(item);
        
        founded.save();
        res.redirect('/'+itemParams)
     })
    

  
   }
  
   
   
})
app.get('/:routename',function (req,res){
  let  customListName=_.capitalize(req.params.routename);  
  
  List.findOne({name:customListName},function(err,results){
   if(!err){ 
    if(!results){
       const list=List({
        name:customListName,
        items:defaultitems
        });
       list.save();
       res.redirect('/'+customListName);
    
    }
    else {
       
       res.render('list',{ListTitle:customListName, itemlist:results.items});
    }}
    else {
        console.log(err)
    }
   
  })
  

 

})
app.get('/about',function (req,res){
    res.render('about');
})

app.listen( 3000, function(){
    console.log("Express server listening on port mode", this.address().port, app.settings.env);
  });