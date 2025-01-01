const popupCard = document.getElementById('popup-content')
const closePopUp = document.getElementById('close-popup')

closePopUp.addEventListener('click', function(){
    popupCard.style.display = 'none'
})


let complaint_id = {}
function getElement(element){
   popupCard.style.display = 'block';
   document.getElementById('username').innerText = element.getAttribute('data-username')
   document.getElementById('user-email').innerText = element.getAttribute('data-email')
   document.getElementById('status').innerText = element.getAttribute('data-status')
   document.getElementById('complaint-Id').innerText = element.getAttribute('data-Id')
   document.getElementById('complaint-Date').textContent = element.getAttribute('data-date')
   document.getElementById('Complaints').textContent = element.getAttribute('data-description')

   complaint_id = element.getAttribute('data-Id')
   console.log(complaint_id, 'id is')

   let markButton = document.getElementById('mark-check')
        if(element.getAttribute('data-status') !== "pending"){
            markButton.innerText = 'cheked'
            markButton.ariaDisabled = true;
            markButton.style.opacity = '0.7'
            markButton.style.cursor = 'not-allowed'
            markButton.disabled = true;
        }
        else{
            markButton.innerText = 'Cheak Mark';
            markButton.ariaDisabled = false;
            markButton.style.opacity = '';
            markButton.style.cursor = 'pointer'
            markButton.disabled = false;
        }
 
}

function markCheked(){
    const complaintID = complaint_id;

    if(!complaintID){
        console.log('complaint id is undefined or null')
    }
    
    fetch(`/complaint/update/${complaintID}`, {
        method :'PUT'
    })
    .then((response)=>{
        if(!response){
            throw new Error('updating failed!')            
        }
        return response.text();
    })
    .then((message) => {
        console.log(message);
    })
    .catch((err)=>{
        console.log(err, 'error')
    })

    window.location.href = '/complaint-files'
    
}


function formatDateTime(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}