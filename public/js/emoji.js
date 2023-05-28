
var mess=document.getElementById('message');
 var emoji=document.querySelector('emoji-picker')
 var btn=document.getElementById('emoji');
 var element=document.querySelector('.em')

btn.addEventListener('click',()=>
{
   element.classList.toggle('em-active');

   
    
})

mess.addEventListener('click',()=>
{
   element.classList.remove('em-active');

   
    
})
  emoji.addEventListener('emoji-click', (event) =>
  {       
      mess.focus()
      mess.value+=event.detail.unicode;
 });



   
          
  
       

