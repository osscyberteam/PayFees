// 🔴 আপনার গুগল অ্যাপস স্ক্রিপ্টের Web App URL লিঙ্কটি এখানে বসান 🔴
const scriptURL = 'https://script.google.com/macros/s/AKfycbyEboiatmeXyuyUEWNv1zi_q23zXvEt_7Jb3TMNogsdag7nAV1hxE77lW5t8kPTNVyCyA/exec';

function onReasonChange() {
  updateAmount();
  updateDynamicFields();
}

function onMethodChange() {
  var paymentOption = document.getElementById("payment_option").value;
  var receiptDetails = document.getElementById("receipt-details");
  var instruction = document.getElementById("method-instruction");

  if (paymentOption !== "") {
    receiptDetails.style.display = "block";
    
    var selectedText = "";
    if(paymentOption === "bkash") selectedText = "বিকাশ (01410892693)";
    else if(paymentOption === "nagad") selectedText = "নগদ (01410892693)";
    else if(paymentOption === "rocket") selectedText = "রকেট (01410892693)";

    instruction.innerText = "আমাদের " + selectedText + " নম্বরে টাকা সেন্ড মানি করে নিচের তথ্যগুলো পূরণ করুন:";
    
    // ডাইনামিক রিকোয়ার্ড
    document.getElementById("sender_number").required = true;
    document.getElementById("trx_id").required = true;
    document.getElementById("amount").required = true;

    updateAmount();
    updateDynamicFields();
  } else {
    receiptDetails.style.display = "none";
    document.getElementById("sender_number").required = false;
    document.getElementById("trx_id").required = false;
    document.getElementById("amount").required = false;
  }
}

function updateDynamicFields() {
  var reasonSelect = document.getElementById("payment_reason").value;
  var paymentOption = document.getElementById("payment_option").value;
  
  var certFields = document.getElementById("cert-fields");
  var problemFields = document.getElementById("problem-fields");

  var userName = document.getElementById("user_name");
  var userPhone = document.getElementById("user_phone");
  var userAddress = document.getElementById("user_address");
  var problemDetails = document.getElementById("problem_details");

  if (paymentOption !== "" && reasonSelect !== "") {
    if (reasonSelect === "certificate" || reasonSelect === "renew_certificate") {
      certFields.style.display = "block";
      problemFields.style.display = "none";
      
      userName.required = true;
      userPhone.required = true;
      userAddress.required = true;
      problemDetails.required = false;
    } else {
      certFields.style.display = "none";
      problemFields.style.display = "block";

      userName.required = false;
      userPhone.required = false;
      userAddress.required = false;
      problemDetails.required = true;
    }
  } else {
    certFields.style.display = "none";
    problemFields.style.display = "none";
    
    userName.required = false;
    userPhone.required = false;
    userAddress.required = false;
    problemDetails.required = false;
  }
}

function updateAmount() {
  var reasonSelect = document.getElementById("payment_reason");
  var selectedOption = reasonSelect.options[reasonSelect.selectedIndex];
  var amountInput = document.getElementById("amount");

  if (selectedOption && selectedOption.dataset.amount) {
    amountInput.value = selectedOption.dataset.amount;
  }
}

// গুগল শিটে ডাটা পাঠানো ও পপ-আপ প্রসেস
function handleFormSubmit(event) {
  event.preventDefault(); 
  var submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;
  submitBtn.innerText = "প্রসেসিং হচ্ছে...";

  var form = document.forms['google-sheet'];

  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => {
      submitBtn.disabled = false;
      submitBtn.innerText = "পেমেন্ট সাবমিট করুন";
      
      var modal = document.getElementById("popupModal");
      if (modal) {
        modal.style.display = "flex";
      }
    })
    .catch(error => {
      submitBtn.disabled = false;
      submitBtn.innerText = "পেমেন্ট সাবমিট করুন";
      alert('সমস্যা হয়েছে! অনুগ্রহ করে আবার চেষ্টা করুন।');
      console.error('Error!', error.message);
    });
}

// রিফ্রেশ ও রিসেট ফাংশন
function resetAndRefresh() {
  location.reload(); 
}
