

exports.getDate=function (){


const options= {
    weekday: 'long',years: 'numeric', month:'long', day:'numeric'
   }
   const today=new Date();
   return today.toLocaleDateString('en-Us',options);
}

exports.getDay=function (){
    const options= {
        weekday: 'long'
       }
       const today=new Date();
       return today.toLocaleDateString('en-Us',options);
    }

